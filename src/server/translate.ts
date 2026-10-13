// Tradução automática de conteúdo (PT -> EN/ES/FR), usada pelo editor de artigos.
// Provedores (escolhido por env, sem mudar código):
//   • OpenAI                     — OPENAI_API_KEY (OPENAI_TRANSLATE_MODEL, padrão gpt-4.1-mini)
//   • Groq                       — GROQ_API_KEY (plano grátis: 8 mil tokens por minuto)
//   • Google Cloud Translate v2  — GOOGLE_TRANSLATE_API_KEY
//   • DeepL                      — DEEPL_API_KEY (Free termina em ":fx")
//   • LibreTranslate             — LIBRETRANSLATE_URL (+ LIBRETRANSLATE_API_KEY opcional)
// Force um provedor específico com TRANSLATE_PROVIDER=openai|groq|google|deepl|libre.
// Ordem automática (sem TRANSLATE_PROVIDER): openai -> groq -> google -> deepl -> libre.
// Imagem colada no texto (src="data:...") e qualquer atributo enorme saem do texto
// antes de traduzir e voltam depois: só ocupavam tokens (era o erro 413 da Groq).
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

type Provider = 'openai' | 'groq' | 'google' | 'deepl' | 'libre' | null;
function provider(): Provider {
  const forced = (process.env.TRANSLATE_PROVIDER || '').toLowerCase();
  if (forced === 'openai' && process.env.OPENAI_API_KEY) return 'openai';
  if (forced === 'groq' && process.env.GROQ_API_KEY) return 'groq';
  if (forced === 'google' && process.env.GOOGLE_TRANSLATE_API_KEY) return 'google';
  if (forced === 'deepl' && process.env.DEEPL_API_KEY) return 'deepl';
  if (forced === 'libre' && process.env.LIBRETRANSLATE_URL) return 'libre';
  // Sem TRANSLATE_PROVIDER: OpenAI, depois Groq (os dois são LLM e preservam o HTML).
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GROQ_API_KEY) return 'groq';
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

// ───────── atributos grandes (imagem em base64) ficam fora da tradução ─────────
function protect(html: string): { text: string; kept: string[] } {
  const kept: string[] = [];
  const text = html.replace(/(\s(?:src|href|srcset|data-[\w-]+)=")([^"]{180,})(")/gi, (_m, a: string, v: string, b: string) => {
    kept.push(v);
    return `${a}__KEEP_${kept.length - 1}__${b}`;
  });
  return { text, kept };
}
function restore(text: string, kept: string[]): string {
  return text.replace(/__KEEP_(\d+)__/g, (m, i: string) => kept[Number(i)] ?? m);
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
const LANG_NAME: Record<string, string> = { pt: 'português (Brasil)', en: 'inglês', es: 'espanhol', fr: 'francês' };
// LLM (OpenAI ou Groq, mesma API de chat). Traduz preservando o HTML — só o texto visível.
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const OPENAI_MODEL = process.env.OPENAI_TRANSLATE_MODEL || 'gpt-4.1-mini';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function systemPrompt(from: string, to: string) {
  const src = LANG_NAME[from] ?? from, tgt = LANG_NAME[to] ?? to;
  return `Você é um tradutor profissional. Traduza o texto de ${src} para ${tgt}. `
    + `Se houver HTML, preserve EXATAMENTE todas as tags, atributos e estrutura; traduza apenas o texto visível ao leitor `
    + `(e os atributos alt/title quando existirem). Não adicione, remova ou reordene tags. `
    + `Marcadores como __KEEP_0__ ficam exatamente como estão. `
    + `Não envolva a saída em blocos de código. Responda SOMENTE com o texto/HTML traduzido, sem comentários.`;
}
async function llmTranslate(kind: 'openai' | 'groq', texts: string[], from: string, to: string): Promise<string[]> {
  const isOpenAi = kind === 'openai';
  const url = isOpenAi ? 'https://api.openai.com/v1/chat/completions' : 'https://api.groq.com/openai/v1/chat/completions';
  const key = isOpenAi ? process.env.OPENAI_API_KEY! : process.env.GROQ_API_KEY!;
  const out: string[] = [];
  for (const q of texts) {
    if (!q || !q.trim()) { out.push(q ?? ''); continue; }
    let model = isOpenAi ? OPENAI_MODEL : GROQ_MODEL;
    for (let attempt = 0; ; attempt++) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          temperature: 0,
          max_tokens: isOpenAi ? 16000 : 6000,
          messages: [{ role: 'system', content: systemPrompt(from, to) }, { role: 'user', content: q }],
        }),
        signal: AbortSignal.timeout(110_000),
      });
      if (res.ok) {
        const data = await res.json();
        let text = (data?.choices?.[0]?.message?.content ?? '') as string;
        // Remove cercas de código que o modelo às vezes adiciona por reflexo.
        text = text.replace(/^\s*```(?:html)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        out.push(text);
        break;
      }
      const t = await res.text().catch(() => '');
      // modelo fora da conta OpenAI: tenta o mini anterior uma vez
      if (isOpenAi && res.status === 404 && model !== 'gpt-4o-mini') { model = 'gpt-4o-mini'; continue; }
      // limite por minuto (429, ou 413 da Groq por TPM): espera e tenta de novo
      const perMinute = res.status === 429 || (res.status === 413 && /per minute|TPM/i.test(t));
      if (perMinute && attempt < 3) {
        const wait = Number(res.headers.get('retry-after')) || 12;
        await sleep(Math.min(30, Math.max(2, wait)) * 1000);
        continue;
      }
      throw new Error(`${isOpenAi ? 'OpenAI' : 'Groq'} ${res.status}: ${t.slice(0, 200)}`);
    }
  }
  return out;
}

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
  if (p === 'openai' || p === 'groq') return llmTranslate(p, texts, from, to);
  if (p === 'google') return googleTranslate(texts, from, to);
  if (p === 'libre') return libreTranslate(texts, from, to);
  return deeplTranslate(texts, from, to);
}

// LLM devolve no máximo alguns milhares de tokens por resposta: pedaços menores.
// Groq grátis tem 8 mil tokens por minuto somando entrada e saída.
function chunkBudget(): number {
  const p = provider();
  if (p === 'openai') return 24_000;
  if (p === 'groq') return 7_000;
  return CHUNK_BUDGET;
}

/** Traduz um texto solto (aceita HTML), fatiando se for grande. */
export async function translateText(text: string, from: string, to: string): Promise<string> {
  const { text: safe, kept } = protect(text);
  const chunks = splitHtml(safe, chunkBudget());
  if (chunks.length === 1) return restore((await translateChunk(chunks, from, to))[0] ?? '', kept);
  const out: string[] = [];
  for (const c of chunks) out.push((await translateChunk([c], from, to))[0] ?? '');
  return restore(out.join(''), kept);
}

/** os LLM pagos aguentam idiomas em paralelo; a Groq grátis não (limite por minuto) */
export function parallelSafe(): boolean {
  return provider() === 'openai';
}

export async function translateFields(fields: TranslatableFields, from: string, to: string): Promise<TranslatableFields> {
  if (!hasTranslationProvider()) throw new Error('Tradução indisponível: configure OPENAI_API_KEY, GROQ_API_KEY, GOOGLE_TRANSLATE_API_KEY, DEEPL_API_KEY ou LIBRETRANSLATE_URL.');
  const keys = (Object.keys(fields) as (keyof TranslatableFields)[]).filter(
    (k) => typeof fields[k] === 'string' && (fields[k] as string).trim().length > 0,
  );
  const out: TranslatableFields = {};
  for (const k of keys) out[k] = await translateText(fields[k] as string, from, to);
  return out;
}
