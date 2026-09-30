import type { Metadata } from 'next';
import { HomeClean } from '@/common/components/site-clean/home';
import { CASES, publicCase } from '@/common/components/site-clean/cases-data';
import { SITE_BASE_URL } from '@/common/config/site';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import type { TargetAudienceProfileModel } from '@/common/model/target-audience-profile.model';
import { hreflang } from '@/common/seo';
import { getProfiles } from '@/server/content-db';

// Título e descrição vêm do layout raiz (por idioma). Aqui só o canonical, que o
// layout não define mais para não vazar a home para as outras páginas.
export const metadata: Metadata = {
  alternates: { canonical: SITE_BASE_URL, languages: hreflang('/') },
};

export default async function Home() {
  let profiles: TargetAudienceProfileModel[] = [];
  const lang = await getLanguageSafeAsync();
  try {
    profiles = (await getProfiles(lang)) as TargetAudienceProfileModel[];
  } catch (error) {
    console.error(error);
  }


  return <HomeClean profiles={profiles} cases={CASES.filter((c) => c.featured).map(publicCase)} />;
}
