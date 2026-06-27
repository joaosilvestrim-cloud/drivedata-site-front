// Tradução automática de conteúdo via DeepL.
// Usado pelo editor de artigos: o autor escreve em PT e gera EN/FR para revisar.
// Requer a env DEEPL_API_KEY. Chaves do plano Free terminam em ":fx" e usam o
// endpoint api-free.deepl.com; chaves Pro usam api.deepl.com.

export type TranslatableFields = {
  title?: string;
  subTitle?: string;
  description?: string;
  content?: string; // HTML (Quill)
  seoTitle?: string;
  seoDescription?: string;
};

// PT -> código de origem DeepL; alvos com variante exigida pela API atual.
const TARGET_LANG: Record<string, string> = { en: 'EN-US', fr: 'FR', es: 'ES', pt: 'PT-BR' };
const SOURCE_LANG: Record<string, string> = { pt: 'PT', en: 'EN', fr: 'FR', es: 'ES' };

export function hasTranslationProvider(): boolean {
  return !!process.env.DEEPL_API_KEY;
}

function endpoint(key: string): string {
  return key.trim().endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';
}

// Traduz um conjunto de campos do idioma `from` para UM idioma `to`.
// Faz uma única chamada (array de textos) preservando HTML. Retorna as mesmas chaves.
export async function translateFields(
  fields: TranslatableFields,
  from: string,
  to: string,
): Promise<TranslatableFields> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error('Tradução indisponível: configure DEEPL_API_KEY.');

  const keys = (Object.keys(fields) as (keyof TranslatableFields)[]).filter(
    (k) => typeof fields[k] === 'string' && (fields[k] as string).trim().length > 0,
  );
  if (!keys.length) return {};

  const res = await fetch(endpoint(key), {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: `DeepL-Auth-Key ${key}` },
    body: JSON.stringify({
      text: keys.map((k) => fields[k] as string),
      source_lang: SOURCE_LANG[from] ?? 'PT',
      target_lang: TARGET_LANG[to] ?? to.toUpperCase(),
      tag_handling: 'html', // preserva tags/atributos; traduz só o texto visível
      preserve_formatting: true,
      split_sentences: 'nonewlines',
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`DeepL ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  const translations: { text: string }[] = data?.translations ?? [];
  const out: TranslatableFields = {};
  keys.forEach((k, i) => {
    if (translations[i]?.text != null) out[k] = translations[i].text;
  });
  return out;
}
