import { after } from 'next/server';
import { createJob, listJobsAdmin, translateJob } from '@/server/jobs';
import { getAdminUser } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    return Response.json(await listJobsAdmin());
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const created = await createJob(await req.json());
    after(() => translateJob(created.id));
    return Response.json(created);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
