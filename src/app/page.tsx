import { Footer } from '@/common/components/footer';
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
