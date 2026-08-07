-- 004_portal_fabric_video.sql
-- Vídeo (YouTube) exibido na landing /portal-fabric, editável pelo admin do site.
-- Uma linha = um vídeo; a landing usa a mais recente publicada (disabled_at is null).
-- Publicar/ocultar pelo botão de status do admin (mesma mecânica das demais entidades).
create table if not exists public.portal_fabric_video (
  id          uuid primary key default gen_random_uuid(),
  video_url   text,
  disabled_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Semente: já deixa o vídeo atual publicado, para aparecer sem precisar abrir o admin.
insert into public.portal_fabric_video (video_url)
select 'https://www.youtube.com/watch?v=8ZxStH8TZLU'
where not exists (select 1 from public.portal_fabric_video);
