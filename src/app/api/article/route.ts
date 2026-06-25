import { getArticles, normLang } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lang = normLang(url.searchParams.get('lang'));
    const search = url.searchParams.get('search');
    const limitRaw = url.searchParams.get('limit');
    const limit = limitRaw && /^\d+$/.test(limitRaw) ? parseInt(limitRaw, 10) : null;
    return Response.json(await getArticles({ search, limit }, lang));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
