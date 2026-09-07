-- ============================================================================
-- DriveData Site — Fechar exposição pública (Security Advisor: rls_disabled_in_public)
-- Banco: Supabase do SITE (ndohrwxppauxvsymmvsl) · schema public
-- Rodar no Supabase Dashboard -> SQL Editor. Idempotente.
--
-- Contexto: TODO o conteúdo do site é lido/gravado pelo SERVIDOR via
-- SITE_DATABASE_URL (role de serviço, que IGNORA RLS) — ver src/server/content-db.ts
-- e content-admin.ts. O navegador só usa o Supabase para login (auth) e upload de
-- imagem (Storage), NUNCA para ler estas tabelas. Portanto, ligar RLS sem policies
-- e revogar anon/authenticated tranca a API pública SEM quebrar o site.
--
-- Sem policy + RLS ligada = a API pública (anon/authenticated do PostgREST) não
-- lê nem escreve nada. A role de serviço continua funcionando normalmente.
-- ============================================================================

do $$
declare
  t text;
  tbls text[] := array[
    'article', 'article_category', 'solution', 'testimonial', 'faq',
    'target_audience_profile', 'partner', 'portal_fabric_video',
    'media_asset', 'article_view', 'error_log'
  ];
begin
  foreach t in array tbls loop
    if exists (select 1 from pg_tables where schemaname = 'public' and tablename = t) then
      execute format('alter table public.%I enable row level security;', t);
      execute format('revoke all on public.%I from anon, authenticated;', t);
    end if;
  end loop;
end $$;

-- Conferência: todas devem sair com rowsecurity = true.
-- select tablename, rowsecurity from pg_tables
--  where schemaname = 'public' order by tablename;
