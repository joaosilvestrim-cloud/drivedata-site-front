import { publishDueScheduled, logError } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Publica artigos agendados cujo horário já chegou.
// Pode ser chamado por um Vercel Cron. Se CRON_SECRET estiver setado, exige
// o header Authorization: Bearer <CRON_SECRET>.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${secret}`) return Response.json({ error: 'não autorizado' }, { status: 401 });
  }
  try {
    const published = await publishDueScheduled();
    return Response.json({ ok: true, published });
  } catch (e) {
    await logError({ source: 'api/cron/publish', message: (e as Error).message });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
