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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lang = normLang(new URL(request.url).searchParams.get('lang'));
    const rows = await query(
      `select a.*, row_to_json(c.*) as category
       from article a
       left join article_category c on c.id = a.category_id
       where a.id = $1 and a.disabled_at is null
       limit 1`,
      [id],
    );
    if (!rows.length) return Response.json({ error: 'Artigo não encontrado' }, { status: 404 });
    return Response.json(mapArticle(rows[0], lang));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
