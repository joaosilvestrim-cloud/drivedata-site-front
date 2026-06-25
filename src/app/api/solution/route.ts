import { normLang, query, t } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const lang = normLang(new URL(request.url).searchParams.get('lang'));
    const rows = await query(
      `select * from solution where disabled_at is null order by "order" asc, created_at asc`,
    );
    return Response.json(
      rows.map((r: any) => ({
        id: r.id,
        title: t(r.title, lang),
        content: t(r.content, lang),
        icon: r.icon ?? '',
        order: r.order,
        whitelabelId: r.whitelabel_id,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
    );
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
