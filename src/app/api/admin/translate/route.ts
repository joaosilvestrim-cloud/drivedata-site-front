import { getAdminUser } from '@/server/supabase-server';
import { translateFields, hasTranslationProvider, activeProvider, parallelSafe, type TranslatableFields } from '@/server/translate';
import { logError } from '@/server/content-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET() {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  return Response.json({ enabled: hasTranslationProvider(), provider: activeProvider() });
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const body = await req.json();
    const from: string = body.from || 'pt';
    const targets: string[] = Array.isArray(body.targets) && body.targets.length ? body.targets : ['en', 'es', 'fr'];
    const fields: TranslatableFields = body.fields || {};
    const result: Record<string, TranslatableFields> = {};
    const langs = targets.filter((to) => to !== from);
    if (parallelSafe()) {
      const done = await Promise.all(langs.map((to) => translateFields(fields, from, to)));
      langs.forEach((to, i) => { result[to] = done[i]; });
    } else {
      for (const to of langs) result[to] = await translateFields(fields, from, to);
    }
    return Response.json({ ok: true, translations: result });
  } catch (e) {
    await logError({ source: 'api/admin/translate', message: (e as Error).message, stack: (e as Error).stack });
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
