import { fixImages, fixSlugs, scanArticles } from '@/server/article-maintenance';
import { getAdminUser } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// GET: só mostra o que mudaria. POST {action:'images'|'slugs'}: aplica.
export async function GET() {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    return Response.json(await scanArticles());
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { action } = await req.json();
    if (action === 'images') return Response.json(await fixImages());
    if (action === 'slugs') return Response.json(await fixSlugs());
    return Response.json({ error: 'ação inválida' }, { status: 400 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
