import { normLang, query, t } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const lang = normLang(new URL(request.url).searchParams.get('lang'));
    const rows = await query(
      `select * from testimonial where disabled_at is null and is_active = true order by "order" asc, created_at asc`,
    );
    return Response.json(
      rows.map((r: any) => ({
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
      })),
    );
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
