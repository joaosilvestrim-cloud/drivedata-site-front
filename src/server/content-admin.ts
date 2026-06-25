// CRUD genérico do admin para as tabelas de conteúdo (Supabase novo, via pg).
// Campos i18n são gravados como jsonb {pt: valor} (o site resolve com fallback pt).
import { getPool } from '@/server/content-db';

type FieldType = 'i18n' | 'text' | 'int' | 'bool';

interface EntityConfig {
  table: string;
  // chave camelCase recebida do form -> { coluna no banco, tipo }
  fields: Record<string, { col: string; type: FieldType }>;
  orderBy: string;
}

export const ENTITIES: Record<string, EntityConfig> = {
  article: {
    table: 'article',
    orderBy: 'created_at desc',
    fields: {
      title: { col: 'title', type: 'i18n' },
      subTitle: { col: 'sub_title', type: 'i18n' },
      description: { col: 'description', type: 'i18n' },
      content: { col: 'content', type: 'i18n' },
      categoryId: { col: 'category_id', type: 'text' },
      imageUrl: { col: 'image_url', type: 'text' },
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

function coerce(type: FieldType, value: any): any {
  if (value === undefined || value === null || value === '') {
    return type === 'bool' ? false : null;
  }
  if (type === 'i18n') return JSON.stringify({ pt: String(value) });
  if (type === 'int') return parseInt(String(value), 10) || 0;
  if (type === 'bool') return value === true || value === 'true';
  return String(value);
}

const ptOf = (v: any) => (v && typeof v === 'object' ? v.pt ?? '' : v ?? '');

// lista (admin vê inclusive os despublicados)
export async function adminList(entity: string) {
  const cfg = ENTITIES[entity];
  if (!cfg) throw new Error('entidade inválida');
  const rows = await getPool()
    .query(`select * from ${cfg.table} order by ${cfg.orderBy}`)
    .then((r) => r.rows);
  return rows.map((r: any) => {
    const out: any = { id: r.id, disabled: r.disabled_at != null, createdAt: r.created_at };
    for (const [key, f] of Object.entries(cfg.fields)) {
      out[key] = f.type === 'i18n' ? ptOf(r[f.col]) : r[f.col];
    }
    return out;
  });
}

export async function adminCreate(entity: string, body: Record<string, any>) {
  const cfg = ENTITIES[entity];
  if (!cfg) throw new Error('entidade inválida');
  const cols: string[] = [];
  const ph: string[] = [];
  const params: any[] = [];
  for (const [key, f] of Object.entries(cfg.fields)) {
    if (!(key in body)) continue;
    cols.push(`"${f.col}"`);
    params.push(coerce(f.type, body[key]));
    ph.push(`$${params.length}`);
  }
  if (!cols.length) throw new Error('nada para inserir');
  const sql = `insert into ${cfg.table} (${cols.join(', ')}) values (${ph.join(', ')}) returning id`;
  const r = await getPool().query(sql, params);
  return r.rows[0];
}

export async function adminUpdate(entity: string, id: string, body: Record<string, any>) {
  const cfg = ENTITIES[entity];
  if (!cfg) throw new Error('entidade inválida');
  const sets: string[] = [];
  const params: any[] = [];
  for (const [key, f] of Object.entries(cfg.fields)) {
    if (!(key in body)) continue;
    params.push(coerce(f.type, body[key]));
    sets.push(`"${f.col}" = $${params.length}`);
  }
  // publicar/despublicar
  if ('disabled' in body) {
    if (body.disabled === true || body.disabled === 'true') {
      sets.push(`disabled_at = now()`);
    } else {
      sets.push(`disabled_at = null`);
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
