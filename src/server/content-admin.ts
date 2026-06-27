// CRUD genérico do admin para as tabelas de conteúdo (Supabase novo, via pg).
// Campos i18n são gravados como jsonb {pt,en,fr,es}. O site resolve com fallback pt.
//
// O artigo tem tratamento especial (slug, status, agendamento, SEO, tags,
// documentos) — ver buildArticleExtras() e os tipos de campo abaixo.
import { getPool } from '@/server/content-db';

type FieldType = 'i18n' | 'text' | 'int' | 'bool' | 'json' | 'array' | 'timestamp' | 'slug';

interface EntityConfig {
  table: string;
  fields: Record<string, { col: string; type: FieldType }>;
  orderBy: string;
  // Quando true, os campos i18n voltam como objeto completo {pt,en,fr} no adminList
  // (o editor de artigos precisa de todos os idiomas). Default: só o pt (string).
  i18nRaw?: boolean;
}

const LANGS = ['pt', 'en', 'es', 'fr'] as const;

export const ENTITIES: Record<string, EntityConfig> = {
  article: {
    table: 'article',
    orderBy: 'created_at desc',
    i18nRaw: true,
    fields: {
      title: { col: 'title', type: 'i18n' },
      subTitle: { col: 'sub_title', type: 'i18n' },
      description: { col: 'description', type: 'i18n' },
      content: { col: 'content', type: 'i18n' },
      seoTitle: { col: 'seo_title', type: 'i18n' },
      seoDescription: { col: 'seo_description', type: 'i18n' },
      categoryId: { col: 'category_id', type: 'text' },
      imageUrl: { col: 'image_url', type: 'text' },
      slug: { col: 'slug', type: 'slug' },
      status: { col: 'status', type: 'text' },
      author: { col: 'author', type: 'text' },
      tags: { col: 'tags', type: 'array' },
      documents: { col: 'document_urls', type: 'json' },
      scheduledAt: { col: 'scheduled_at', type: 'timestamp' },
      publishedAt: { col: 'published_at', type: 'timestamp' },
    },
  },
  'article-category': {
    table: 'article_category',
    orderBy: 'created_at desc',
    fields: { name: { col: 'name', type: 'i18n' } },
  },
  solution: {
    table: 'solution',
    orderBy: '"order" asc',
    fields: {
      title: { col: 'title', type: 'i18n' },
      content: { col: 'content', type: 'i18n' },
      icon: { col: 'icon', type: 'text' },
      order: { col: 'order', type: 'int' },
    },
  },
  testimonial: {
    table: 'testimonial',
    orderBy: '"order" asc',
    fields: {
      clientName: { col: 'client_name', type: 'i18n' },
      clientCompany: { col: 'client_company', type: 'i18n' },
      clientAvatar: { col: 'client_avatar', type: 'text' },
      testimonial: { col: 'testimonial', type: 'i18n' },
      rating: { col: 'rating', type: 'int' },
      isActive: { col: 'is_active', type: 'bool' },
      order: { col: 'order', type: 'int' },
    },
  },
  faq: {
    table: 'faq',
    orderBy: 'created_at asc',
    fields: {
      title: { col: 'title', type: 'i18n' },
      description: { col: 'description', type: 'i18n' },
    },
  },
  'target-audience-profile': {
    table: 'target_audience_profile',
    orderBy: '"order" asc',
    fields: {
      title: { col: 'title', type: 'i18n' },
      description: { col: 'description', type: 'i18n' },
      order: { col: 'order', type: 'int' },
      type: { col: 'type', type: 'text' },
    },
  },
};

// normaliza um valor i18n para objeto {pt,en,es,fr} (só com idiomas preenchidos)
function normI18n(value: any): Record<string, string> {
  if (value === null || value === undefined) return {};
  if (typeof value === 'string') return value.trim() ? { pt: value } : {};
  if (typeof value === 'object') {
    const out: Record<string, string> = {};
    for (const l of LANGS) {
      const v = value[l];
      if (typeof v === 'string' && v.trim()) out[l] = v;
    }
    return out;
  }
  return {};
}

function coerce(type: FieldType, value: any): any {
  if (type === 'i18n') {
    const obj = normI18n(value);
    return Object.keys(obj).length ? JSON.stringify(obj) : null;
  }
  if (type === 'array') {
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value === 'string' && value.trim())
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  }
  if (type === 'json') {
    if (value === undefined || value === null || value === '') return null;
    return JSON.stringify(value);
  }
  if (value === undefined || value === null || value === '') {
    return type === 'bool' ? false : null;
  }
  if (type === 'int') return parseInt(String(value), 10) || 0;
  if (type === 'bool') return value === true || value === 'true';
  if (type === 'timestamp') return new Date(value).toISOString();
  if (type === 'slug') return slugify(String(value));
  return String(value);
}

const ptOf = (v: any) => (v && typeof v === 'object' ? v.pt ?? '' : v ?? '');

export function slugify(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// garante slug único na tabela article (acrescenta -2, -3… se já existir)
async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || 'artigo';
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = await getPool()
      .query(`select 1 from article where slug = $1 and ($2::uuid is null or id <> $2) limit 1`, [
        candidate,
        ignoreId ?? null,
      ])
      .then((r) => r.rows);
    if (!rows.length) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

// lista (admin vê inclusive os despublicados)
export async function adminList(entity: string) {
  const cfg = ENTITIES[entity];
  if (!cfg) throw new Error('entidade inválida');
  const rows = await getPool()
    .query(`select * from ${cfg.table} order by ${cfg.orderBy}`)
    .then((r) => r.rows);
  return rows.map((r: any) => {
    const out: any = { id: r.id, disabled: r.disabled_at != null, createdAt: r.created_at };
    if (cfg.table === 'article') {
      out.status = r.status ?? (r.disabled_at ? 'draft' : 'published');
      out.publishedAt = r.published_at;
      out.scheduledAt = r.scheduled_at;
      out.slug = r.slug;
      out.views = Number(r.views_count ?? 0);
    }
    for (const [key, f] of Object.entries(cfg.fields)) {
      if (f.type === 'i18n') out[key] = cfg.i18nRaw ? r[f.col] ?? {} : ptOf(r[f.col]);
      else if (f.type === 'json') out[key] = r[f.col] ?? null;
      else if (f.type === 'array') out[key] = r[f.col] ?? [];
      else out[key] = r[f.col];
    }
    return out;
  });
}

// publicação por status (mantém disabled_at sincronizado p/ código legado)
async function applyArticleStatus(body: Record<string, any>, sets: string[], params: any[], existing?: any) {
  const status = body.status ?? existing?.status ?? 'draft';
  if (status === 'published') {
    sets.push(`status = 'published'`);
    // published_at: usa o informado, senão o existente, senão agora
    const pub = body.publishedAt ?? existing?.published_at ?? new Date().toISOString();
    params.push(new Date(pub).toISOString());
    sets.push(`published_at = $${params.length}`);
    sets.push(`disabled_at = null`);
  } else if (status === 'scheduled') {
    sets.push(`status = 'scheduled'`);
    if (body.scheduledAt) {
      params.push(new Date(body.scheduledAt).toISOString());
      sets.push(`scheduled_at = $${params.length}`);
    }
    sets.push(`disabled_at = now()`);
  } else {
    sets.push(`status = 'draft'`);
    sets.push(`disabled_at = now()`);
  }
}

export async function adminCreate(entity: string, body: Record<string, any>) {
  const cfg = ENTITIES[entity];
  if (!cfg) throw new Error('entidade inválida');
  const cols: string[] = [];
  const ph: string[] = [];
  const params: any[] = [];
  for (const [key, f] of Object.entries(cfg.fields)) {
    if (!(key in body)) continue;
    if (cfg.table === 'article' && (key === 'status' || key === 'publishedAt' || key === 'scheduledAt')) continue;
    let val = coerce(f.type, body[key]);
    if (f.type === 'slug') {
      const base = val || ptOf(normI18n(body.title));
      val = await uniqueSlug(base);
    }
    cols.push(`"${f.col}"`);
    params.push(val);
    ph.push(`$${params.length}`);
  }
  // slug automático se o form não mandou
  if (cfg.table === 'article' && !cols.includes('"slug"')) {
    const slug = await uniqueSlug(ptOf(normI18n(body.title)));
    cols.push('"slug"');
    params.push(slug);
    ph.push(`$${params.length}`);
  }
  if (cfg.table === 'article') {
    const status = body.status ?? 'draft';
    cols.push('status');
    params.push(status);
    ph.push(`$${params.length}`);
    if (status === 'published') {
      cols.push('published_at');
      params.push(new Date(body.publishedAt ?? Date.now()).toISOString());
      ph.push(`$${params.length}`);
    } else {
      cols.push('disabled_at');
      params.push(new Date().toISOString());
      ph.push(`$${params.length}`);
      if (status === 'scheduled' && body.scheduledAt) {
        cols.push('scheduled_at');
        params.push(new Date(body.scheduledAt).toISOString());
        ph.push(`$${params.length}`);
      }
    }
  }
  if (!cols.length) throw new Error('nada para inserir');
  const sql = `insert into ${cfg.table} (${cols.join(', ')}) values (${ph.join(', ')}) returning id`;
  const r = await getPool().query(sql, params);
  return r.rows[0];
}

export async function adminUpdate(entity: string, id: string, body: Record<string, any>) {
  const cfg = ENTITIES[entity];
  if (!cfg) throw new Error('entidade inválida');
  const existing =
    cfg.table === 'article'
      ? await getPool()
          .query(`select * from article where id = $1`, [id])
          .then((r) => r.rows[0])
      : null;

  const sets: string[] = [];
  const params: any[] = [];
  for (const [key, f] of Object.entries(cfg.fields)) {
    if (!(key in body)) continue;
    if (cfg.table === 'article' && (key === 'status' || key === 'publishedAt' || key === 'scheduledAt')) continue;
    let val = coerce(f.type, body[key]);
    if (f.type === 'slug') val = await uniqueSlug(val || ptOf(normI18n(body.title)) || existing?.slug || '', id);
    params.push(val);
    sets.push(`"${f.col}" = $${params.length}`);
  }

  if (cfg.table === 'article' && ('status' in body || 'publishedAt' in body || 'scheduledAt' in body)) {
    await applyArticleStatus(body, sets, params, existing);
  }

  // compat: publicar/despublicar via flag booleana (entidades genéricas)
  if ('disabled' in body && cfg.table !== 'article') {
    sets.push(body.disabled === true || body.disabled === 'true' ? `disabled_at = now()` : `disabled_at = null`);
  }
  // artigo: alternar publicado/rascunho via flag (botão da tabela)
  if ('disabled' in body && cfg.table === 'article' && !('status' in body)) {
    if (body.disabled === true || body.disabled === 'true') {
      sets.push(`status = 'draft'`, `disabled_at = now()`);
    } else {
      sets.push(`status = 'published'`, `disabled_at = null`);
      params.push(new Date(existing?.published_at ?? Date.now()).toISOString());
      sets.push(`published_at = $${params.length}`);
    }
  }

  sets.push(`updated_at = now()`);
  params.push(id);
  const sql = `update ${cfg.table} set ${sets.join(', ')} where id = $${params.length} returning id`;
  const r = await getPool().query(sql, params);
  return r.rows[0];
}

export async function adminRemove(entity: string, id: string) {
  const cfg = ENTITIES[entity];
  if (!cfg) throw new Error('entidade inválida');
  await getPool().query(`delete from ${cfg.table} where id = $1`, [id]);
  return { ok: true };
}
