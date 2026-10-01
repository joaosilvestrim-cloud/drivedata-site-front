import type { Metadata } from 'next';
import { HomeClean } from '@/common/components/site-clean/home';
import { CASES, publicCase } from '@/common/components/site-clean/cases-data';
import { SITE_BASE_URL } from '@/common/config/site';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import type { TargetAudienceProfileModel } from '@/common/model/target-audience-profile.model';
import { hreflang } from '@/common/seo';
import { cachedPartners, cachedProfiles } from '@/server/site-cache';
import { LOGOS, logoName } from '@/common/components/site-clean/content';

// Título e descrição vêm do layout raiz (por idioma). Aqui só o canonical, que o
// layout não define mais para não vazar a home para as outras páginas.
export const metadata: Metadata = {
  alternates: { canonical: SITE_BASE_URL, languages: hreflang('/') },
};

export default async function Home() {
  let profiles: TargetAudienceProfileModel[] = [];
  const lang = await getLanguageSafeAsync();
  try {
    profiles = (await cachedProfiles(lang)) as TargetAudienceProfileModel[];
  } catch (error) {
    console.error(error);
  }


  // Logos da faixa: o cadastro de clientes do admin (já filtrado por país), com os
  // marcados como destaque primeiro. Sem banco, vale a lista fixa do código.
  let logos: { src: string; name: string }[] = LOGOS;
  try {
    const partners = await cachedPartners();
    if (partners.length) {
      logos = [...partners]
        .sort((a, b) => Number(b.featured) - Number(a.featured))
        .map((p) => ({ src: p.imageUrl as string, name: p.name || logoName(p.imageUrl as string) || 'Cliente', featured: p.featured }));
    }
  } catch (error) {
    console.error(error);
  }

  return <HomeClean profiles={profiles} logos={logos} cases={CASES.filter((c) => c.featured).map(publicCase)} />;
}
