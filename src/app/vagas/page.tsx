import { Header } from '@/common/components';
import { Footer } from '@/common/components/footer';
import { JobsSection } from '@/common/components/jobs-section';
import { ThemeScope } from '@/common/components/theme-scope';
import { SITE_BASE_URL } from '@/common/config/site';
import type { JobModel } from '@/common/model/job.model';
import { listOpenJobs } from '@/server/jobs';
import type { Metadata } from 'next';

const title = 'Vagas · DriveData';
const description =
  'Oportunidades abertas na DriveData: dados, BI, engenharia e IA. Conheça as vagas e candidate-se em poucos minutos.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_BASE_URL}/vagas` },
  openGraph: { title, description, url: `${SITE_BASE_URL}/vagas`, type: 'website', siteName: 'DriveData' },
  twitter: { card: 'summary_large_image', title, description },
};

export default async function Page() {
  let jobs: JobModel[] = [];
  try {
    jobs = await listOpenJobs();
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <ThemeScope />
      <Header />
      <JobsSection jobs={jobs} />
      <Footer />
    </>
  );
}
