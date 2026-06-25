// Camada de conteúdo do site: lê as tabelas de conteúdo do Supabase (Postgres)
// e resolve os campos JSON {pt,en,es,fr} para o idioma pedido (fallback pt).
// Roda só no servidor. Usado tanto pelos route handlers (/api/*) quanto
// diretamente pelos server components (sem pulo HTTP).
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.SITE_DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}

export type Lang = 'pt' | 'en' | 'es' | 'fr';

export function normLang(l?: string | null): Lang {
  const n = (l || '').toLowerCase().split('-')[0];
  return (['pt', 'en', 'es', 'fr'].includes(n) ? n : 'pt') as Lang;
}

// resolve um campo JSON {pt,en,...} (ou string legada) para o idioma, fallback pt
export function t(v: any, lang: Lang): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  return v[lang] || v.pt || '';
}

// ───────── mapeadores (snake_case -> shape que o front espera) ─────────

function mapCategory(c: any, lang: Lang) {
  if (!c) return undefined;
  return {
    id: c.id,
    name: t(c.name, lang),
    whitelabelId: c.whitelabel_id,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    disabledAt: c.disabled_at ?? null,
  };
}

function mapArticle(r: any, lang: Lang) {
  return {
    id: r.id,
    categoryId: r.category_id,
    imageUrl: r.image_url ?? undefined,
    title: t(r.title, lang),
    subTitle: t(r.sub_title, lang) || null,
    description: t(r.description, lang),
    content: t(r.content, lang),
    whitelabelId: r.whitelabel_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    disabledAt: r.disabled_at ?? null,
    category: mapCategory(r.category, lang),
  };
}

// ───────── getters de conteúdo (usados por server components e /api/*) ─────────

export async function getArticles(
  opts: { search?: string | null; limit?: number | null } = {},
  lang: Lang = 'pt',
) {
  const params: any[] = [];
  let sql = `select a.*, row_to_json(c.*) as category
             from article a
             left join article_category c on c.id = a.category_id
             where a.disabled_at is null`;
  if (opts.search) {
    params.push(`%${opts.search}%`);
    sql += ` and (a.title->>'pt' ilike $${params.length} or a.title->>'en' ilike $${params.length})`;
  }
  sql += ` order by a.created_at desc`;
  if (opts.limit && Number.isFinite(opts.limit)) {
    params.push(opts.limit);
    sql += ` limit $${params.length}`;
  }
  return (await query(sql, params)).map((r) => mapArticle(r, lang));
}

export async function getArticleById(id: string, lang: Lang = 'pt') {
  const rows = await query(
    `select a.*, row_to_json(c.*) as category
     from article a
     left join article_category c on c.id = a.category_id
     where a.id = $1 and a.disabled_at is null
     limit 1`,
    [id],
  );
  return rows.length ? mapArticle(rows[0], lang) : null;
}

export async function getSolutions(lang: Lang = 'pt') {
  const rows = await query(`select * from solution where disabled_at is null order by "order" asc, created_at asc`);
  return rows.map((r: any) => ({
    id: r.id,
    title: t(r.title, lang),
    content: t(r.content, lang),
    icon: r.icon ?? '',
    order: r.order,
    whitelabelId: r.whitelabel_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function getTestimonials(lang: Lang = 'pt') {
  const rows = await query(
    `select * from testimonial where disabled_at is null and is_active = true order by "order" asc, created_at asc`,
  );
  return rows.map((r: any) => ({
    id: r.id,
    clientName: t(r.client_name, lang),
    clientCompany: t(r.client_company, lang) || undefined,
    clientAvatar: r.client_avatar ?? undefined,
    testimonial: t(r.testimonial, lang),
    rating: r.rating ?? undefined,
    isActive: r.is_active,
    order: r.order,
    whitelabelId: r.whitelabel_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    disabledAt: r.disabled_at ?? null,
  }));
}

export async function getFaqs(lang: Lang = 'pt') {
  const rows = await query(`select * from faq where disabled_at is null order by created_at asc`);
  return rows.map((r: any) => ({
    id: r.id,
    title: t(r.title, lang),
    description: t(r.description, lang),
    whitelabelId: r.whitelabel_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    disabledAt: r.disabled_at ?? null,
  }));
}

export async function getProfiles(lang: Lang = 'pt') {
  const rows = await query(
    `select * from target_audience_profile where disabled_at is null order by "order" asc, created_at asc`,
  );
  return rows.map((r: any) => ({
    id: r.id,
    title: t(r.title, lang),
    description: t(r.description, lang),
    order: r.order,
    whitelabelId: r.whitelabel_id,
    type: r.type,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}
