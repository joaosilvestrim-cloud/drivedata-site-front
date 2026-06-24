import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Script from 'next/script';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'DALT DriveData — Engenharia de Dados para Grandes Operações',
  description:
    'Transforme desafios complexos em eficiência e resultados tangíveis com Inteligência de Negócios, Inovação, Engenharia de Dados, Desenvolvimento e IA.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'DALT DriveData',
    description:
      'Engenharia de dados e outsourcing de alto desempenho para operações acima de R$ 50M/ano.',
    url: 'https://drivedata.com.br/dalt',
    type: 'website',
  },
};

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
