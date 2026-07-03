-- 002_partners.sql — Parceiros/Clientes do carrossel da home (configurável no admin)
-- Rode no SQL Editor do Supabase do SITE (mesmo banco do 001_blog_admin), ANTES do deploy.

create table if not exists partner (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  image_url   text not null,
  featured    boolean not null default false,   -- "Top": roda no carrossel
  "order"     int not null default 0,
  disabled_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Seed dos 34 logos atuais (/public/clientes). Só semeia se a tabela estiver vazia.
do $seed$
begin
  if not exists (select 1 from partner) then
    insert into partner (image_url, name, featured, "order") values
    ('/clientes/VISA LOGO 1.svg', 'Visa', true, 0),
    ('/clientes/PEP-a33c9cf1 1.svg', 'PepsiCo', true, 1),
    ('/clientes/FROSTY_portal 1.svg', 'Frosty', true, 2),
    ('/clientes/Camada_1.svg', null, false, 3),
    ('/clientes/Group 1707489281.svg', null, false, 4),
    ('/clientes/image 27993.svg', null, false, 5),
    ('/clientes/image 27996.svg', null, false, 6),
    ('/clientes/image 27997 1.svg', null, false, 7),
    ('/clientes/image 27998.svg', null, false, 8),
    ('/clientes/image 27999.svg', null, false, 9),
    ('/clientes/image 28000.svg', null, false, 10),
    ('/clientes/image 28002.svg', null, false, 11),
    ('/clientes/image 28003.svg', null, false, 12),
    ('/clientes/image 28004.svg', null, false, 13),
    ('/clientes/image 28005.svg', null, false, 14),
    ('/clientes/image 28006.svg', null, false, 15),
    ('/clientes/image 28008.svg', null, false, 16),
    ('/clientes/image 28009.svg', null, false, 17),
    ('/clientes/image 28010.svg', null, false, 18),
    ('/clientes/image 28011.svg', null, false, 19),
    ('/clientes/image 28012.svg', null, false, 20),
    ('/clientes/image 28013.svg', null, false, 21),
    ('/clientes/image 28014.svg', null, false, 22),
    ('/clientes/image 28015.svg', null, false, 23),
    ('/clientes/image 28016.svg', null, false, 24),
    ('/clientes/image 28017.svg', null, false, 25),
    ('/clientes/image 28018.svg', null, false, 26),
    ('/clientes/image 28019.svg', null, false, 27),
    ('/clientes/image 28020.svg', null, false, 28),
    ('/clientes/image 28021.svg', null, false, 29),
    ('/clientes/image 28023.svg', null, false, 30),
    ('/clientes/image 28024.svg', null, false, 31),
    ('/clientes/image 28025.svg', null, false, 32),
    ('/clientes/layer1.svg', null, false, 33);
  end if;
end $seed$;
