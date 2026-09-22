-- ============================================================================
-- DriveData Site — Teck no carrossel do Canadá
-- Banco: Supabase do SITE · Rodar no SQL Editor DEPOIS da 009. Idempotente.
--
-- O arquivo do logo vive no próprio site (public/clientes/teck.svg), igual aos
-- outros 34 logos. country = 'CA' deixa ele só no drivedata.ca.
-- ============================================================================

insert into public.partner (name, image_url, featured, country, "order")
select 'Teck', '/clientes/teck.svg', true, 'CA', 0
where not exists (select 1 from public.partner where image_url = '/clientes/teck.svg');
