// Imagens embutidas em base64 no HTML dos artigos (<img src="data:image/...">).
// Elas vinham de colar/arrastar imagem no editor e inchavam cada página que
// carregava o conteúdo (a /article chegou a 11,8 MB). Aqui elas sobem para o
// bucket público site-assets e o src passa a apontar para a URL do arquivo.
//
// O nome do arquivo é o hash do conteúdo: a mesma imagem vira sempre o mesmo
// arquivo, então rodar de novo não duplica nada no storage.
import { createHash } from 'crypto';
import { supabaseServer } from './supabase-server';

const BUCKET = 'site-assets';
const FOLDER = 'uploads/articles';

const DATA_IMG_RE =
  /(<img\b[^>]*?\bsrc\s*=\s*)(["'])data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,([A-Za-z0-9+/=\s]+?)\2/gi;

const EXT: Record<string, string> = { png: 'png', jpg: 'jpg', jpeg: 'jpg', gif: 'gif', webp: 'webp', 'svg+xml': 'svg' };

export function hasDataImages(html: string | null | undefined): boolean {
  return !!html && /src\s*=\s*["']data:image\//i.test(html);
}

/** Quantas imagens base64 o HTML tem e quantos bytes elas pesam no HTML. */
export function measureDataImages(html: string | null | undefined): { count: number; bytes: number } {
  let count = 0;
  let bytes = 0;
  if (!html) return { count, bytes };
  for (const m of html.matchAll(DATA_IMG_RE)) {
    count += 1;
    bytes += m[4].length;
  }
  return { count, bytes };
}

async function uploadOnce(sb: Awaited<ReturnType<typeof supabaseServer>>, sub: string, b64: string): Promise<string> {
  const buf = Buffer.from(b64.replace(/\s+/g, ''), 'base64');
  const ext = EXT[sub.toLowerCase()] ?? 'png';
  const hash = createHash('sha1').update(buf).digest('hex');
  const path = `${FOLDER}/${hash}.${ext}`;
  const contentType = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, buf, { upsert: false, contentType });
  // Já existe = mesma imagem subida antes. Serve a mesma URL.
  if (error && !/exist|duplicate/i.test(error.message)) throw new Error(`upload de imagem: ${error.message}`);
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Troca cada <img src="data:..."> por uma URL do storage. Precisa da sessão do
 * admin (cookies), então só roda dentro das rotas /api/admin.
 */
export async function externalizeDataImages(html: string): Promise<{ html: string; uploaded: number; bytes: number }> {
  if (!hasDataImages(html)) return { html, uploaded: 0, bytes: 0 };
  const sb = await supabaseServer();
  const cache = new Map<string, string>();
  let uploaded = 0;
  let bytes = 0;
  const parts: string[] = [];
  let last = 0;
  for (const m of html.matchAll(DATA_IMG_RE)) {
    const [whole, prefix, quote, sub, b64] = m;
    let url = cache.get(b64);
    if (!url) {
      url = await uploadOnce(sb, sub, b64);
      cache.set(b64, url);
      uploaded += 1;
    }
    bytes += b64.length;
    parts.push(html.slice(last, m.index), `${prefix}${quote}${url}${quote}`);
    last = (m.index ?? 0) + whole.length;
  }
  parts.push(html.slice(last));
  return { html: parts.join(''), uploaded, bytes };
}

/** Mesma troca para um campo i18n ({pt,en,…} ou string). Devolve o valor no mesmo formato. */
export async function externalizeI18nImages(v: any): Promise<{ value: any; uploaded: number; bytes: number }> {
  if (typeof v === 'string') {
    const r = await externalizeDataImages(v);
    return { value: r.html, uploaded: r.uploaded, bytes: r.bytes };
  }
  if (!v || typeof v !== 'object') return { value: v, uploaded: 0, bytes: 0 };
  const out: Record<string, any> = { ...v };
  let uploaded = 0;
  let bytes = 0;
  for (const [k, val] of Object.entries(v)) {
    if (typeof val !== 'string') continue;
    const r = await externalizeDataImages(val);
    out[k] = r.html;
    uploaded += r.uploaded;
    bytes += r.bytes;
  }
  return { value: out, uploaded, bytes };
}
