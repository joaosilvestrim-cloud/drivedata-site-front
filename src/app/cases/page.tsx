// Cases de clientes (lista). Os textos da página vêm em 4 idiomas pelo componente.
import { CasesClean } from '@/common/components/site-clean/cases';
import { CASES, CASE_TYPES, QUICK_CASES, publicCase } from '@/common/components/site-clean/cases-data';
import { localizedMetadata } from '@/common/seo/localized';

export const generateMetadata = () =>
  localizedMetadata('/cases', {
    pt: {
      title: 'Cases · DriveData',
      description:
        'Projetos reais da DriveData: BI, engenharia de dados, sistemas, automação e alocação de time em empresas como PepsiCo, Unilever e TV TEM.',
    },
    en: {
      title: 'Case studies · DriveData',
      description:
        'Real DriveData projects: BI, data engineering, systems, automation and dedicated teams for companies such as PepsiCo, Unilever and TV TEM.',
    },
    es: {
      title: 'Casos · DriveData',
      description:
        'Proyectos reales de DriveData: BI, ingeniería de datos, sistemas, automatización y equipos dedicados en empresas como PepsiCo, Unilever y TV TEM.',
    },
    fr: {
      title: 'Études de cas · DriveData',
      description:
        'Projets réels de DriveData : BI, ingénierie des données, systèmes, automatisation et équipes dédiées pour des entreprises comme PepsiCo, Unilever et TV TEM.',
    },
  });

export default function CasesPage() {
  return <CasesClean cases={CASES.map(publicCase)} quick={QUICK_CASES} types={CASE_TYPES} />;
}
