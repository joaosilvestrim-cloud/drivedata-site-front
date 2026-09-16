// Vagas (carreiras) e candidaturas do site.
//
// Leitura pública e CRUD do admin passam pelo pg pool (SITE_DATABASE_URL, que
// ignora RLS). O currículo vai pro bucket PRIVADO job-cvs; o admin baixa por
// URL assinada. Ver supabase/migrations/006_vagas.sql.
import {
  APPLICATION_STATUSES,
  CONTRACT_TYPES,
  JOB_STATUSES,
  WORK_MODELS,
  type ApplicationStatus,
  type JobApplicationModel,
  type JobModel,
} from '@/common/model/job.model';
import { slugify } from './content-admin';
import { getPool } from './content-db';

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

function mapJob(r: any): JobModel {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    area: r.area ?? null,
    location: r.location ?? null,
    workModel: r.work_model ?? 'remoto',
    contractType: r.contract_type ?? 'clt',
    seniority: r.seniority ?? null,
    summary: r.summary ?? null,
    description: r.description ?? null,
    requirements: r.requirements ?? null,
    benefits: r.benefits ?? null,
    status: r.status ?? 'draft',
    locale: r.locale ?? 'pt',
    applyUrl: r.apply_url ?? null,
    publishedAt: iso(r.published_at),
    closesAt: iso(r.closes_at),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
    applications: r.applications != null ? Number(r.applications) : undefined,
  };
}

function mapApplication(r: any): JobApplicationModel {
  return {
    id: r.id,
    jobId: r.job_id,
    jobTitle: r.job_title ?? undefined,
    jobSlug: r.job_slug ?? undefined,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    linkedinUrl: r.linkedin_url ?? null,
    portfolioUrl: r.portfolio_url ?? null,
    message: r.message ?? null,
    cvPath: r.cv_path ?? null,
    cvName: r.cv_name ?? null,
    cvMime: r.cv_mime ?? null,
    cvSize: r.cv_size ?? null,
    source: r.source ?? null,
    page: r.page ?? null,
    consent: !!r.consent,
    status: r.status ?? 'new',
    notes: r.notes ?? null,
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
  };
}

// Campos editáveis pelo admin (chave do payload → coluna).
const COLS: Record<string, string> = {
  title: 'title',
  area: 'area',
  location: 'location',
  workModel: 'work_model',
  contractType: 'contract_type',
  seniority: 'seniority',
  summary: 'summary',
  description: 'description',
  requirements: 'requirements',
  benefits: 'benefits',
  status: 'status',
  locale: 'locale',
  applyUrl: 'apply_url',
  closesAt: 'closes_at',
};

const clean = (v: unknown): string | null => {
  const s = v == null ? '' : String(v).trim();
  return s ? s : null;
};

function coerceJob(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(COLS)) {
    if (!(key in body)) continue;
    let v: string | null = clean(body[key]);
    if (key === 'status' && !JOB_STATUSES.includes(v as never)) v = 'draft';
    if (key === 'workModel' && !WORK_MODELS.includes(v as never)) v = 'remoto';
    if (key === 'contractType' && !CONTRACT_TYPES.includes(v as never)) v = 'clt';
    if (key === 'locale') v = ['pt', 'en', 'es', 'fr'].includes(v ?? '') ? v : 'pt';
    if (key === 'closesAt') v = v ? new Date(v).toISOString() : null;
    out[COLS[key]] = v;
  }
  return out;
}

// Slug único na tabela job (acrescenta -2, -3… se já existir).
async function uniqueJobSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || 'vaga';
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = await getPool()
      .query(`select 1 from job where slug = $1 and ($2::uuid is null or id <> $2) limit 1`, [candidate, ignoreId ?? null])
      .then((r) => r.rows);
    if (!rows.length) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

// ───────── admin ─────────

export async function listJobsAdmin(): Promise<JobModel[]> {
  const rows = await getPool()
    .query(
      `select j.*, (select count(*) from job_application a where a.job_id = j.id) as applications
         from job j
        order by (j.status = 'open') desc, j.created_at desc`,
    )
    .then((r) => r.rows);
  return rows.map(mapJob);
}

export async function getJobAdmin(id: string): Promise<JobModel | null> {
  const r = await getPool().query(`select * from job where id = $1`, [id]).then((r) => r.rows[0]);
  return r ? mapJob(r) : null;
}

export async function createJob(body: Record<string, unknown>): Promise<{ id: string; slug: string }> {
  const title = clean(body.title);
  if (!title) throw new Error('título obrigatório');
  const data = coerceJob(body);
  data.title = title;
  data.slug = await uniqueJobSlug(clean(body.slug) || title);
  const cols = Object.keys(data);
  const params = cols.map((c) => data[c]);
  const sql = `insert into job (${cols.map((c) => `"${c}"`).join(', ')})
               values (${cols.map((_, i) => `$${i + 1}`).join(', ')}) returning id, slug`;
  return getPool().query(sql, params).then((r) => r.rows[0]);
}

export async function updateJob(id: string, body: Record<string, unknown>): Promise<{ id: string; slug: string }> {
  const data = coerceJob(body);
  if ('title' in body && !data.title) throw new Error('título obrigatório');
  if ('slug' in body) {
    const wanted = clean(body.slug) || (data.title as string) || '';
    if (wanted) data.slug = await uniqueJobSlug(wanted, id);
  }
  const cols = Object.keys(data);
  if (!cols.length) throw new Error('nada para atualizar');
  const params = cols.map((c) => data[c]);
  params.push(id);
  const sql = `update job set ${cols.map((c, i) => `"${c}" = $${i + 1}`).join(', ')}, updated_at = now()
               where id = $${params.length} returning id, slug`;
  const row = await getPool().query(sql, params).then((r) => r.rows[0]);
  if (!row) throw new Error('vaga não encontrada');
  return row;
}

export async function removeJob(id: string): Promise<{ ok: true }> {
  await getPool().query(`delete from job where id = $1`, [id]);
  return { ok: true };
}

// ───────── público ─────────

const OPEN_WHERE = `status = 'open' and disabled_at is null and (closes_at is null or closes_at >= now())`;

export async function listOpenJobs(): Promise<JobModel[]> {
  const rows = await getPool()
    .query(`select * from job where ${OPEN_WHERE} order by published_at desc nulls last, created_at desc`)
    .then((r) => r.rows);
  return rows.map(mapJob);
}

export async function getOpenJobBySlug(slug: string): Promise<JobModel | null> {
  const r = await getPool()
    .query(`select * from job where slug = $1 and ${OPEN_WHERE} limit 1`, [slug])
    .then((r) => r.rows[0]);
  return r ? mapJob(r) : null;
}

// ───────── candidaturas ─────────

export interface NewApplication {
  jobId: string;
  name: string;
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  message?: string | null;
  cvPath?: string | null;
  cvName?: string | null;
  cvMime?: string | null;
  cvSize?: number | null;
  source?: string | null;
  page?: string | null;
  consent: boolean;
}

export async function createApplication(a: NewApplication): Promise<{ id: string }> {
  return getPool()
    .query(
      `insert into job_application
         (job_id, name, email, phone, linkedin_url, portfolio_url, message, cv_path, cv_name, cv_mime, cv_size, source, page, consent)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning id`,
      [
        a.jobId, a.name, a.email, a.phone ?? null, a.linkedinUrl ?? null, a.portfolioUrl ?? null, a.message ?? null,
        a.cvPath ?? null, a.cvName ?? null, a.cvMime ?? null, a.cvSize ?? null, a.source ?? null, a.page ?? null, a.consent,
      ],
    )
    .then((r) => r.rows[0]);
}

export async function listApplications(jobId?: string | null): Promise<JobApplicationModel[]> {
  const params: unknown[] = [];
  let sql = `select a.*, j.title as job_title, j.slug as job_slug
               from job_application a join job j on j.id = a.job_id`;
  if (jobId) {
    params.push(jobId);
    sql += ` where a.job_id = $1`;
  }
  sql += ` order by a.created_at desc limit 1000`;
  const rows = await getPool().query(sql, params).then((r) => r.rows);
  return rows.map(mapApplication);
}

export async function getApplication(id: string): Promise<JobApplicationModel | null> {
  const r = await getPool()
    .query(
      `select a.*, j.title as job_title, j.slug as job_slug
         from job_application a join job j on j.id = a.job_id where a.id = $1`,
      [id],
    )
    .then((r) => r.rows[0]);
  return r ? mapApplication(r) : null;
}

export async function updateApplication(
  id: string,
  patch: { status?: ApplicationStatus; notes?: string | null },
): Promise<{ ok: true }> {
  const sets: string[] = [];
  const params: unknown[] = [];
  if (patch.status && APPLICATION_STATUSES.includes(patch.status)) {
    params.push(patch.status);
    sets.push(`status = $${params.length}`);
  }
  if ('notes' in patch) {
    params.push(clean(patch.notes));
    sets.push(`notes = $${params.length}`);
  }
  if (!sets.length) return { ok: true };
  params.push(id);
  await getPool().query(`update job_application set ${sets.join(', ')}, updated_at = now() where id = $${params.length}`, params);
  return { ok: true };
}

export async function removeApplication(id: string): Promise<{ cvPath: string | null }> {
  const r = await getPool()
    .query(`delete from job_application where id = $1 returning cv_path`, [id])
    .then((r) => r.rows[0]);
  return { cvPath: r?.cv_path ?? null };
}
