// Preenche o perfil dos talentos no ERP a partir da leitura dos currículos (só admin).
// POST { profiles: { [email]: CrmTalentProfile } }
// Só preenche campos vazios do talento (ver updateCrmTalentProfile).
import { getAdminUser } from '@/server/supabase-server';
import { updateCrmTalentProfile, type CrmTalentProfile } from '@/server/crm-hiring';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SENIORITY = new Set(['Estagiário', 'Júnior', 'Pleno', 'Sênior', 'Especialista']);
const LANG = /^(English|French|Portuguese|Spanish) - (Beginner|Intermediate|Advanced|Fluent|Native)$/;

const str = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const strs = (v: unknown, max: number, n: number) =>
  Array.isArray(v) ? [...new Set(v.map((x) => str(x, max)).filter((x): x is string => !!x))].slice(0, n) : [];
const objs = <T,>(v: unknown, n: number, map: (o: Record<string, unknown>) => T | null) =>
  Array.isArray(v) ? v.filter((o) => o && typeof o === 'object').map((o) => map(o as Record<string, unknown>)).filter((x): x is T => !!x).slice(0, n) : [];

function readProfile(v: unknown): CrmTalentProfile | null {
  if (!v || typeof v !== 'object') return null;
  const p = v as Record<string, unknown>;
  const seniority = str(p.seniority, 40);
  return {
    name: str(p.name, 120),
    headline: str(p.headline, 120),
    location: str(p.location, 120),
    seniority: seniority && SENIORITY.has(seniority) ? seniority : null,
    tier: p.tier === 'verde' || p.tier === 'laranja' || p.tier === 'cinza' ? p.tier : null,
    area: str(p.area, 60),
    summary: str(p.summary, 1200),
    tags: strs(p.tags, 60, 15),
    languages: strs(p.languages, 40, 6).filter((l) => LANG.test(l)),
    experience: objs(p.experience, 8, (o) => {
      const role = str(o.role, 160), org = str(o.org, 160);
      if (!role && !org) return null;
      const focus = str(o.focus, 400);
      return { period: str(o.period, 60) ?? '', role: role ?? '', org: org ?? '', ...(focus ? { focus } : {}) };
    }),
    education: objs(p.education, 6, (o) => {
      const degree = str(o.degree, 160), school = str(o.school, 160);
      if (!degree && !school) return null;
      return { period: str(o.period, 60) ?? '', degree: degree ?? '', school: school ?? '' };
    }),
    certifications: objs(p.certifications, 12, (o) => {
      const name = str(o.name, 160);
      if (!name) return null;
      const issuer = str(o.issuer, 120), year = str(o.year, 10);
      return { name, ...(issuer ? { issuer } : {}), ...(year ? { year } : {}) };
    }),
  };
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });
  try {
    const body = (await req.json().catch(() => ({}))) as { profiles?: Record<string, unknown> };
    const entries = Object.entries(body.profiles ?? {}).slice(0, 60);
    const results = [];
    for (const [email, raw] of entries) {
      const p = readProfile(raw);
      if (!p) { results.push({ email, ok: false, error: 'perfil inválido' }); continue; }
      results.push({ email, ...(await updateCrmTalentProfile(email, p)) });
    }
    return Response.json({ total: results.length, ok: results.filter((r) => r.ok).length, results });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
