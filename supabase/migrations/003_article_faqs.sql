-- FAQ por artigo. Alimenta a seção visual no fim do artigo E o schema
-- FAQPage (JSON-LD) — o item mais crítico da auditoria de GEO (FAQ com Schema
-- estava 0/100). Formato: array de { "q": "...", "a": "..." }.
alter table article
  add column if not exists faqs jsonb not null default '[]'::jsonb;
