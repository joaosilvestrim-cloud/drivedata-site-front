import { PartnersClean } from '@/common/components/site-clean/partners';
import { localizedMetadata } from '@/common/seo/localized';

export const generateMetadata = () =>
  localizedMetadata('/parceiros', {
    pt: {
      title: 'Portal do Parceiro · DriveData',
      description:
        'Programa de parceiros da DriveData: indicação, revenda, implementação e parceria tecnológica. Leve dados, BI e IA para a sua carteira com o nosso time técnico por trás.',
    },
    en: {
      title: 'Partner Program · DriveData',
      description:
        'DriveData partner program: referral, resale, implementation and technology partnerships. Bring data, BI and AI to your clients with our technical team behind you.',
    },
    es: {
      title: 'Programa de Socios · DriveData',
      description:
        'Programa de socios de DriveData: referencia, reventa, implementación y alianza tecnológica. Lleve datos, BI e IA a su cartera con nuestro equipo técnico detrás.',
    },
    fr: {
      title: 'Programme de partenaires · DriveData',
      description:
        'Programme de partenaires DriveData : recommandation, revente, intégration et partenariat technologique. Apportez données, BI et IA à vos clients avec notre équipe technique en appui.',
    },
  });

export default function Page() {
  return <PartnersClean />;
}
