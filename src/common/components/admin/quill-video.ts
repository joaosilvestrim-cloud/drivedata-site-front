// Suporte a vídeo no editor de artigos (Quill): upload de MP4 e embed de YouTube.
// - MP4: blot HTML5 <video controls> apontando pra URL pública do storage.
// - YouTube: substitui o blot de iframe nativo por um que inclui allow="autoplay"
//   (necessário pro autoplay mudo funcionar dentro do artigo publicado).
// O dimensionamento (16:9 / responsivo) vem do CSS do artigo, porque o
// normalizador do servidor remove width/height/style de todas as tags.

// Limite de tamanho do upload de vídeo. ATENÇÃO: o bucket "site-assets" no
// Supabase também tem um limite próprio de tamanho por arquivo (padrão 50 MB).
// Se for subir vídeos maiores, aumente o limite do bucket em
// Storage → site-assets → Settings → File size limit.
export const MAX_VIDEO_MB = 100;

export const ACCEPTED_VIDEO_MIME = ['video/mp4'];

export function isValidVideoFile(file: File): { ok: boolean; reason?: string } {
  const type = (file.type || '').toLowerCase();
  const nameOk = /\.mp4$/i.test(file.name);
  if (!ACCEPTED_VIDEO_MIME.includes(type) && !nameOk) {
    return { ok: false, reason: 'Formato inválido. Envie um arquivo .mp4.' };
  }
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    return { ok: false, reason: `Arquivo muito grande. Limite de ${MAX_VIDEO_MB} MB.` };
  }
  return { ok: true };
}

// Extrai o ID de um vídeo do YouTube de qualquer formato comum de URL
// (watch?v=, youtu.be, /embed/, /shorts/) ou de um ID puro.
export function youtubeId(input: string): string | null {
  const s = (input || '').trim();
  if (!s) return null;
  // ID puro (11 caracteres do YouTube)
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const url = new URL(s.includes('://') ? s : `https://${s}`);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const m = url.pathname.match(/\/(embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[2];
    }
  } catch {
    // não é URL válida
  }
  return null;
}

// Monta a URL de embed do YouTube (domínio sem cookie). Com autoplay o browser
// exige mudo, então forçamos mute=1 nesse caso.
export function youtubeEmbedUrl(id: string, opts?: { autoplay?: boolean }): string {
  const p = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' });
  if (opts?.autoplay) {
    p.set('autoplay', '1');
    p.set('mute', '1');
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}

let registered = false;

// Registra os blots de vídeo no Quill. Idempotente (o import dinâmico roda uma
// vez, mas o HMR pode reexecutar).
export function registerVideoBlots(Quill: any): void {
  if (registered || !Quill) return;

  const BlockEmbed = Quill.import('blots/block/embed');

  // MP4 hospedado: <video controls> com a URL pública.
  class Mp4Video extends BlockEmbed {
    static create(url: string) {
      const node = super.create();
      node.setAttribute('src', url);
      node.setAttribute('controls', '');
      node.setAttribute('preload', 'metadata');
      node.setAttribute('playsinline', '');
      return node;
    }
    static value(node: HTMLElement) {
      return node.getAttribute('src');
    }
  }
  Mp4Video.blotName = 'dvvideo';
  Mp4Video.tagName = 'VIDEO';
  Quill.register(Mp4Video, true);

  // YouTube: substitui o blot nativo "video" (iframe) por um com allow="autoplay"
  // e loading="lazy". Mantém blotName "video" para o round-trip ao reeditar.
  class YoutubeVideo extends BlockEmbed {
    static create(url: string) {
      const node = super.create();
      node.setAttribute('src', url);
      node.setAttribute('frameborder', '0');
      node.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen');
      node.setAttribute('allowfullscreen', 'true');
      node.setAttribute('loading', 'lazy');
      return node;
    }
    static value(node: HTMLElement) {
      return node.getAttribute('src');
    }
  }
  YoutubeVideo.blotName = 'video';
  YoutubeVideo.tagName = 'IFRAME';
  Quill.register(YoutubeVideo, true);

  registered = true;
}
