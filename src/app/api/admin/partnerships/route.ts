import { listPartnerApplications } from '@/server/partnerships';
import { getAdminUser } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lista solicitações de parceria (todas ou de um status: ?status=new).
export async function GET(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const status = new URL(req.url).searchParams.get('status');
    return Response.json(await listPartnerApplications(status));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
