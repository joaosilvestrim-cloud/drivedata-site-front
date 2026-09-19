import { SITE_COUNTRY } from '@/common/config/site';
import { pageMetadata } from '@/common/seo';

// A página é client component e não pode exportar metadata; este layout existe
// só para dar título, descrição e canonical próprios à política de privacidade.
export const metadata = pageMetadata(
  SITE_COUNTRY === 'CA'
    ? {
        path: '/privacy-policy',
        title: 'Privacy Policy · DriveData',
        description: 'How DriveData collects, uses and protects personal data.',
      }
    : {
        path: '/privacy-policy',
        title: 'Política de Privacidade · DriveData',
        description: 'Como a DriveData coleta, usa e protege dados pessoais, em conformidade com a LGPD.',
      },
);

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
