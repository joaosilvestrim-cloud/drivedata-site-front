import { after } from 'next/server';
import { getJobAdmin, removeJob, touchesJobText, translateJob, updateJob } from '@/server/jobs';
import { getAdminUser } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const job = await getJobAdmin(id);
    if (!job) return Response.json({ error: 'vaga não encontrada' }, { status: 404 });
    return Response.json(job);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const saved = await updateJob(id, body);
    if (touchesJobText(body)) after(() => translateJob(id));
    return Response.json(saved);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    return Response.json(await removeJob(id));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
