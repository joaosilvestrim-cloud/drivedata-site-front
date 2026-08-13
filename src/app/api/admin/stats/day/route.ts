import { getAdminUser } from '@/server/supabase-server';
import { getDayStats } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Detalhe de um dia (clique numa barra do gráfico): /api/admin/stats/day?date=YYYY-MM-DD
export async function GET(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  const date = new URL(req.url).searchParams.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ error: 'data inválida' }, { status: 400 });
  try {
    return Response.json(await getDayStats(date));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
