import type { Metadata } from 'next';
import { SITE_COUNTRY } from '@/common/config/site';

// Metadata gerado no servidor, ramificado por país (o corpo passa pelo i18n do
// cliente). Sem isso o Canadá herdaria título/descrição em português.
const META = {
  BR: {
    title: 'Portal DriveData — Microsoft Fabric | Usabilidade · Governança · Economia',
    description:
      'Camada centralizada sobre sua capacidade Microsoft Fabric: experiência de usuário superior, governança granular LGPD e redução expressiva de custos de licenciamento Power BI.',
    url: 'https://drivedata.com.br/portal-fabric',
  },
  CA: {
    title: 'Portal DriveData — Microsoft Fabric | Usability · Governance · Savings',
    description:
      'A centralized layer over your Microsoft Fabric capacity: superior user experience, granular governance (Law 25 / PIPEDA) and a significant cut in Power BI licensing costs.',
    url: 'https://drivedata.ca/portal-fabric',
  },
}[SITE_COUNTRY];

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Portal DriveData — Microsoft Fabric',
    description: META.description,
    url: META.url,
    type: 'website',
  },
};

export default function PortalFabricLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
