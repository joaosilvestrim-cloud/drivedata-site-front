import { getAdminUser } from '@/server/supabase-server';
import { getPool, logError } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lista a biblioteca de mídia (imagens + documentos)
export async function GET(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const url = new URL(req.url);
    const kind = url.searchParams.get('kind'); // 'image' | 'document' | null
    const params: any[] = [];
    let sql = `select id, url, path, file_name, mime_type, size_bytes, kind, width, height, created_at from media_asset`;
    if (kind === 'image' || kind === 'document') {
      params.push(kind);
      sql += ` where kind = $${params.length}`;
    }
    sql += ` order by created_at desc limit 500`;
    const rows = await getPool().query(sql, params).then((r) => r.rows);
    return Response.json(rows);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

// Registra um asset já enviado ao storage (metadados na biblioteca)
export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.url || !b.path) throw new Error('url e path são obrigatórios');
    const kind = b.kind || (String(b.mimeType || '').startsWith('image/') ? 'image' : 'document');
    const r = await getPool().query(
      `insert into media_asset (url, path, file_name, mime_type, size_bytes, kind, width, height, created_by)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *`,
      [
        b.url,
        b.path,
        b.fileName ?? null,
        b.mimeType ?? null,
        b.sizeBytes ?? null,
        kind,
        b.width ?? null,
        b.height ?? null,
        user.email ?? null,
      ],
    );
    return Response.json(r.rows[0]);
  } catch (e) {
    await logError({ source: 'api/admin/media', message: (e as Error).message });
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
