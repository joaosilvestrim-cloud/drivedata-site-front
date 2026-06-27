import { getAdminUser } from '@/server/supabase-server';
import { getHealth } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    return Response.json(await getHealth());
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
