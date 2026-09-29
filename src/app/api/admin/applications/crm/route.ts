// Carga das candidaturas do site no Processo Seletivo do ERP (só admin).
// POST { triage?: { [applicationId]: CrmTriage }, only?: string[] }
// Reenvia todas (ou só as de `only`), com o currículo e, quando vier, a triagem.
// É idempotente: no ERP a candidatura é chave única, então rodar de novo só atualiza.
import { listApplications } from '@/server/jobs';
import { getAdminUser, supabaseServer } from '@/server/supabase-server';
import { pushApplicationToCrm, type CrmTriage } from '@/server/crm-hiring';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const RECS = new Set(['avancar', 'avaliar', 'nao_indicado']);
const list = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string').map((x) => x.slice(0, 300)).slice(0, 8) : []);

function readTriage(v: unknown): CrmTriage | null {
  if (!v || typeof v !== 'object') return null;
  const t = v as Record<string, unknown>;
  const score = Number(t.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) return null;
  if (!RECS.has(String(t.recommendation)) || typeof t.summary !== 'string') return null;
  return {
    score: Math.round(score),
    recommendation: t.recommendation as CrmTriage['recommendation'],
    summary: t.summary.slice(0, 2000),
    strengths: list(t.strengths),
    gaps: list(t.gaps),
    by: typeof t.by === 'string' ? t.by.slice(0, 80) : undefined,
    at: new Date().toISOString(),
  };
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const body = (await req.json().catch(() => ({}))) as { triage?: Record<string, unknown>; only?: string[] };
    const only = Array.isArray(body.only) ? new Set(body.only) : null;
    const apps = (await listApplications(null)).filter((a) => !only || only.has(a.id));
    const sb = await supabaseServer();

    const results = [];
    for (const a of apps) {
      let cv = null;
      if (a.cvPath) {
        const { data } = await sb.storage.from('job-cvs').download(a.cvPath);
        if (data) cv = { bytes: Buffer.from(await data.arrayBuffer()), name: a.cvName || 'curriculo', mime: a.cvMime || data.type || 'application/pdf' };
      }
      const r = await pushApplicationToCrm({
        applicationId: a.id,
        jobTitle: a.jobTitle || 'Vaga do site',
        jobSlug: a.jobSlug,
        name: a.name,
        email: a.email,
        phone: a.phone,
        linkedinUrl: a.linkedinUrl,
        portfolioUrl: a.portfolioUrl,
        message: a.message,
        appliedAt: a.createdAt,
        cv,
        triage: readTriage(body.triage?.[a.id]),
      });
      results.push({ id: a.id, name: a.name, cv: !!cv, ...r });
    }
    return Response.json({ total: results.length, ok: results.filter((r) => r.ok).length, results });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
