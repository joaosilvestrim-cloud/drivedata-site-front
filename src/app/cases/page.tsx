// Cases de clientes (lista). Os textos da página vêm em 4 idiomas pelo componente.
import type { Metadata } from 'next';
import { CasesClean } from '@/common/components/site-clean/cases';
import { CASES, CASE_TYPES, QUICK_CASES, publicCase } from '@/common/components/site-clean/cases-data';
import { SITE_COUNTRY } from '@/common/config/site';
import { pageMetadata } from '@/common/seo';

export const metadata: Metadata = pageMetadata(
  SITE_COUNTRY === 'CA'
    ? {
        path: '/cases',
        title: 'Case studies · DriveData',
        description:
          'Real DriveData projects: BI, data engineering, systems, automation and dedicated teams for companies such as PepsiCo, Unilever and TV TEM.',
      }
    : {
        path: '/cases',
        title: 'Cases · DriveData',
        description:
          'Projetos reais da DriveData: BI, engenharia de dados, sistemas, automação e alocação de time em empresas como PepsiCo, Unilever e TV TEM.',
      },
);

export default function CasesPage() {
  return <CasesClean cases={CASES.map(publicCase)} quick={QUICK_CASES} types={CASE_TYPES} />;
}
