-- Depoimento em vídeo (13/10/2026): o admin cola um link do YouTube ou envia um
-- MP4 (bucket público de mídia do site). A página Sobre mostra o vídeo no cartão.
alter table public.testimonial
  add column if not exists video_url text check (video_url is null or char_length(video_url) <= 600);
