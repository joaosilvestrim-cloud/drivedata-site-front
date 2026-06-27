import { getAdminUser, supabaseServer } from '@/server/supabase-server';
import { getPool } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'site-assets';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const row = await getPool()
      .query(`select path from media_asset where id = $1`, [id])
      .then((r) => r.rows[0]);
    // remove do storage (best-effort) e da biblioteca
    if (row?.path) {
      try {
        const sb = await supabaseServer();
        await sb.storage.from(BUCKET).remove([row.path]);
      } catch {
        /* best-effort */
      }
    }
    await getPool().query(`delete from media_asset where id = $1`, [id]);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
