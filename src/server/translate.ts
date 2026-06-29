// Tradução automática de conteúdo (PT -> EN/ES/FR), usada pelo editor de artigos.
// Suporta TRÊS provedores (escolhido por env, sem mudar código):
//   • Google Cloud Translate v2  — GOOGLE_TRANSLATE_API_KEY
//   • DeepL                      — DEEPL_API_KEY (Free termina em ":fx")
//   • LibreTranslate             — LIBRETRANSLATE_URL (+ LIBRETRANSLATE_API_KEY opcional)
// Force um provedor específico com TRANSLATE_PROVIDER=google|deepl|libre.
// Ordem automática (sem TRANSLATE_PROVIDER): google -> deepl -> libre.
// Traduz CAMPO A CAMPO e FATIA HTML grande em blocos, para não estourar limites
// de tamanho por requisição. Preserva o HTML (tags) e traduz só o texto visível.

export type TranslatableFields = {
  title?: string;
  subTitle?: string;
  description?: string;
  content?: string; // HTML (Quill)
  seoTitle?: string;
  seoDescription?: string;
};

const DEEPL_TARGET: Record<string, string> = { en: 'EN-US', fr: 'FR', es: 'ES', pt: 'PT-BR' };
const DEEPL_SOURCE: Record<string, string> = { pt: 'PT', en: 'EN', fr: 'FR', es: 'ES' };

const CHUNK_BUDGET = 90_000; // bytes por requisição (folga sob os limites dos provedores)

type Provider = 'google' | 'deepl' | 'libre' | null;
function provider(): Provider {
  const forced = (process.env.TRANSLATE_PROVIDER || '').toLowerCase();
  if (forced === 'google' && process.env.GOOGLE_TRANSLATE_API_KEY) return 'google';
  if (forced === 'deepl' && process.env.DEEPL_API_KEY) return 'deepl';
  if (forced === 'libre' && process.env.LIBRETRANSLATE_URL) return 'libre';
  if (process.env.GOOGLE_TRANSLATE_API_KEY) return 'google';
  if (process.env.DEEPL_API_KEY) return 'deepl';
  if (process.env.LIBRETRANSLATE_URL) return 'libre';
  return null;
}
export function hasTranslationProvider(): boolean {
  return provider() !== null;
}
export function activeProvider(): string {
  return provider() ?? 'none';
}

// ───────── fatiamento de HTML grande (corta após o fechamento de blocos) ─────────
function splitHtml(html: string, budget: number): string[] {
  if (Buffer.byteLength(html, 'utf8') <= budget) return [html];
  const parts = html.split(/(?<=<\/(?:p|h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|pre|figure|table|div)>)/i);
  const chunks: string[] = [];
  let cur = '';
  for (const part of parts) {
    if (cur && Buffer.byteLength(cur + part, 'utf8') > budget) { chunks.push(cur); cur = part; }
    else cur += part;
  }
  if (cur) chunks.push(cur);
  return chunks.flatMap((c) => (Buffer.byteLength(c, 'utf8') <= budget ? [c] : hardSplit(c, budget)));
}
function hardSplit(s: string, budget: number): string[] {
  const out: string[] = [];
  const step = Math.max(1000, Math.floor(budget / 2));
  for (let i = 0; i < s.length; i += step) out.push(s.slice(i, i + step));
  return out;
}

// ───────── provedores ─────────
async function googleTranslate(texts: string[], from: string, to: string): Promise<string[]> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY!;
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ q: texts, source: from, target: to, format: 'html' }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Google ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data?.data?.translations ?? []).map((x: { translatedText: string }) => x.translatedText);
}

async function deeplTranslate(texts: string[], from: string, to: string): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY!;
  const endpoint = key.trim().endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: `DeepL-Auth-Key ${key}` },
    body: JSON.stringify({
      text: texts,
      source_lang: DEEPL_SOURCE[from] ?? 'PT',
      target_lang: DEEPL_TARGET[to] ?? to.toUpperCase(),
      tag_handling: 'html',
      preserve_formatting: true,
      split_sentences: 'nonewlines',
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`DeepL ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data?.translations ?? []).map((x: { text: string }) => x.text);
}

async function libreTranslate(texts: string[], from: string, to: string): Promise<string[]> {
  const base = (process.env.LIBRETRANSLATE_URL || '').replace(/\/+$/, '');
  const apiKey = process.env.LIBRETRANSLATE_API_KEY || undefined;
  const out: string[] = [];
  // LibreTranslate: 1 texto por requisição (suporte a array varia entre instâncias)
  for (const q of texts) {
    const res = await fetch(`${base}/translate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q, source: from, target: to, format: 'html', ...(apiKey ? { api_key: apiKey } : {}) }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`LibreTranslate ${res.status}: ${t.slice(0, 200)}`);
    }
    const data = await res.json();
    out.push(data?.translatedText ?? '');
  }
  return out;
}

async function translateChunk(texts: string[], from: string, to: string): Promise<string[]> {
  const p = provider();
  if (p === 'google') return googleTranslate(texts, from, to);
  if (p === 'libre') return libreTranslate(texts, from, to);
  return deeplTranslate(texts, from, to);
}

async function translateOneField(text: string, from: string, to: string): Promise<string> {
  const chunks = splitHtml(text, CHUNK_BUDGET);
  if (chunks.length === 1) return (await translateChunk(chunks, from, to))[0] ?? '';
  const out: string[] = [];
  for (const c of chunks) out.push((await translateChunk([c], from, to))[0] ?? '');
  return out.join('');
}

export async function translateFields(fields: TranslatableFields, from: string, to: string): Promise<TranslatableFields> {
  if (!hasTranslationProvider()) throw new Error('Tradução indisponível: configure GOOGLE_TRANSLATE_API_KEY, DEEPL_API_KEY ou LIBRETRANSLATE_URL.');
  const keys = (Object.keys(fields) as (keyof TranslatableFields)[]).filter(
    (k) => typeof fields[k] === 'string' && (fields[k] as string).trim().length > 0,
  );
  const out: TranslatableFields = {};
  for (const k of keys) out[k] = await translateOneField(fields[k] as string, from, to);
  return out;
}
