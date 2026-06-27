-- ============================================================================
-- DriveData Site — Painel administrativo do blog (script consolidado)
-- Banco: Supabase do SITE (ndohrwxppauxvsymmvsl) · schema public
-- Idempotente: pode ser executado mais de uma vez sem efeitos colaterais.
-- Rodar no Supabase Dashboard → SQL Editor.
-- ============================================================================

-- ─────────────────────────── 1) ARTIGOS: novos campos ───────────────────────────
alter table public.article
  add column if not exists slug             text,
  add column if not exists status           text        not null default 'draft',
  add column if not exists published_at      timestamptz,
  add column if not exists scheduled_at      timestamptz,
  add column if not exists seo_title         jsonb,
  add column if not exists seo_description   jsonb,
  add column if not exists tags              text[]      not null default '{}',
  add column if not exists document_urls     jsonb       not null default '[]'::jsonb,
  add column if not exists author            text,
  add column if not exists views_count       integer     not null default 0;

-- status válido
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'article_status_chk') then
    alter table public.article
      add constraint article_status_chk check (status in ('draft', 'published', 'scheduled'));
  end if;
end $$;

-- Backfill: artigos legados (sem disabled_at) viram "published"; demais ficam "draft".
update public.article
   set status = 'published',
       published_at = coalesce(published_at, created_at)
 where status = 'draft' and disabled_at is null;

-- Backfill de slug (a partir do título pt) garantindo unicidade com sufixo do id.
update public.article a
   set slug = (case when s.base = '' then 'artigo' else s.base end) || '-' || substr(a.id::text, 1, 4)
  from (
        select id,
               trim(both '-' from regexp_replace(lower(coalesce(title->>'pt', 'artigo')), '[^a-z0-9]+', '-', 'g')) as base
          from public.article
       ) s
 where a.id = s.id and a.slug is null;

-- Índices
create unique index if not exists article_slug_key      on public.article (slug) where slug is not null;
create index        if not exists article_status_idx    on public.article (status);
create index        if not exists article_published_idx on public.article (published_at desc);
create index        if not exists article_tags_idx      on public.article using gin (tags);

-- ─────────────────────────── 2) BIBLIOTECA DE MÍDIA ───────────────────────────
create table if not exists public.media_asset (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  path        text not null,
  file_name   text,
  mime_type   text,
  size_bytes  bigint,
  kind        text not null default 'image',  -- 'image' | 'document'
  width       integer,
  height      integer,
  created_by  text,
  created_at  timestamptz not null default now()
);
create index if not exists media_asset_kind_idx on public.media_asset (kind, created_at desc);

-- ─────────────────────────── 3) ANALYTICS (visitas) ───────────────────────────
create table if not exists public.article_view (
  id            bigserial primary key,
  article_id    uuid references public.article(id) on delete set null,
  path          text,
  lang          text,
  country       text,
  referrer_host text,
  session_id    text,
  user_agent    text,
  created_at    timestamptz not null default now()
);
create index if not exists article_view_created_idx on public.article_view (created_at);
create index if not exists article_view_article_idx on public.article_view (article_id);
create index if not exists article_view_country_idx on public.article_view (country);

-- ─────────────────────────── 4) LOGS DE ERRO ───────────────────────────
create table if not exists public.error_log (
  id         bigserial primary key,
  level      text not null default 'error',
  source     text,
  message    text not null,
  stack      text,
  meta       jsonb,
  created_at timestamptz not null default now()
);
create index if not exists error_log_created_idx on public.error_log (created_at desc);

-- ─────────────────────────── 5) SEGURANÇA ───────────────────────────
-- O app acessa estas tabelas pela connection string de serviço (SITE_DATABASE_URL,
-- role postgres), que ignora RLS. Revogamos o acesso dos papéis públicos do
-- PostgREST (anon/authenticated) para que dados de auditoria/visitas não fiquem
-- expostos pela API REST automática do Supabase.
revoke all on public.media_asset  from anon, authenticated;
revoke all on public.article_view from anon, authenticated;
revoke all on public.error_log    from anon, authenticated;

-- ============================================================================
-- Fim. Resumo do que foi criado/alterado:
--   • article: + slug, status, published_at, scheduled_at, seo_title,
--     seo_description, tags, document_urls, author, views_count (+ índices)
--   • media_asset   (biblioteca de mídia)
--   • article_view  (analytics de visitas)
--   • error_log     (logs de erro)
-- ============================================================================
