import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { CookieConsentBanner } from '../common/components/cookie-consent';
import { TypebotModal } from '../common/components/typebot-modal';
import { getServerLanguage } from '../common/i18n/server';
import { EmotionProvider } from '../common/providers/EmotionProvider';
import { I18nProvider } from '../common/providers/I18nProvider';
import { TypebotProvider } from '../common/providers/TypebotProvider';
import {
  generateMetadata as generateSEOMetadata,
  getSEOConfigByLanguage,
} from '../common/seo';

// Renderiza as rotas sob demanda (sem pré-render no build). Evita falha de build
// quando o backend de conteúdo não está disponível (o fetch só roda no request).
export const dynamic = 'force-dynamic';

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const htmlLanguageByAppLanguage = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
  fr: 'fr',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  return generateSEOMetadata(getSEOConfigByLanguage(language));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getServerLanguage();

  return (
    <html
      lang={htmlLanguageByAppLanguage[language]}
      className={`${sora.variable} ${inter.variable}`}
    >
      <head>
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://api.fontshare.com" />

        {/* Fontes */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />

        {/* DNS prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Google Consent Mode v2 — lê consentimento existente para evitar race condition */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function(){
  try {
    var m = document.cookie.match(/(?:^|;)\\s*cc_cookie=([^;]+)/);
    if (m) {
      var c = JSON.parse(decodeURIComponent(m[1]));
      var cats = c.categories || [];
      var analytics = cats.indexOf('analytics') > -1 ? 'granted' : 'denied';
      var marketing = cats.indexOf('marketing') > -1 ? 'granted' : 'denied';
      gtag('consent', 'default', {
        analytics_storage: analytics,
        ad_storage: marketing,
        functionality_storage: marketing,
        personalization_storage: marketing,
        security_storage: 'granted'
      });
    } else {
      gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500
      });
    }
  } catch(e) {
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 500
    });
  }
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);
})();
`,
          }}
        />

        {/* Google Tag Manager — carrega em todas as páginas, tags respeitam o Consent Mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PQVNX8CR');`,
          }}
        />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DriveData',
              description: 'Soluções inteligentes em dados para empresas',
              url: 'https://drivedata.com.br',
              logo: 'https://drivedata.com.br/logo.png',
              sameAs: [
                'https://linkedin.com/company/drivedata',
                'https://twitter.com/drivedata',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+55-11-99999-9999',
                contactType: 'customer service',
                availableLanguage: 'Portuguese',
              },
            }),
          }}
        />
      </head>
      <body className={sora.className}>
        {/* GTM noscript — fallback sem JavaScript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PQVNX8CR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <EmotionProvider>
          <I18nProvider>
            <TypebotProvider>
              {children}
              <TypebotModal />
              <CookieConsentBanner />
            </TypebotProvider>
          </I18nProvider>
        </EmotionProvider>
      </body>
    </html>
  );
}
