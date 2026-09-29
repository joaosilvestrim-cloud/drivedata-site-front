// Leva uma candidatura do site para o Processo Seletivo do ERP (CRM): talento
// (reaproveitado pelo e-mail) + cópia do currículo no bucket privado talent-cvs +
// card na etapa Triagem de rh_hiring. Mesmo acesso do /api/lead (chave de serviço
// do CRM, só no servidor) e mesmo tenant do país deste site.
// Idempotente: a candidatura é identificada por site_application_id no CRM, então
// reenviar só atualiza (útil para a carga das candidaturas antigas e para a triagem).
// Precisa da migration 137 do CRM rodada.
import { LEAD_TENANT_CODE, SITE_BASE_URL } from '@/common/config/site';

export interface CrmTriage {
  score: number;
  recommendation: 'avancar' | 'avaliar' | 'nao_indicado';
  summary: string;
  strengths?: string[];
  gaps?: string[];
  by?: string;
  at?: string;
}

export interface CrmApplicationInput {
  applicationId: string;
  jobTitle: string;
  jobSlug?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  message?: string | null;
  appliedAt?: string | null;
  cv?: { bytes: Buffer; name: string; mime: string } | null;
  triage?: CrmTriage | null;
}

export type CrmPushResult = { ok: true; hiringId: string; created: boolean } | { ok: false; error: string };

const EXT_BY_MIME: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

function crmEnv() {
  const url = process.env.CRM_SUPABASE_URL;
  const key = process.env.CRM_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } };
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(() => '')}`.slice(0, 400));
  return (await res.json()) as T;
}

async function expectOk(res: Response): Promise<void> {
  if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(() => '')}`.slice(0, 400));
}

/** Card mais alto na coluna = maior nota. Sem nota vai para o topo (precisa de triagem). */
const orderFor = (t?: CrmTriage | null) => (t ? 1000 - Math.round(t.score * 10) : 0);

export async function pushApplicationToCrm(input: CrmApplicationInput): Promise<CrmPushResult> {
  const env = crmEnv();
  if (!env) return { ok: false, error: 'Integração com o ERP não configurada (CRM_SUPABASE_URL / CRM_SERVICE_ROLE_KEY).' };
  const { url, headers } = env;
  const rest = `${url}/rest/v1`;
  try {
    const email = input.email.trim().toLowerCase();

    const tenants = await json<Array<{ id: string }>>(await fetch(`${rest}/tenants?code=eq.${LEAD_TENANT_CODE}&select=id`, { headers }));
    const tenantId = tenants[0]?.id ?? null;

    // Talento: reaproveita pelo e-mail (a base de Talentos é compartilhada entre países).
    const found = await json<Array<{ id: string; score: number | null }>>(
      await fetch(`${rest}/talents?email=ilike.${encodeURIComponent(email)}&select=id,score&limit=1`, { headers }),
    );
    let talentId = found[0]?.id;
    if (!talentId) {
      const created = await json<Array<{ id: string }>>(
        await fetch(`${rest}/talents`, {
          method: 'POST',
          headers: { ...headers, Prefer: 'return=representation' },
          body: JSON.stringify({
            tenant_id: tenantId,
            name: input.name.trim(),
            email,
            phone: input.phone || null,
            linkedin_url: input.linkedinUrl || null,
            portfolio_url: input.portfolioUrl || null,
            source: 'site',
            status: 'available',
            active: true,
          }),
        }),
      );
      talentId = created[0].id;
    }

    // Currículo: cópia no bucket privado do CRM, um arquivo por candidatura.
    let cvPath: string | null = null;
    if (input.cv) {
      const ext = EXT_BY_MIME[input.cv.mime] || (input.cv.name.split('.').pop() || 'pdf').toLowerCase();
      cvPath = `site/${input.applicationId}.${ext}`;
      const up = await fetch(`${url}/storage/v1/object/talent-cvs/${cvPath}`, {
        method: 'POST',
        headers: { apikey: headers.apikey, Authorization: headers.Authorization, 'Content-Type': input.cv.mime, 'x-upsert': 'true' },
        body: new Uint8Array(input.cv.bytes),
      });
      if (!up.ok) throw new Error(`currículo: ${up.status} ${await up.text().catch(() => '')}`.slice(0, 300));
    }

    // A nota vai também para o talento (a base de Talentos ordena por ela).
    const talentPatch: Record<string, unknown> = {};
    if (cvPath) Object.assign(talentPatch, { cv_path: cvPath, cv_name: input.cv?.name ?? null });
    if (input.triage) talentPatch.score = input.triage.score;
    if (Object.keys(talentPatch).length) {
      await expectOk(await fetch(`${rest}/talents?id=eq.${talentId}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify(talentPatch) }));
    }

    const card: Record<string, unknown> = {
      tenant_id: tenantId,
      talent_id: talentId,
      role: input.jobTitle,
      source: 'site',
      site_application_id: input.applicationId,
      applied_at: input.appliedAt ?? new Date().toISOString(),
      applicant: {
        email,
        phone: input.phone || null,
        linkedin: input.linkedinUrl || null,
        portfolio: input.portfolioUrl || null,
        message: input.message || null,
        jobSlug: input.jobSlug || null,
        jobTitle: input.jobTitle,
        site: SITE_BASE_URL,
      },
    };
    if (cvPath) Object.assign(card, { cv_path: cvPath, cv_name: input.cv?.name ?? null });
    if (input.triage) Object.assign(card, { triage: input.triage, order_index: orderFor(input.triage) });

    // Já existe card desta candidatura? Atualiza (não mexe na etapa: pode já ter andado).
    const existing = await json<Array<{ id: string }>>(
      await fetch(`${rest}/rh_hiring?site_application_id=eq.${input.applicationId}&select=id`, { headers }),
    );
    if (existing[0]) {
      await expectOk(await fetch(`${rest}/rh_hiring?id=eq.${existing[0].id}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify(card) }));
      return { ok: true, hiringId: existing[0].id, created: false };
    }

    const ins = await fetch(`${rest}/rh_hiring`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({ ...card, stage: 'Triagem', order_index: orderFor(input.triage) }),
    });
    if (ins.status === 409) {
      // A pessoa já estava no processo desta vaga (outra candidatura, ou eleita da
      // base): atualiza esse card com os dados mais recentes em vez de duplicar.
      const same = await json<Array<{ id: string }>>(
        await fetch(`${rest}/rh_hiring?talent_id=eq.${talentId}&role=ilike.${encodeURIComponent(input.jobTitle)}&select=id&limit=1`, { headers }),
      );
      if (!same[0]) throw new Error('conflito ao abrir o card no processo seletivo');
      await expectOk(await fetch(`${rest}/rh_hiring?id=eq.${same[0].id}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify(card) }));
      return { ok: true, hiringId: same[0].id, created: false };
    }
    const row = await json<Array<{ id: string }>>(ins);
    return { ok: true, hiringId: row[0].id, created: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
