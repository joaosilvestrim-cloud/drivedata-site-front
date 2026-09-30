import { JobDetailClean } from '@/common/components/site-clean/job-detail';
import { SITE_BASE_URL } from '@/common/config/site';
import { getOpenJobBySlug } from '@/server/jobs';
import { localizeJob } from '@/common/model/job.model';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

const plain = (s?: string | null) => (s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await getOpenJobBySlug(slug).catch(() => null);
  if (!found) return { title: 'Vaga · DriveData', robots: { index: false } };
  // título e resumo no idioma da visita (inglês no .ca), com a tradução gravada
  const lang = await getLanguageSafeAsync();
  const job = localizeJob(found, lang);
  const title = `${job.title} · ${{ pt: 'Vagas', en: 'Careers', es: 'Empleos', fr: 'Carrières' }[lang] ?? 'Vagas'} DriveData`;
  const description = (job.summary || plain(job.description)).slice(0, 160);
  const canonical = `${SITE_BASE_URL}/vagas/${job.slug}`;
  // A imagem do card (og:image) vem do opengraph-image.tsx desta rota.
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', siteName: 'DriveData' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const EMPLOYMENT: Record<string, string> = { clt: 'FULL_TIME', pj: 'CONTRACTOR', estagio: 'INTERN', temporario: 'TEMPORARY' };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const job = await getOpenJobBySlug(slug).catch(() => null);
  if (!job) notFound();

  const canonical = `${SITE_BASE_URL}/vagas/${job.slug}`;
  const country = SITE_BASE_URL.endsWith('.ca') ? 'CA' : 'BR';

  // JobPosting: a vaga aparece no Google for Jobs.
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.summary || job.title,
    datePosted: job.publishedAt || job.createdAt,
    validThrough: job.closesAt || undefined,
    employmentType: EMPLOYMENT[job.contractType] || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'DriveData',
      sameAs: SITE_BASE_URL,
      logo: `${SITE_BASE_URL}/logotipo-drivedata.png`,
    },
    identifier: { '@type': 'PropertyValue', name: 'DriveData', value: job.id },
    directApply: !job.applyUrl,
    url: canonical,
  };
  if (job.workModel === 'remoto') {
    ld.jobLocationType = 'TELECOMMUTE';
    ld.applicantLocationRequirements = { '@type': 'Country', name: country === 'CA' ? 'Canada' : 'Brazil' };
  }
  if (job.location) {
    ld.jobLocation = {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: country },
    };
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <JobDetailClean job={job} canonical={canonical} />
    </>
  );
}
