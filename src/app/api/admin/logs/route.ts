import { getAdminUser } from '@/server/supabase-server';
import { getErrorLogs, getPool } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const limit = Math.min(parseInt(new URL(req.url).searchParams.get('limit') || '50', 10) || 50, 200);
    return Response.json(await getErrorLogs(limit));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

// limpa os logs de erro
export async function DELETE() {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    await getPool().query(`delete from error_log`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
