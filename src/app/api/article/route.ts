import { normLang, query, t, type Lang } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    category: r.category
      ? {
          id: r.category.id,
          name: t(r.category.name, lang),
          whitelabelId: r.category.whitelabel_id,
          createdAt: r.category.created_at,
          updatedAt: r.category.updated_at,
          disabledAt: r.category.disabled_at ?? null,
        }
      : undefined,
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = normLang(url.searchParams.get('lang'));
    const search = url.searchParams.get('search');
    const limit = url.searchParams.get('limit');

    const params: any[] = [];
    let sql = `select a.*, row_to_json(c.*) as category
               from article a
               left join article_category c on c.id = a.category_id
               where a.disabled_at is null`;
    if (search) {
      params.push(`%${search}%`);
      sql += ` and (a.title->>'pt' ilike $${params.length} or a.title->>'en' ilike $${params.length})`;
    }
    sql += ` order by a.created_at desc`;
    if (limit && /^\d+$/.test(limit)) {
      params.push(parseInt(limit, 10));
      sql += ` limit $${params.length}`;
    }

    const rows = await query(sql, params);
    return Response.json(rows.map((r) => mapArticle(r, lang)));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
