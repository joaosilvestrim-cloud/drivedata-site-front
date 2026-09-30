import type { Metadata } from 'next';
import { SITE_BASE_URL, SITE_COUNTRY } from '@/common/config/site';
import { hreflang } from '@/common/seo';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import type { AppLanguage } from '@/common/i18n/resources';
import { themeBootScript } from '@/common/theme/useThemeMode';

// Metadata no idioma da visita (cookie do trilho, domínio e Accept-Language).
// A lei de privacidade citada acompanha o país: LGPD no Brasil, Lei 25 no Canadá.
const LAW = SITE_COUNTRY === 'CA' ? { pt: 'Lei 25', en: 'Law 25 / PIPEDA', es: 'Ley 25', fr: 'Loi 25' } : { pt: 'LGPD', en: 'LGPD', es: 'LGPD', fr: 'LGPD' };
const META: Record<AppLanguage, { title: string; description: string }> = {
  pt: {
    title: 'Portal DriveData — Microsoft Fabric | Usabilidade · Governança · Economia',
    description: `Camada centralizada sobre sua capacidade Microsoft Fabric: experiência de usuário superior, governança granular ${LAW.pt} e redução expressiva de custos de licenciamento Power BI.`,
  },
  en: {
    title: 'Portal DriveData — Microsoft Fabric | Usability · Governance · Savings',
    description: `A centralized layer over your Microsoft Fabric capacity: superior user experience, granular governance (${LAW.en}) and a significant cut in Power BI licensing costs.`,
  },
  es: {
    title: 'Portal DriveData — Microsoft Fabric | Usabilidad · Gobernanza · Ahorro',
    description: `Una capa centralizada sobre su capacidad Microsoft Fabric: mejor experiencia de usuario, gobernanza granular (${LAW.es}) y una reducción importante del costo de licencias Power BI.`,
  },
  fr: {
    title: 'Portal DriveData — Microsoft Fabric | Utilisabilité · Gouvernance · Économies',
    description: `Une couche centralisée au-dessus de votre capacité Microsoft Fabric : meilleure expérience utilisateur, gouvernance granulaire (${LAW.fr}) et baisse marquée des coûts de licences Power BI.`,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const m = META[await getLanguageSafeAsync()];
  return {
    title: m.title,
    description: m.description,
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_BASE_URL}/portal-fabric`, languages: hreflang('/portal-fabric') },
    openGraph: {
      title: 'Portal DriveData — Microsoft Fabric',
      description: m.description,
      url: `${SITE_BASE_URL}/portal-fabric`,
      type: 'website',
      siteName: 'DriveData',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Portal DriveData — Microsoft Fabric' }],
    },
  };
}

export default function PortalFabricLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Aplica o tema salvo antes da primeira pintura, pra não piscar escuro→claro.
          Mexe só no atributo do <html>, que o React não renderiza — sem mismatch. */}
      <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      {children}
    </>
  );
}
