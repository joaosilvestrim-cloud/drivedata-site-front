import { Footer } from '@/common/components/footer';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { TargetAudienceProfileModel } from '@/common/model/target-audience-profile.model';
import { httpFindManyTargetAudienceProfile } from '@/modules/target-audience-profile/api/find-many-target-audience-profile/http-find-many-target-audience-profile';
import {
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
    profiles = await httpFindManyTargetAudienceProfile({}, lang)
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
      <CtaSection />
      <Footer />
    </>
  );
}
