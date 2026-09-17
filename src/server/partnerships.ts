// Programa de Parceiros: solicitações de parceria.
//
// Leitura e escrita passam pelo pg pool (SITE_DATABASE_URL, que ignora RLS).
// Ver supabase/migrations/007_parceiros.sql.
import {
  PARTNER_STATUSES,
  PARTNERSHIP_TYPES,
  type PartnerApplicationModel,
  type PartnerStatus,
  type PartnershipType,
} from '@/common/model/partner-application.model';
import { getPool } from './content-db';

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

function map(r: any): PartnerApplicationModel {
  return {
    id: r.id,
    partnershipType: r.partnership_type ?? 'indicacao',
    company: r.company,
    cnpj: r.cnpj ?? null,
    website: r.website ?? null,
    linkedinUrl: r.linkedin_url ?? null,
    contactName: r.contact_name,
    contactRole: r.contact_role ?? null,
    email: r.email,
    phone: r.phone ?? null,
    region: r.region ?? null,
    segment: r.segment ?? null,
    companySize: r.company_size ?? null,
    dataMaturity: r.data_maturity ?? null,
    message: r.message ?? null,
    howHeard: r.how_heard ?? null,
    consent: !!r.consent,
    status: r.status ?? 'new',
    notes: r.notes ?? null,
    source: r.source ?? null,
    page: r.page ?? null,
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
  };
}

const clean = (v: unknown): string | null => {
  const s = v == null ? '' : String(v).trim();
  return s ? s : null;
};

export interface NewPartnerApplication {
  partnershipType: string;
  company: string;
  cnpj?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  contactName: string;
  contactRole?: string | null;
  email: string;
  phone?: string | null;
  region?: string | null;
  segment?: string | null;
  companySize?: string | null;
  dataMaturity?: string | null;
  message?: string | null;
  howHeard?: string | null;
  source?: string | null;
  page?: string | null;
}

export async function createPartnerApplication(a: NewPartnerApplication): Promise<{ id: string }> {
  const type = PARTNERSHIP_TYPES.includes(a.partnershipType as PartnershipType)
    ? (a.partnershipType as PartnershipType)
    : 'outro';
  return getPool()
    .query(
      `insert into partner_application
         (partnership_type, company, cnpj, website, linkedin_url, contact_name, contact_role, email, phone,
          region, segment, company_size, data_maturity, message, how_heard, consent, source, page)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true,$16,$17) returning id`,
      [
        type,
        a.company,
        clean(a.cnpj),
        clean(a.website),
        clean(a.linkedinUrl),
        a.contactName,
        clean(a.contactRole),
        a.email,
        clean(a.phone),
        clean(a.region),
        clean(a.segment),
        clean(a.companySize),
        clean(a.dataMaturity),
        clean(a.message),
        clean(a.howHeard),
        clean(a.source),
        clean(a.page),
      ],
    )
    .then((r) => r.rows[0]);
}

export async function listPartnerApplications(status?: string | null): Promise<PartnerApplicationModel[]> {
  const params: unknown[] = [];
  let sql = `select * from partner_application`;
  if (status && PARTNER_STATUSES.includes(status as PartnerStatus)) {
    params.push(status);
    sql += ` where status = $1`;
  }
  sql += ` order by created_at desc limit 1000`;
  const rows = await getPool().query(sql, params).then((r) => r.rows);
  return rows.map(map);
}

export async function updatePartnerApplication(
  id: string,
  patch: { status?: PartnerStatus; notes?: string | null },
): Promise<{ ok: true }> {
  const sets: string[] = [];
  const params: unknown[] = [];
  if (patch.status && PARTNER_STATUSES.includes(patch.status)) {
    params.push(patch.status);
    sets.push(`status = $${params.length}`);
  }
  if ('notes' in patch) {
    params.push(clean(patch.notes));
    sets.push(`notes = $${params.length}`);
  }
  if (!sets.length) return { ok: true };
  params.push(id);
  await getPool().query(
    `update partner_application set ${sets.join(', ')}, updated_at = now() where id = $${params.length}`,
    params,
  );
  return { ok: true };
}

export async function removePartnerApplication(id: string): Promise<{ ok: true }> {
  await getPool().query(`delete from partner_application where id = $1`, [id]);
  return { ok: true };
}
