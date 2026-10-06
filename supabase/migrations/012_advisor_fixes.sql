-- 012_advisor_fixes.sql — alerta de segurança do Supabase (06/10/2026), projeto Site_Drivedata.
-- bkp_partner_20261001 (cópia de segurança de 01/10) estava sem RLS: a chave pública
-- lia, editava e apagava a cópia pela API. auth_users_view (security_invoker) estava
-- liberada para anon. O site acessa o banco por conexão direta (SITE_DATABASE_URL),
-- que ignora RLS e os grants da API, então nada do site muda.

alter table if exists public.bkp_partner_20261001 enable row level security;
revoke all on table public.bkp_partner_20261001 from anon, authenticated;

revoke all on table public.auth_users_view from anon;
