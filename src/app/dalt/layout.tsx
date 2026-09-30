import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { SITE_BASE_URL, SITE_COUNTRY } from '@/common/config/site';
import { hreflang } from '@/common/seo';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import type { AppLanguage } from '@/common/i18n/resources';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

// Metadata no idioma da visita (cookie do trilho, domínio e Accept-Language).
// Sem escolha, vale o padrão do país: português no .com.br e inglês no .ca.
const META: Record<AppLanguage, { title: string; description: string; ogDescription: string }> = {
  pt: {
    title: 'DALT DriveData — Engenharia de Dados para Grandes Operações',
    description:
      'Transforme desafios complexos em eficiência e resultados tangíveis com Inteligência de Negócios, Inovação, Engenharia de Dados, Desenvolvimento e IA.',
    ogDescription:
      SITE_COUNTRY === 'CA'
        ? 'Engenharia de dados e outsourcing de alto desempenho para grandes operações.'
        : 'Engenharia de dados e outsourcing de alto desempenho para operações acima de R$ 50M/ano.',
  },
  en: {
    title: 'DALT DriveData — Data Engineering for Large Operations',
    description:
      'Turn complex challenges into efficiency and tangible results with Business Intelligence, Innovation, Data Engineering, Development and AI.',
    ogDescription: 'High-performance data engineering and outsourcing for large-scale operations.',
  },
  es: {
    title: 'DALT DriveData — Ingeniería de Datos para Grandes Operaciones',
    description:
      'Convierta desafíos complejos en eficiencia y resultados tangibles con Inteligencia de Negocios, Innovación, Ingeniería de Datos, Desarrollo e IA.',
    ogDescription: 'Ingeniería de datos y outsourcing de alto rendimiento para operaciones de gran escala.',
  },
  fr: {
    title: 'DALT DriveData — Ingénierie des données pour les grandes opérations',
    description:
      'Transformez des défis complexes en efficacité et en résultats concrets grâce à la Business Intelligence, l’innovation, l’ingénierie des données, le développement et l’IA.',
    ogDescription: 'Ingénierie des données et impartition haute performance pour les opérations à grande échelle.',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const m = META[await getLanguageSafeAsync()];
  return {
    title: m.title,
    description: m.description,
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_BASE_URL}/dalt`, languages: hreflang('/dalt') },
    openGraph: {
      title: 'DALT DriveData',
      description: m.ogDescription,
      url: `${SITE_BASE_URL}/dalt`,
      type: 'website',
      siteName: 'DriveData',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'DALT DriveData' }],
    },
  };
}

export default function DaltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={spaceGrotesk.variable}>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-QZHKPT0RDR"
        strategy="afterInteractive"
      />
      <Script id="gtag-dalt" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-QZHKPT0RDR');`}
      </Script>

      {/* Google Ads */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18203702207"
        strategy="afterInteractive"
      />
      <Script id="google-ads-dalt" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18203702207');`}
      </Script>

      {/* LinkedIn Insight Tag */}
      <Script id="linkedin-insight-dalt" strategy="afterInteractive">
        {`_linkedin_partner_id = "10129857";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);`}
      </Script>

      {/* LinkedIn noscript fallback */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          src="https://px.ads.linkedin.com/collect/?pid=10129857&fmt=gif"
        />
      </noscript>

      {children}
    </div>
  );
}
