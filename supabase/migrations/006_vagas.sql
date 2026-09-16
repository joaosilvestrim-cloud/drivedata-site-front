-- 006_vagas.sql — Vagas (carreiras) e candidaturas do site.
-- Rode no SQL Editor do Supabase do SITE (mesmo banco do 001_blog_admin), ANTES do deploy.
-- Idempotente.
--
-- Modelo: o servidor lê/grava tudo pelo pg (SITE_DATABASE_URL, ignora RLS). O
-- currículo do candidato vai pro bucket PRIVADO job-cvs: o site sobe pelo servidor
-- com a chave anon (policy de INSERT só na pasta cv/), e o admin baixa por URL
-- assinada (policy de SELECT para authenticated = usuários do painel).

create table if not exists job (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  area          text,                                   -- ex.: Engenharia de Dados
  location      text,                                   -- ex.: Barueri/SP · Brasil
  work_model    text not null default 'remoto' check (work_model in ('remoto','hibrido','presencial')),
  contract_type text not null default 'clt'    check (contract_type in ('clt','pj','estagio','temporario')),
  seniority     text,
  summary       text,                                   -- 1-2 frases (lista + card do LinkedIn)
  description   text,                                   -- HTML (editor)
  requirements  text,                                   -- um item por linha
  benefits      text,                                   -- um item por linha
  status        text not null default 'draft'  check (status in ('draft','open','closed')),
  locale        text not null default 'pt',
  apply_url     text,                                   -- candidatura externa (opcional)
  published_at  timestamptz,
  closes_at     timestamptz,
  disabled_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists job_status_idx on job (status, published_at desc);

-- published_at é carimbado na primeira vez que a vaga abre.
create or replace function job_set_published_at() returns trigger language plpgsql as $$
begin
  if new.status = 'open' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;
drop trigger if exists job_published_at on job;
create trigger job_published_at before insert or update on job
  for each row execute function job_set_published_at();

create table if not exists job_application (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid not null references job (id) on delete cascade,
  name          text not null,
  email         text not null,
  phone         text,
  linkedin_url  text,
  portfolio_url text,
  message       text,
  cv_path       text,                                   -- caminho no bucket job-cvs
  cv_name       text,
  cv_mime       text,
  cv_size       int,
  source        text,                                   -- utm/origem
  page          text,
  consent       boolean not null default false,         -- aceite LGPD
  status        text not null default 'new' check (status in ('new','reviewing','interview','approved','rejected')),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists job_application_job_idx on job_application (job_id, created_at desc);

-- Mesmo padrão da 005: RLS ligada sem policy + revoke = API pública fechada; o
-- servidor (role de serviço) segue funcionando.
alter table job enable row level security;
alter table job_application enable row level security;
revoke all on job from anon, authenticated;
revoke all on job_application from anon, authenticated;

-- Bucket privado dos currículos (5 MB, PDF/Word).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'job-cvs', 'job-cvs', false, 5242880,
  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='job_cvs_anon_insert') then
    create policy job_cvs_anon_insert on storage.objects for insert to anon
      with check (bucket_id = 'job-cvs' and (storage.foldername(name))[1] = 'cv');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='job_cvs_admin_read') then
    create policy job_cvs_admin_read on storage.objects for select to authenticated
      using (bucket_id = 'job-cvs');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='job_cvs_admin_delete') then
    create policy job_cvs_admin_delete on storage.objects for delete to authenticated
      using (bucket_id = 'job-cvs');
  end if;
end $$;

-- Conferência:
-- select tablename, rowsecurity from pg_tables where schemaname='public' and tablename in ('job','job_application');
-- select id, public, file_size_limit from storage.buckets where id = 'job-cvs';
