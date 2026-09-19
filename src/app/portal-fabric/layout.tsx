import type { Metadata } from 'next';
import { SITE_BASE_URL, SITE_COUNTRY } from '@/common/config/site';
import { hreflang } from '@/common/seo';
import { themeBootScript } from '@/common/theme/useThemeMode';

// Metadata gerado no servidor, ramificado por país (o corpo passa pelo i18n do
// cliente). Sem isso o Canadá herdaria título/descrição em português.
const META = {
  BR: {
    title: 'Portal DriveData — Microsoft Fabric | Usabilidade · Governança · Economia',
    description:
      'Camada centralizada sobre sua capacidade Microsoft Fabric: experiência de usuário superior, governança granular LGPD e redução expressiva de custos de licenciamento Power BI.',
  },
  CA: {
    title: 'Portal DriveData — Microsoft Fabric | Usability · Governance · Savings',
    description:
      'A centralized layer over your Microsoft Fabric capacity: superior user experience, granular governance (Law 25 / PIPEDA) and a significant cut in Power BI licensing costs.',
  },
}[SITE_COUNTRY];

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_BASE_URL}/portal-fabric`, languages: hreflang('/portal-fabric') },
  openGraph: {
    title: 'Portal DriveData — Microsoft Fabric',
    description: META.description,
    url: `${SITE_BASE_URL}/portal-fabric`,
    type: 'website',
    siteName: 'DriveData',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Portal DriveData — Microsoft Fabric' }],
  },
};

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
