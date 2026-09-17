import { removePartnerApplication, updatePartnerApplication } from '@/server/partnerships';
import { getAdminUser } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    return Response.json(await updatePartnerApplication(id, { status: body.status, notes: body.notes }));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    return Response.json(await removePartnerApplication(id));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
