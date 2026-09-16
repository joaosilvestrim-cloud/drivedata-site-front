import { createJob, listJobsAdmin } from '@/server/jobs';
import { getAdminUser } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    return Response.json(await createJob(await req.json()));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
