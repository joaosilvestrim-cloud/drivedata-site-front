// Configuração por país (white-label). Um único deploy do repositório serve
// Brasil e Canadá; a diferença fica na env NEXT_PUBLIC_SITE_COUNTRY do projeto
// Vercel (BR por padrão, CA no projeto do Canadá).
//
// Controla: tenant de destino das leads, contato exibido, e a página DALT.
// O idioma padrão do Canadá já é resolvido por domínio (drivedata.ca → en),
// ver i18n/domain-default-language.

export type SiteCountry = 'BR' | 'CA';

export const SITE_COUNTRY: SiteCountry =
  (process.env.NEXT_PUBLIC_SITE_COUNTRY || '').toUpperCase() === 'CA' ? 'CA' : 'BR';

export interface SiteContact {
  phone: string;
  addressLines: string[];
}

const CONTACTS: Record<SiteCountry, SiteContact> = {
  BR: {
    phone: '(15) 99797-5794',
    addressLines: ['AL Rio Negro, Alphaville, 503,', '06454-000, Barueri/SP'],
  },
  CA: {
    phone: '+1 416 829-8922',
    addressLines: ['60 Princess St.,', 'Toronto, ON M5A 2Z7, Canadá'],
  },
};

export const SITE_CONTACT: SiteContact = CONTACTS[SITE_COUNTRY];

/** Código do tenant do CRM que recebe as leads deste site (BR | CA). */
export const LEAD_TENANT_CODE: SiteCountry = SITE_COUNTRY;

/** A página/menu DALT só existe no Brasil. */
export const SHOW_DALT: boolean = SITE_COUNTRY !== 'CA';
