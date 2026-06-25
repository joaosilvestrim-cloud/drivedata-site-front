import { getTestimonials, normLang } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const lang = normLang(new URL(request.url).searchParams.get('lang'));
    return Response.json(await getTestimonials(lang));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
