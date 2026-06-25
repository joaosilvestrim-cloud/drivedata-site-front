import { adminCreate, adminList } from '@/server/content-admin';
import { getAdminUser } from '@/server/supabase-server';

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
    return Response.json(await adminCreate(entity, body));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
