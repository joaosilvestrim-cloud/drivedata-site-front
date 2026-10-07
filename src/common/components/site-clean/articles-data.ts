// Leitura dos artigos do site "clean" (lista, artigo e relacionados). Só SELECT.
//
// getArticles() não é usada porque devolve o modelo antigo; a publicação dos
// agendados (publishDueScheduled) é disparada pelas páginas /article, como antes.
// getArticleById() e getArticleRedirect() são reaproveitadas (o corpo continua
// passando pelo normalizeArticleHtml). Só importar em código de servidor.
import { parse } from 'node-html-parser';
import { getArticleById, getArticleRedirect, query, t, type Lang } from '@/server/content-db';
import type { ArticleFaq } from '@/common/model/article.model';
import { ROUTES } from './content';

// Mesmo filtro de visibilidade pública de src/server/content-db.ts (PUBLIC_WHERE).
const PUBLIC_WHERE = `(
  (coalesce(a.status,'published') = 'published' and a.disabled_at is null
     and (a.published_at is null or a.published_at <= now()))
  or (a.status = 'scheduled' and a.scheduled_at is not null and a.scheduled_at <= now())
)`;

/** Dados de um cartão de artigo (serializáveis para o componente cliente). */
export interface CleanArticleCard {
  id: string;
  href: string;
  title: string;
  excerpt: string;
  categoryId: string | null;
  categoryName: string | null;
  imageUrl: string | null;
  date: string | null;
  dateIso: string | null;
}

export interface CleanArticleFull extends CleanArticleCard {
  subTitle: string | null;
  content: string;
  author: string | null;
  readingMinutes: number;
  faqs: ArticleFaq[];
}

const DATE_LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-CA', es: 'es', fr: 'fr-CA' };
const dateFmt = (lang: Lang) =>
  new Intl.DateTimeFormat(DATE_LOCALE[lang] || 'pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });

function toIso(v: unknown): string | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const formatDate = (iso: string | null, lang: Lang) => (iso ? dateFmt(lang).format(new Date(iso)) : null);

const plain = (v: string | null | undefined) =>
  (v || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const articleHref = (slugOrId: string) => `${ROUTES.articles}/${encodeURIComponent(slugOrId)}`;

/** Lista pública, mais recentes primeiro. Sem a coluna content (pesada). */
export async function listArticlesReadOnly(lang: Lang): Promise<CleanArticleCard[]> {
  const rows = await query(
    `select a.id, a.slug, a.category_id, a.image_url, a.title, a.sub_title, a.description,
            a.published_at, a.created_at, row_to_json(c.*) as category
       from article a
       left join article_category c on c.id = a.category_id
      where ${PUBLIC_WHERE}
      order by coalesce(a.published_at, a.created_at) desc`,
  );
  return rows.map((r: any) => {
    const iso = toIso(r.published_at ?? r.created_at);
    return {
      id: r.id,
      href: articleHref(r.slug || r.id),
      title: t(r.title, lang),
      excerpt: plain(t(r.sub_title, lang) || t(r.description, lang)),
      categoryId: r.category_id ?? null,
      categoryName: r.category ? t(r.category.name, lang) || null : null,
      imageUrl: r.image_url || null,
      date: formatDate(iso, lang),
      dateIso: iso,
    };
  });
}

/**
 * Prepara o corpo para leitura, sem afrouxar nada do tratamento atual (o HTML já
 * vem normalizado por getArticleById): tabelas ganham um invólucro com rolagem
 * horizontal própria e blocos de código ficam alcançáveis pelo teclado.
 */
const MEDIA = 'img, picture, video, iframe, table, pre, hr, svg, object, embed';

const TABLE_LABEL: Record<Lang, string> = { pt: 'Tabela', en: 'Table', es: 'Tabla', fr: 'Tableau' };

function prepareBody(html: string, lang: Lang): string {
  if (!html) return '';
  try {
    // O editor grava os espaços como &nbsp;: o parágrafo vira uma "palavra" só e a
    // quebra de linha cai no meio das palavras. Espaço normal resolve.
    const root = parse(html.replace(/&nbsp;|&#160;| /g, ' '), { comment: false });

    // Linhas vazias do editor (<p></p>, <p><br></p>) viram buracos no texto.
    root.querySelectorAll('p, div').forEach((el) => {
      if (el.text.trim() === '' && !el.querySelector(MEDIA)) el.remove();
    });

    // Lista recuada do editor: <li> cujo único conteúdo é outra lista mostra um
    // marcador solto. Sobe os itens da lista interna para o lugar do <li>.
    let changed = true;
    while (changed) {
      changed = false;
      for (const li of root.querySelectorAll('li')) {
        const kids = li.childNodes.filter((c) => !(c.nodeType === 3 && c.text.trim() === ''));
        const only = kids.length === 1 ? kids[0] : null;
        const tag = only && only.nodeType === 1 ? ((only as any).rawTagName || '').toLowerCase() : '';
        if (tag === 'ul' || tag === 'ol') {
          li.replaceWith((only as any).innerHTML);
          changed = true;
          break;
        }
      }
    }

    // Intertítulo feito com parágrafo todo em negrito: ganha o estilo de título
    // interno (continua sendo <p>, só muda a aparência).
    root.querySelectorAll('p').forEach((p) => {
      const els = p.childNodes.filter((c) => c.nodeType === 1);
      const loose = p.childNodes.filter((c) => c.nodeType === 3 && c.text.trim() !== '');
      const text = p.text.trim();
      // Precisa ter texto depois (frase de fecho em negrito não é intertítulo).
      if (els.length === 1 && loose.length === 0 && text.length > 0 && text.length <= 110 && p.nextElementSibling) {
        const t = ((els[0] as any).rawTagName || '').toLowerCase();
        if (t === 'strong' || t === 'b') p.setAttribute('data-subhead', '');
      }
    });

    // Só as tabelas de fora (tabela dentro de tabela rola junto com a de fora).
    root.querySelectorAll('table').forEach((table) => {
      if (table.parentNode?.closest('table')) return;
      table.replaceWith(`<div data-scroll="table" role="region" aria-label="${TABLE_LABEL[lang] || 'Tabela'}" tabindex="0">${table.toString()}</div>`);
    });
    root.querySelectorAll('pre').forEach((pre) => {
      if (!pre.hasAttribute('tabindex')) pre.setAttribute('tabindex', '0');
    });
    return root.toString();
  } catch {
    return html;
  }
}

export type ArticleLookup =
  | { kind: 'found'; article: CleanArticleFull; raw: any }
  | { kind: 'redirect'; to: string }
  | { kind: 'missing' };

/** Artigo por id ou slug (mesma chave da rota /article/[id]). */
export async function findArticleReadOnly(idOrSlug: string, lang: Lang): Promise<ArticleLookup> {
  const raw: any = await getArticleById(idOrSlug, lang);
  if (!raw) {
    // endereço com %XX quebrado (ex.: /article/%E2%80) dava 500; vira 404
    let key: string;
    try {
      key = decodeURIComponent(idOrSlug);
    } catch {
      return { kind: 'missing' };
    }
    const target = await getArticleRedirect(key);
    return target ? { kind: 'redirect', to: articleHref(target) } : { kind: 'missing' };
  }
  const iso = toIso(raw.publishedAt ?? raw.createdAt);
  const words = plain(raw.content).split(' ').filter(Boolean).length;
  const article: CleanArticleFull = {
    id: raw.id,
    href: articleHref(raw.slug || raw.id),
    title: raw.title,
    subTitle: raw.subTitle || null,
    excerpt: plain(raw.subTitle || raw.description),
    categoryId: raw.categoryId ?? null,
    categoryName: raw.category?.name || null,
    imageUrl: raw.imageUrl || null,
    date: formatDate(iso, lang),
    dateIso: iso,
    content: prepareBody(raw.content, lang),
    author: raw.author?.trim() || null,
    readingMinutes: words ? Math.max(1, Math.round(words / 200)) : 0,
    faqs: (raw.faqs || []).filter((f: ArticleFaq) => f?.q?.trim() && f?.a?.trim()),
  };
  return { kind: 'found', article, raw };
}

/** Relacionados: mesma categoria primeiro, depois os mais recentes. */
export function pickRelated(all: CleanArticleCard[], current: CleanArticleFull, n = 3): CleanArticleCard[] {
  const others = all.filter((a) => a.id !== current.id);
  const same = current.categoryId ? others.filter((a) => a.categoryId === current.categoryId) : [];
  const rest = others.filter((a) => !same.includes(a));
  return [...same, ...rest].slice(0, n);
}

/** JSON seguro para <script type="application/ld+json"> (não deixa fechar a tag). */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
