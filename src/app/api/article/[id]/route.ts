import { getArticleById, normLang } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lang = normLang(new URL(request.url).searchParams.get('lang'));
    const article = await getArticleById(id, lang);
    if (!article) return Response.json({ error: 'Artigo não encontrado' }, { status: 404 });
    return Response.json(article);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
