import { Metadata } from 'next';
import { SITE_BASE_URL } from '../config/site';
import type { AppLanguage } from '../i18n/resources';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  locale?: string;
  siteName?: string;
}

// Este metadata é o do LAYOUT RAIZ, herdado por toda página que não declara o
// seu. Por isso ele NÃO define canonical: antes definia `canonical = home`, e
// toda página sem metadata próprio (about, article, privacy, e o site do Canadá
// inteiro) dizia ao Google que era cópia da home do Brasil. Cada página declara
// o próprio canonical; quem não declara fica sem, e o Google escolhe sozinho.
export const generateMetadata = (config: SEOConfig): Metadata => {
  const {
    title,
    description,
    keywords = [],
    author = 'DriveData',
    image = '/og-image.jpg',
    url = SITE_BASE_URL,
    type = 'website',
    locale = 'pt-BR',
    siteName = 'DriveData',
  } = config;

  return {
    // Resolve caminhos relativos (og-image, canonical '/x') contra o domínio certo.
    metadataBase: new URL(SITE_BASE_URL),
    title: `${title} | ${siteName}`,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: siteName,

    // Open Graph
    openGraph: {
      type,
      locale,
      url,
      title,
      description,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@drivedata',
      site: '@drivedata',
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },

    // Icons
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },

    // Manifest
    manifest: '/manifest.json',

    // Theme color
    themeColor: '#0ea5e9',

    // Viewport
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
  };
};

/**
 * Metadata de uma página: título, descrição, canonical próprio e imagem de
 * compartilhamento. Toda página indexável deve usar isto (ver o comentário do
 * generateMetadata sobre o canonical herdado).
 *
 * `path` começa com '/'. O openGraph é sempre completo porque, no Next, o
 * openGraph da página SUBSTITUI o do layout (não mescla): sem `images` aqui, a
 * página ficaria sem imagem ao ser compartilhada.
 */
export const pageMetadata = (cfg: {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata => {
  const url = `${SITE_BASE_URL}${cfg.path === '/' ? '' : cfg.path}`;
  const image = cfg.image ?? '/og-image.jpg';
  return {
    title: cfg.title,
    description: cfg.description,
    alternates: { canonical: url || SITE_BASE_URL },
    openGraph: {
      title: cfg.title,
      description: cfg.description,
      url: url || SITE_BASE_URL,
      type: cfg.type ?? 'website',
      siteName: 'DriveData',
      images: [{ url: image, width: 1200, height: 630, alt: cfg.title }],
    },
    twitter: { card: 'summary_large_image', title: cfg.title, description: cfg.description, images: [image] },
  };
};

// Schema.org JSON-LD para SEO estruturado
export const generateStructuredData = (config: {
  type: 'Organization' | 'WebSite' | 'WebPage' | 'Article' | 'Product';
  data: Record<string, any>;
}) => {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': config.type,
    ...config.data,
  };

  return JSON.stringify(baseSchema);
};

// Configurações padrão para landing page
export const defaultSEOConfig: SEOConfig = {
  title: 'DriveData - Soluções Inteligentes em Dados',
  description:
    'Transforme seus dados em insights valiosos com as soluções mais avançadas de análise e visualização de dados. DriveData oferece ferramentas poderosas para empresas que querem tomar decisões baseadas em dados.',
  keywords: [
    'análise de dados',
    'business intelligence',
    'visualização de dados',
    'dashboard',
    'relatórios',
    'insights',
    'dados empresariais',
    'data science',
    'big data',
    'métricas',
    'KPIs',
    'drivedata',
  ],
  author: 'DriveData',
  image: '/og-image.jpg',
  url: SITE_BASE_URL,
  type: 'website',
  locale: 'pt-BR',
  siteName: 'DriveData',
};

const seoConfigByLanguage: Record<AppLanguage, Partial<SEOConfig>> = {
  pt: {
    title: 'DriveData - Soluções Inteligentes em Dados',
    description:
      'Transforme seus dados em insights valiosos com as soluções mais avançadas de análise e visualização de dados. DriveData oferece ferramentas poderosas para empresas que querem tomar decisões baseadas em dados.',
    locale: 'pt-BR',
  },
  en: {
    title: 'DriveData - Smart Data Solutions',
    description:
      'Turn your data into valuable insights with advanced analytics and visualization solutions. DriveData provides powerful tools for companies that want to make data-driven decisions.',
    locale: 'en-US',
  },
  es: {
    title: 'DriveData - Soluciones Inteligentes de Datos',
    description:
      'Transforme sus datos en información valiosa con soluciones avanzadas de análisis y visualización. DriveData ofrece herramientas potentes para empresas que quieren tomar decisiones basadas en datos.',
    locale: 'es-ES',
  },
  fr: {
    title: 'DriveData - Solutions intelligentes de données',
    description:
      'Transformez vos données en informations précieuses grâce à des solutions avancées d\'analyse et de visualisation. DriveData offre des outils puissants aux entreprises qui veulent prendre des décisions basées sur les données.',
    locale: 'fr-FR',
  },
};

export const getSEOConfigByLanguage = (language: AppLanguage): SEOConfig => {
  return {
    ...defaultSEOConfig,
    ...seoConfigByLanguage[language],
  };
};
