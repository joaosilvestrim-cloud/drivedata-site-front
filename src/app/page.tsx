import { Footer } from '@/common/components/footer';
import { ThemeScope } from '@/common/components/theme-scope';
import { SITE_BASE_URL } from '@/common/config/site';
import { hreflang } from '@/common/seo';
import type { Metadata } from 'next';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { TargetAudienceProfileModel } from '@/common/model/target-audience-profile.model';
import { getProfiles } from '@/server/content-db';
import {
  AcademySection,
  ChaosSection,
  ClientsSection,
  CtaSection,
  Header,
  MainSection,
  ProcessSection,
  SolutionsSection,
  TargetAudienceSection
} from '../common/components';

// Título e descrição vêm do layout raiz (por idioma). Aqui só o canonical, que o
// layout não define mais para não vazar a home para as outras páginas.
export const metadata: Metadata = {
  alternates: { canonical: SITE_BASE_URL, languages: hreflang('/') },
};

export default async function Home() {
  let profiles: TargetAudienceProfileModel[] = [];
  try {
    const lang = await getLanguageSafeAsync();
    profiles = (await getProfiles(lang)) as TargetAudienceProfileModel[];
  } catch (error) {
    console.error(error);
  }


  return (
    <>
      <ThemeScope />
      <Header />
      <MainSection />
      <TargetAudienceSection profiles={profiles} />
      <ChaosSection />
      <ClientsSection />
      <SolutionsSection />
      <ProcessSection />
      <AcademySection />
      <CtaSection />
      <Footer />
    </>
  );
}
