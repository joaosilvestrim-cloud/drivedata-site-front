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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Filtro de visibilidade pública: publicados (com data já no passado) + agendados vencidos.
const PUBLIC_WHERE = `(
  (coalesce(a.status,'published') = 'published' and a.disabled_at is null
     and (a.published_at is null or a.published_at <= now()))
  or (a.status = 'scheduled' and a.scheduled_at is not null and a.scheduled_at <= now())
)`;

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
    slug: r.slug ?? null,
    categoryId: r.category_id,
    imageUrl: r.image_url ?? undefined,
    title: t(r.title, lang),
    subTitle: t(r.sub_title, lang) || null,
    description: t(r.description, lang),
    content: t(r.content, lang),
    seoTitle: t(r.seo_title, lang) || t(r.title, lang),
    seoDescription: t(r.seo_description, lang) || t(r.description, lang),
    tags: Array.isArray(r.tags) ? r.tags : [],
    documents: Array.isArray(r.document_urls) ? r.document_urls : [],
    author: r.author ?? null,
    status: r.status ?? 'published',
    publishedAt: r.published_at ?? r.created_at,
    scheduledAt: r.scheduled_at ?? null,
    views: Number(r.views_count ?? 0),
    whitelabelId: r.whitelabel_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    disabledAt: r.disabled_at ?? null,
    category: mapCategory(r.category, lang),
  };
}

// ───────── getters de conteúdo (usados por server components e /api/*) ─────────

export async function getArticles(
  opts: { search?: string | null; limit?: number | null; tag?: string | null; categoryId?: string | null } = {},
  lang: Lang = 'pt',
) {
  const params: any[] = [];
  let sql = `select a.*, row_to_json(c.*) as category
             from article a
             left join article_category c on c.id = a.category_id
             where ${PUBLIC_WHERE}`;
  if (opts.search) {
    params.push(`%${opts.search}%`);
    sql += ` and (a.title->>'pt' ilike $${params.length} or a.title->>'en' ilike $${params.length})`;
  }
  if (opts.tag) {
    params.push(opts.tag);
    sql += ` and $${params.length} = any(a.tags)`;
  }
  if (opts.categoryId) {
    params.push(opts.categoryId);
    sql += ` and a.category_id = $${params.length}`;
  }
  sql += ` order by coalesce(a.published_at, a.created_at) desc`;
  if (opts.limit && Number.isFinite(opts.limit)) {
    params.push(opts.limit);
    sql += ` limit $${params.length}`;
  }
  return (await query(sql, params)).map((r) => mapArticle(r, lang));
}

// aceita id (uuid) ou slug; preview=true ignora o filtro de publicação (admin)
export async function getArticleById(idOrSlug: string, lang: Lang = 'pt', preview = false) {
  const byId = UUID_RE.test(idOrSlug);
  const visible = preview ? 'true' : PUBLIC_WHERE;
  const rows = await query(
    `select a.*, row_to_json(c.*) as category
     from article a
     left join article_category c on c.id = a.category_id
     where ${byId ? 'a.id = $1' : 'a.slug = $1'} and ${visible}
     limit 1`,
    [idOrSlug],
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

// ─────────────────────── Analytics / Observabilidade ───────────────────────

// registra uma visualização de artigo (chamado por /api/track, melhor-esforço)
export async function recordView(p: {
  articleId?: string | null;
  path?: string | null;
  lang?: string | null;
  country?: string | null;
  referrerHost?: string | null;
  sessionId?: string | null;
  userAgent?: string | null;
}) {
  try {
    await getPool().query(
      `insert into article_view (article_id, path, lang, country, referrer_host, session_id, user_agent)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [
        p.articleId && UUID_RE.test(p.articleId) ? p.articleId : null,
        p.path ?? null,
        p.lang ?? null,
        p.country ?? null,
        p.referrerHost ?? null,
        p.sessionId ?? null,
        (p.userAgent ?? '').slice(0, 400) || null,
      ],
    );
    if (p.articleId && UUID_RE.test(p.articleId)) {
      await getPool().query(`update article set views_count = coalesce(views_count,0) + 1 where id = $1`, [p.articleId]);
    }
  } catch {
    // best-effort
  }
}

// registra um erro de aplicação na tabela error_log (best-effort)
export async function logError(p: {
  level?: string;
  source?: string;
  message: string;
  stack?: string | null;
  meta?: any;
}) {
  try {
    await getPool().query(
      `insert into error_log (level, source, message, stack, meta) values ($1,$2,$3,$4,$5)`,
      [p.level ?? 'error', p.source ?? null, String(p.message).slice(0, 2000), p.stack ?? null, p.meta ? JSON.stringify(p.meta) : null],
    );
  } catch {
    // best-effort — nunca propaga
  }
}

export async function getDashboardStats(lang: Lang = 'pt') {
  const pool = getPool();
  const [counts, viewsTotal, views30, viewsByDay, topArticles, byCountry, byReferrer, scheduled] = await Promise.all([
    pool.query(`select
        (select count(*)::int from article) as articles,
        (select count(*)::int from article where coalesce(status,'published')='published' and disabled_at is null) as published,
        (select count(*)::int from article where status='draft') as drafts,
        (select count(*)::int from article where status='scheduled') as scheduled,
        (select count(*)::int from article_category) as categories,
        (select count(*)::int from solution) as solutions,
        (select count(*)::int from testimonial) as testimonials,
        (select count(*)::int from faq) as faqs,
        (select count(*)::int from target_audience_profile) as profiles`),
    pool.query(`select count(*)::int n from article_view`),
    pool.query(`select count(*)::int n from article_view where created_at >= now() - interval '30 days'`),
    pool.query(`select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*)::int n
                from article_view where created_at >= now() - interval '30 days'
                group by 1 order by 1`),
    pool.query(`select a.id, a.title, coalesce(a.views_count,0)::int views
                from article a order by coalesce(a.views_count,0) desc, a.created_at desc limit 8`),
    pool.query(`select coalesce(country,'??') country, count(*)::int n from article_view
                where created_at >= now() - interval '90 days' group by 1 order by 2 desc limit 8`),
    pool.query(`select coalesce(nullif(referrer_host,''),'direto') src, count(*)::int n from article_view
                where created_at >= now() - interval '90 days' group by 1 order by 2 desc limit 8`),
    pool.query(`select id, title, scheduled_at from article where status='scheduled' order by scheduled_at asc limit 10`),
  ]);
  return {
    counts: counts.rows[0],
    views: { total: viewsTotal.rows[0].n, last30: views30.rows[0].n },
    viewsByDay: viewsByDay.rows,
    topArticles: topArticles.rows.map((r: any) => ({ id: r.id, title: t(r.title, lang), views: r.views })),
    byCountry: byCountry.rows,
    byReferrer: byReferrer.rows,
    scheduled: scheduled.rows.map((r: any) => ({ id: r.id, title: t(r.title, lang), scheduledAt: r.scheduled_at })),
  };
}

export async function getStorageUsage() {
  const pool = getPool();
  const r = await pool.query(
    `select count(*)::int files, coalesce(sum(size_bytes),0)::bigint bytes,
       count(*) filter (where kind='image')::int images,
       count(*) filter (where kind='document')::int documents
     from media_asset`,
  );
  const row = r.rows[0];
  return { files: row.files, bytes: Number(row.bytes), images: row.images, documents: row.documents };
}

export async function getErrorLogs(limit = 50) {
  const r = await getPool().query(
    `select id, created_at, level, source, message, stack, meta from error_log order by created_at desc limit $1`,
    [limit],
  );
  return r.rows;
}

export async function getHealth() {
  const pool = getPool();
  const out: any = { db: { ok: false }, integrations: [], errors24h: 0, scheduledDue: 0, checkedAt: new Date().toISOString() };
  try {
    const r = await pool.query(`select now() as now`);
    out.db = { ok: true, now: r.rows[0].now };
  } catch (e) {
    out.db = { ok: false, error: (e as Error).message };
  }
  try {
    out.errors24h = (await pool.query(`select count(*)::int n from error_log where created_at >= now() - interval '24 hours'`)).rows[0].n;
  } catch {
    /* tabela pode não existir ainda */
  }
  try {
    out.scheduledDue = (
      await pool.query(`select count(*)::int n from article where status='scheduled' and scheduled_at <= now()`)
    ).rows[0].n;
  } catch {
    /* noop */
  }
  // Integrações: CRM (leads) e tradução (Anthropic)
  out.integrations = [
    { key: 'crm', label: 'CRM (leads)', ok: !!process.env.CRM_SUPABASE_URL && !!process.env.NEXT_PUBLIC_API_URL },
    { key: 'translate', label: 'Tradução (DeepL/Google)', ok: !!process.env.DEEPL_API_KEY || !!process.env.GOOGLE_TRANSLATE_API_KEY },
    { key: 'storage', label: 'Storage (Supabase)', ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
  ];
  return out;
}

// publica artigos agendados cujo horário já passou (chamado pelo cron)
export async function publishDueScheduled() {
  const r = await getPool().query(
    `update article set status='published', disabled_at=null,
        published_at=coalesce(scheduled_at, now()), updated_at=now()
     where status='scheduled' and scheduled_at is not null and scheduled_at <= now()
     returning id`,
  );
  return r.rowCount ?? 0;
}
