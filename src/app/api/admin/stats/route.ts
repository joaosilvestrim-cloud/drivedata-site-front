import { getAdminUser } from '@/server/supabase-server';
import { getDashboardStats, getStorageUsage } from '@/server/content-db';
import { normLang } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const lang = normLang(new URL(req.url).searchParams.get('lang'));
    const [stats, storage] = await Promise.all([getDashboardStats(lang), getStorageUsage()]);
    return Response.json({ ...stats, storage });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
