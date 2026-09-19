import { Header } from '@/common/components';
import { Footer } from '@/common/components/footer';
import { PartnerPortalSection } from '@/common/components/partner-portal-section';
import { ThemeScope } from '@/common/components/theme-scope';
import { SITE_COUNTRY } from '@/common/config/site';
import { pageMetadata } from '@/common/seo';
import type { Metadata } from 'next';

// O corpo da página é traduzido pelo i18n; o metadata sai do servidor, então
// ramifica por país (o .ca antes mostrava o título em português).
const META = {
  BR: {
    title: 'Portal do Parceiro · DriveData',
    description:
      'Programa de parceiros da DriveData: indicação, revenda, implementação e parceria tecnológica. Leve dados, BI e IA para a sua carteira com o nosso time técnico por trás.',
  },
  CA: {
    title: 'Partner Program · DriveData',
    description:
      'DriveData partner program: referral, resale, implementation and technology partnerships. Bring data, BI and AI to your clients with our technical team behind you.',
  },
}[SITE_COUNTRY];

export const metadata: Metadata = pageMetadata({ path: '/parceiros', ...META });

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
