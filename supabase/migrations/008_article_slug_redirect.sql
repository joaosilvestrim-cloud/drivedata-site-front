-- ============================================================================
-- DriveData Site — Redirecionamento de slugs antigos de artigo
-- Banco: Supabase do SITE · schema public · Rodar no SQL Editor. Idempotente.
--
-- Quando o slug de um artigo muda (edição no admin ou a correção dos slugs
-- quebrados por acento, ex.: "efici-ncia"), o antigo fica guardado aqui e
-- /article/<antigo> responde 301 para o novo. Links já compartilhados no
-- LinkedIn e já indexados no Google continuam funcionando.
-- ============================================================================

create table if not exists public.article_slug_redirect (
  old_slug   text primary key,
  article_id uuid not null references public.article(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists article_slug_redirect_article_idx
  on public.article_slug_redirect (article_id);

-- Mesmo padrão da 005: só o servidor (SITE_DATABASE_URL) lê e grava.
alter table public.article_slug_redirect enable row level security;
revoke all on public.article_slug_redirect from anon, authenticated;
