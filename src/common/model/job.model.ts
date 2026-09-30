// Tipos e rótulos das vagas (carreiras). Compartilhado entre servidor, admin e
// páginas públicas; não importa nada de servidor.

export type JobStatus = 'draft' | 'open' | 'closed';
export type WorkModel = 'remoto' | 'hibrido' | 'presencial';
export type ContractType = 'clt' | 'pj' | 'estagio' | 'temporario';
export type ApplicationStatus = 'new' | 'reviewing' | 'interview' | 'approved' | 'rejected';

export const JOB_STATUSES: JobStatus[] = ['draft', 'open', 'closed'];
export const WORK_MODELS: WorkModel[] = ['remoto', 'hibrido', 'presencial'];
export const CONTRACT_TYPES: ContractType[] = ['clt', 'pj', 'estagio', 'temporario'];
export const APPLICATION_STATUSES: ApplicationStatus[] = ['new', 'reviewing', 'interview', 'approved', 'rejected'];

// Rótulos em português (admin, OG image, JSON-LD). O site público usa i18n.
export const WORK_MODEL_LABEL: Record<WorkModel, string> = { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' };
export const CONTRACT_LABEL: Record<ContractType, string> = { clt: 'CLT', pj: 'PJ', estagio: 'Estágio', temporario: 'Temporário' };

export interface JobModel {
  id: string;
  slug: string;
  title: string;
  area: string | null;
  location: string | null;
  workModel: WorkModel;
  contractType: ContractType;
  seniority: string | null;
  summary: string | null;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  status: JobStatus;
  locale: string;
  applyUrl: string | null;
  publishedAt: string | null;
  closesAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Traduções dos textos da vaga (preenchidas pelo servidor ao salvar). */
  translations?: JobTranslations;
  /** Só na listagem do admin. */
  applications?: number;
}

// Textos da vaga que ganham tradução automática (EN, ES, FR). Os códigos
// (modelo, contrato) já têm rótulo. A senioridade também é traduzida, mas o site
// prefere o dicionário dele para os valores conhecidos (Júnior, Pleno, Sênior...).
export const JOB_TEXT_FIELDS = ['title', 'area', 'location', 'summary', 'description', 'requirements', 'benefits'] as const;
export const JOB_TRANSLATED_FIELDS = [...JOB_TEXT_FIELDS, 'seniority'] as const;
export type JobTextField = (typeof JOB_TRANSLATED_FIELDS)[number];
export type JobTranslations = Partial<Record<'en' | 'es' | 'fr', Partial<Record<JobTextField, string>>>>;

/** A vaga no idioma pedido: usa a tradução quando existe, senão o português. */
export function localizeJob(job: JobModel, lang: string): JobModel {
  const tr = lang === 'pt' ? undefined : job.translations?.[lang as 'en' | 'es' | 'fr'];
  if (!tr) return job;
  const out: JobModel = { ...job };
  for (const f of JOB_TEXT_FIELDS) if (tr[f] && job[f]) out[f] = tr[f]!;
  return out;
}

export interface JobApplicationModel {
  id: string;
  jobId: string;
  jobTitle?: string;
  jobSlug?: string;
  name: string;
  email: string;
  phone: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  message: string | null;
  cvPath: string | null;
  cvName: string | null;
  cvMime: string | null;
  cvSize: number | null;
  source: string | null;
  page: string | null;
  consent: boolean;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
