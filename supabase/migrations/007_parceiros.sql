-- 007_parceiros.sql — Portal do Parceiro: solicitações do programa de parcerias.
-- Rode no SQL Editor do Supabase do SITE (mesmo banco do 001_blog_admin), ANTES do deploy.
-- Idempotente.
--
-- Atenção: a tabela `partner` (migration 002) é OUTRA coisa — são os logos do
-- carrossel de clientes. Esta aqui guarda quem pede para entrar no programa de
-- parceiros comerciais. Por isso o nome `partner_application`.
--
-- Modelo igual ao das vagas: o servidor lê/grava pelo pg (SITE_DATABASE_URL, que
-- ignora RLS); a API pública do PostgREST fica fechada.

create table if not exists partner_application (
  id               uuid primary key default gen_random_uuid(),
  partnership_type text not null default 'indicacao'
                   check (partnership_type in ('indicacao','revenda','implementacao','tecnologica','outro')),
  company          text not null,
  cnpj             text,
  website          text,
  linkedin_url     text,
  contact_name     text not null,
  contact_role     text,
  email            text not null,
  phone            text,
  region           text,                                  -- onde atua (cidade/estado/país)
  segment          text,                                  -- mercado principal da carteira
  company_size     text,                                  -- faixa de colaboradores
  data_maturity    text,                                  -- já atua com dados/BI?
  message          text,
  how_heard        text,
  consent          boolean not null default false,        -- aceite LGPD
  status           text not null default 'new'
                   check (status in ('new','contacted','qualified','approved','rejected')),
  notes            text,                                  -- notas internas
  source           text,
  page             text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists partner_application_status_idx on partner_application (status, created_at desc);
create index if not exists partner_application_type_idx   on partner_application (partnership_type);

-- Mesmo padrão da 005/006: RLS ligada sem policy + revoke = API pública fechada;
-- o servidor (role de serviço) segue funcionando.
alter table partner_application enable row level security;
revoke all on partner_application from anon, authenticated;

-- Conferência:
-- select tablename, rowsecurity from pg_tables where schemaname='public' and tablename = 'partner_application';
