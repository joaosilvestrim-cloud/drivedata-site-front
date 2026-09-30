-- 011_job_translations.sql — Tradução das vagas (EN, ES, FR).
-- O admin escreve a vaga em português; ao salvar, o servidor traduz os textos e
-- guarda aqui: { "en": { "title": ..., "summary": ..., ... }, "es": {...}, "fr": {...} }.
-- O site mostra a tradução do idioma escolhido e cai no português se faltar.
alter table job add column if not exists translations jsonb not null default '{}'::jsonb;
