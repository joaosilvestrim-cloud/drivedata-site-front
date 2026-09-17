// Programa de Parceiros: tipos e rótulos das solicitações de parceria.
// Compartilhado entre servidor, admin e página pública; não importa nada de servidor.
//
// Não confundir com `PartnerModel`/tabela `partner`, que são os logos do
// carrossel de clientes.

export type PartnershipType = 'indicacao' | 'revenda' | 'implementacao' | 'tecnologica' | 'outro';
export type PartnerStatus = 'new' | 'contacted' | 'qualified' | 'approved' | 'rejected';

export const PARTNERSHIP_TYPES: PartnershipType[] = ['indicacao', 'revenda', 'implementacao', 'tecnologica', 'outro'];
export const PARTNER_STATUSES: PartnerStatus[] = ['new', 'contacted', 'qualified', 'approved', 'rejected'];

// Faixas fechadas: viram select no formulário e filtro no admin.
export const COMPANY_SIZES = ['1-5', '6-20', '21-100', '101-500', '500+'] as const;
export const DATA_MATURITY = ['ja-atua', 'parcialmente', 'nao-atua'] as const;
export const HOW_HEARD = ['linkedin', 'indicacao', 'busca', 'evento', 'cliente', 'outro'] as const;

// Rótulos em português para o admin. A página pública usa i18n.
export const PARTNERSHIP_TYPE_LABEL: Record<PartnershipType, string> = {
  indicacao: 'Indicação',
  revenda: 'Revenda',
  implementacao: 'Implementação',
  tecnologica: 'Tecnológica',
  outro: 'Outro',
};

export const PARTNER_STATUS_LABEL: Record<PartnerStatus, string> = {
  new: 'Nova',
  contacted: 'Contactada',
  qualified: 'Qualificada',
  approved: 'Aprovada',
  rejected: 'Não seguiu',
};

export const DATA_MATURITY_LABEL: Record<string, string> = {
  'ja-atua': 'Já atua com dados/BI',
  parcialmente: 'Atua parcialmente',
  'nao-atua': 'Ainda não atua',
};

export interface PartnerApplicationModel {
  id: string;
  partnershipType: PartnershipType;
  company: string;
  cnpj: string | null;
  website: string | null;
  linkedinUrl: string | null;
  contactName: string;
  contactRole: string | null;
  email: string;
  phone: string | null;
  region: string | null;
  segment: string | null;
  companySize: string | null;
  dataMaturity: string | null;
  message: string | null;
  howHeard: string | null;
  consent: boolean;
  status: PartnerStatus;
  notes: string | null;
  source: string | null;
  page: string | null;
  createdAt: string;
  updatedAt: string;
}
