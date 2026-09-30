import { adminCreate, adminList } from '@/server/content-admin';
import { getAdminUser } from '@/server/supabase-server';
import { revalidateTag } from 'next/cache';

// Depois de gravar, o cache das páginas públicas (server/site-cache) expira na hora.
const refreshSite = () => revalidateTag('site-content', { expire: 0 });

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ entity: string }> }) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { entity } = await params;
    return Response.json(await adminList(entity));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ entity: string }> }) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { entity } = await params;
    const body = await req.json();
    const out = await adminCreate(entity, body);
    refreshSite();
    return Response.json(out);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
