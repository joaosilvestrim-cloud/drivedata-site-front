import { listApplications } from '@/server/jobs';
import { getAdminUser } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lista candidaturas (todas ou de uma vaga: ?job=<id>).
export async function GET(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const job = new URL(req.url).searchParams.get('job');
    return Response.json(await listApplications(job));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
