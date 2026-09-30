import { JobsClean } from '@/common/components/site-clean/jobs';
import type { JobModel } from '@/common/model/job.model';
import { listOpenJobs } from '@/server/jobs';
import { localizedMetadata } from '@/common/seo/localized';

// A lista de vagas é traduzida; o conteúdo de cada vaga continua em português,
// por isso sem hreflang (languages: false).
export const generateMetadata = () =>
  localizedMetadata(
    '/vagas',
    {
      pt: {
        title: 'Vagas · DriveData',
        description:
          'Oportunidades abertas na DriveData: dados, BI, engenharia e IA. Conheça as vagas e candidate-se em poucos minutos.',
      },
      en: {
        title: 'Careers · DriveData',
        description:
          'Open positions at DriveData: data, BI, engineering and AI. See the openings and apply in a few minutes.',
      },
      es: {
        title: 'Empleos · DriveData',
        description:
          'Vacantes abiertas en DriveData: datos, BI, ingeniería e IA. Conozca las vacantes y postúlese en pocos minutos.',
      },
      fr: {
        title: 'Carrières · DriveData',
        description:
          'Postes ouverts chez DriveData : données, BI, ingénierie et IA. Découvrez les offres et postulez en quelques minutes.',
      },
    },
    { languages: false },
  );

export default async function Page() {
  let jobs: JobModel[] = [];
  try {
    jobs = await listOpenJobs();
  } catch (error) {
    console.error(error);
  }

  return <JobsClean jobs={jobs} />;
}
