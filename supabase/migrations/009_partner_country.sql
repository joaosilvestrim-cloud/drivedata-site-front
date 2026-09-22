-- ============================================================================
-- DriveData Site — Logo de cliente por país
-- Banco: Supabase do SITE · schema public · Rodar no SQL Editor. Idempotente.
--
-- O drivedata.com.br e o drivedata.ca leem o MESMO banco de conteúdo, então
-- todo logo do carrossel aparecia nos dois sites. Esta coluna resolve:
--   country null  → aparece nos dois (comportamento de hoje, nada muda)
--   country 'BR'  → só no drivedata.com.br
--   country 'CA'  → só no drivedata.ca
-- ============================================================================

alter table public.partner add column if not exists country text;

comment on column public.partner.country is
  'null = aparece nos dois sites; BR = só drivedata.com.br; CA = só drivedata.ca';
