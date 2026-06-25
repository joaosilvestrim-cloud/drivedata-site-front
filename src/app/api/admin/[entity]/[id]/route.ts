import { adminRemove, adminUpdate } from '@/server/content-admin';
import { getAdminUser } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { entity, id } = await params;
    const body = await req.json();
    return Response.json(await adminUpdate(entity, id, body));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { entity, id } = await params;
    return Response.json(await adminRemove(entity, id));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
