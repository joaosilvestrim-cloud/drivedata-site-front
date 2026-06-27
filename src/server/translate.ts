// Tradução automática de conteúdo via DeepL.
// Usado pelo editor de artigos: o autor escreve em PT e gera EN/FR para revisar.
// Requer a env DEEPL_API_KEY. Chaves do plano Free terminam em ":fx" e usam o
// endpoint api-free.deepl.com; chaves Pro usam api.deepl.com.
//
// Traduz CAMPO A CAMPO e FATIA campos grandes em blocos HTML completos, para não
// estourar o limite de ~128 KB por requisição da DeepL (erro 413).

export type TranslatableFields = {
  title?: string;
  subTitle?: string;
  description?: string;
  content?: string; // HTML (Quill)
  seoTitle?: string;
  seoDescription?: string;
};

const TARGET_LANG: Record<string, string> = { en: 'EN-US', fr: 'FR', es: 'ES', pt: 'PT-BR' };
const SOURCE_LANG: Record<string, string> = { pt: 'PT', en: 'EN', fr: 'FR', es: 'ES' };

// Orçamento por requisição (bytes). Limite da DeepL é 128 KiB; deixamos folga
// para o overhead do JSON e para caracteres acentuados (multibyte em UTF-8).
const CHUNK_BUDGET = 90_000;

export function hasTranslationProvider(): boolean {
  return !!process.env.DEEPL_API_KEY;
}

function endpoint(key: string): string {
  return key.trim().endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';
}

// Quebra um HTML grande em pedaços <= budget, cortando só APÓS o fechamento de
// tags de bloco (mantém cada pedaço como HTML válido).
function splitHtml(html: string, budget: number): string[] {
  if (Buffer.byteLength(html, 'utf8') <= budget) return [html];
  const parts = html.split(/(?<=<\/(?:p|h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|pre|figure|table|div)>)/i);
  const chunks: string[] = [];
  let cur = '';
  for (const part of parts) {
    if (cur && Buffer.byteLength(cur + part, 'utf8') > budget) {
      chunks.push(cur);
      cur = part;
    } else {
      cur += part;
    }
  }
  if (cur) chunks.push(cur);
  // Se algum pedaço único ainda for grande demais (bloco gigante sem divisões),
  // corta de forma "burra" por tamanho — raro; preserva o texto, pode partir uma tag.
  return chunks.flatMap((c) =>
    Buffer.byteLength(c, 'utf8') <= budget ? [c] : hardSplit(c, budget),
  );
}

function hardSplit(s: string, budget: number): string[] {
  const out: string[] = [];
  let i = 0;
  // ~budget chars por fatia (aproxima bytes; seguro o suficiente abaixo de 128 KiB)
  const step = Math.max(1000, Math.floor(budget / 2));
  while (i < s.length) {
    out.push(s.slice(i, i + step));
    i += step;
  }
  return out;
}

async function deepl(texts: string[], from: string, to: string): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY!;
  const res = await fetch(endpoint(key), {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: `DeepL-Auth-Key ${key}` },
    body: JSON.stringify({
      text: texts,
      source_lang: SOURCE_LANG[from] ?? 'PT',
      target_lang: TARGET_LANG[to] ?? to.toUpperCase(),
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

async function translateOneField(text: string, from: string, to: string): Promise<string> {
  const chunks = splitHtml(text, CHUNK_BUDGET);
  if (chunks.length === 1) return (await deepl(chunks, from, to))[0] ?? '';
  // traduz pedaço a pedaço (em série, p/ não estourar rate limit) e recompõe
  const out: string[] = [];
  for (const c of chunks) out.push((await deepl([c], from, to))[0] ?? '');
  return out.join('');
}

export async function translateFields(
  fields: TranslatableFields,
  from: string,
  to: string,
): Promise<TranslatableFields> {
  if (!process.env.DEEPL_API_KEY) throw new Error('Tradução indisponível: configure DEEPL_API_KEY.');
  const keys = (Object.keys(fields) as (keyof TranslatableFields)[]).filter(
    (k) => typeof fields[k] === 'string' && (fields[k] as string).trim().length > 0,
  );
  const out: TranslatableFields = {};
  for (const k of keys) {
    out[k] = await translateOneField(fields[k] as string, from, to);
  }
  return out;
}
