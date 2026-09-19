// Manutenção dos artigos já gravados, rodada pelo admin em /admin/sistema.
// Sempre em dois passos: GET mostra o que mudaria (nada é alterado), POST aplica.
//
//  images → move as imagens base64 de dentro do conteúdo (e da capa) para o storage
//  slugs  → regera os slugs quebrados por acento (efici-ncia → eficiencia) e
//           guarda o antigo em article_slug_redirect para responder 301
import { getPool } from './content-db';
import { rememberOldSlug, slugify, uniqueSlug } from './content-admin';
import { externalizeDataImages, externalizeI18nImages, hasDataImages, measureDataImages } from './inline-images';

const ptOf = (v: any): string => (v && typeof v === 'object' ? v.pt ?? '' : v ?? '');

// Como o slugify ANTIGO gerava: sem remover acento, cada letra acentuada virava '-'.
const legacySlug = (s: string) =>
  (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export type ImageIssue = { id: string; title: string; count: number; bytes: number; cover: boolean };
export type SlugIssue = { id: string; title: string; from: string; to: string };

async function loadArticles() {
  return getPool()
    .query(`select id, slug, title, content, image_url from article order by created_at asc`)
    .then((r) => r.rows as { id: string; slug: string | null; title: any; content: any; image_url: string | null }[]);
}

function contentStrings(v: any): string[] {
  if (typeof v === 'string') return [v];
  if (v && typeof v === 'object') return Object.values(v).filter((x): x is string => typeof x === 'string');
  return [];
}

/** O slug está quebrado se é a versão antiga (com '-' no lugar do acento) do título. */
function brokenSlug(slug: string, title: string): string | null {
  const proposed = slugify(title);
  if (!proposed || !slug) return null;
  // sufixo de desempate: -2, -3… ou os 4 hex que o sistema antigo punha (-112c)
  const base = slug.replace(/-(\d+|[0-9a-f]{4})$/, '');
  if (base === proposed || base === proposed.slice(0, base.length)) return null;
  const legacy = legacySlug(title);
  if (legacy === proposed) return null; // título sem acento: o slug foi escolhido à mão
  return legacy.startsWith(base) ? proposed : null;
}

export async function scanArticles() {
  const rows = await loadArticles();
  const images: ImageIssue[] = [];
  const slugs: SlugIssue[] = [];
  for (const r of rows) {
    const title = ptOf(r.title);
    let count = 0;
    let bytes = 0;
    for (const html of contentStrings(r.content)) {
      const m = measureDataImages(html);
      count += m.count;
      bytes += m.bytes;
    }
    const cover = !!r.image_url && r.image_url.startsWith('data:image/');
    if (cover) bytes += r.image_url!.length;
    if (count || cover) images.push({ id: r.id, title, count, bytes, cover });

    const to = r.slug ? brokenSlug(r.slug, title) : null;
    if (to && r.slug) slugs.push({ id: r.id, title, from: r.slug, to });
  }
  return {
    articles: rows.length,
    images,
    imagesBytes: images.reduce((s, i) => s + i.bytes, 0),
    slugs,
  };
}

export async function fixImages() {
  const rows = await loadArticles();
  let articles = 0;
  let uploaded = 0;
  let bytes = 0;
  for (const r of rows) {
    const needsContent = contentStrings(r.content).some(hasDataImages);
    const needsCover = !!r.image_url && r.image_url.startsWith('data:image/');
    if (!needsContent && !needsCover) continue;

    let content = r.content;
    if (needsContent) {
      const res = await externalizeI18nImages(r.content);
      content = res.value;
      uploaded += res.uploaded;
      bytes += res.bytes;
    }
    let cover = r.image_url;
    if (needsCover) {
      // a capa é só uma URL: embrulha num <img> para reaproveitar a mesma troca
      const res = await externalizeDataImages(`<img src="${r.image_url}">`);
      cover = res.html.match(/src="([^"]+)"/)?.[1] ?? r.image_url;
      uploaded += res.uploaded;
      bytes += res.bytes;
    }
    await getPool().query(`update article set content = $1, image_url = $2, updated_at = now() where id = $3`, [
      typeof content === 'string' ? content : JSON.stringify(content),
      cover,
      r.id,
    ]);
    articles += 1;
  }
  return { articles, uploaded, bytes };
}

export async function fixSlugs() {
  // sem a tabela de redirecionamento, trocar o slug quebraria os links antigos
  await getPool()
    .query(`select 1 from article_slug_redirect limit 1`)
    .catch(() => {
      throw new Error('Rode a migration 008_article_slug_redirect.sql antes de corrigir os slugs.');
    });
  const { slugs } = await scanArticles();
  const done: SlugIssue[] = [];
  for (const s of slugs) {
    const to = await uniqueSlug(s.to, s.id);
    await getPool().query(`update article set slug = $1, updated_at = now() where id = $2`, [to, s.id]);
    await rememberOldSlug(s.from, s.id, to);
    done.push({ ...s, to });
  }
  return { changed: done.length, slugs: done };
}
