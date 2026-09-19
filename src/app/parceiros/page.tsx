import { Header } from '@/common/components';
import { Footer } from '@/common/components/footer';
import { PartnerPortalSection } from '@/common/components/partner-portal-section';
import { ThemeScope } from '@/common/components/theme-scope';
import { SITE_BASE_URL } from '@/common/config/site';
import type { Metadata } from 'next';

const title = 'Portal do Parceiro · DriveData';
const description =
  'Programa de parceiros da DriveData: indicação, revenda, implementação e parceria tecnológica. Leve dados, BI e IA para a sua carteira com o nosso time técnico por trás.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_BASE_URL}/parceiros` },
  openGraph: {
    title,
    description,
    url: `${SITE_BASE_URL}/parceiros`,
    type: 'website',
    siteName: 'DriveData',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description },
};

export default function Page() {
  return (
    <>
      <ThemeScope />
      <Header />
      <PartnerPortalSection />
      <Footer />
    </>
  );
}
