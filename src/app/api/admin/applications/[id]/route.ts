import { getApplication, removeApplication, updateApplication } from '@/server/jobs';
import { getAdminUser, supabaseServer } from '@/server/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'job-cvs';
type Ctx = { params: Promise<{ id: string }> };

// GET ?cv=1 → URL assinada (2 min) do currículo; sem ?cv → a candidatura.
export async function GET(req: Request, { params }: Ctx) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const app = await getApplication(id);
    if (!app) return Response.json({ error: 'candidatura não encontrada' }, { status: 404 });
    if (new URL(req.url).searchParams.get('cv')) {
      if (!app.cvPath) return Response.json({ error: 'sem currículo' }, { status: 404 });
      const sb = await supabaseServer();
      const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(app.cvPath, 120, {
        download: app.cvName ?? undefined,
      });
      if (error) throw error;
      return Response.json({ url: data.signedUrl });
    }
    return Response.json(app);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    return Response.json(await updateApplication(id, { status: body.status, notes: body.notes }));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const { cvPath } = await removeApplication(id);
    if (cvPath) {
      try {
        const sb = await supabaseServer();
        await sb.storage.from(BUCKET).remove([cvPath]);
      } catch {
        /* best-effort: a candidatura já saiu do banco */
      }
    }
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
