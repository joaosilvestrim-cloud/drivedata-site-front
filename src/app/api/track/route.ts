import { recordView } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Endpoint público (beacon) para registrar uma visualização de página/artigo.
export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const h = req.headers;
    const country = h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || null;
    let referrerHost: string | null = null;
    const ref = b.referrer || h.get('referer') || '';
    try {
      if (ref) referrerHost = new URL(ref).hostname;
    } catch {
      /* ignore */
    }
    // ignora self-referrals (navegação interna)
    const selfHost = (() => {
      try {
        return new URL(req.url).hostname;
      } catch {
        return '';
      }
    })();
    if (referrerHost && selfHost && referrerHost === selfHost) referrerHost = null;

    await recordView({
      articleId: b.articleId ?? null,
      path: b.path ?? null,
      lang: b.lang ?? null,
      country,
      referrerHost,
      sessionId: b.sessionId ?? null,
      userAgent: h.get('user-agent'),
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
