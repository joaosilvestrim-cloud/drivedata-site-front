'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

declare global {
  interface Window {
    dataLayer: object[];
    gtag: (...args: unknown[]) => void;
  }
}

function updateGTMConsent(analyticsGranted: boolean, marketingGranted: boolean) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('consent', 'update', {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
    ad_storage: marketingGranted ? 'granted' : 'denied',
    functionality_storage: marketingGranted ? 'granted' : 'denied',
    personalization_storage: marketingGranted ? 'granted' : 'denied',
  });
}

// O banner estava fixo em português (`default: 'pt'`, só com tradução PT): o
// visitante do site do Canadá via a página em inglês e o aviso de consentimento
// em português. A ESTRUTURA é igual nos quatro idiomas, então só as strings
// mudam — `buildTranslation` monta o formato da vanilla-cookieconsent a partir
// deste dicionário, evitando repetir 100 linhas por idioma.
interface CcStrings {
  title: string; desc: string; acceptAll: string; reject: string; customize: string;
  prefTitle: string; rejectAll: string; save: string; close: string; serviceCounter: string;
  aboutTitle: string; aboutDesc: string;
  necTitle: string; necDesc: string; ccCookieDesc: string;
  anaTitle: string; anaDesc: string; gaDesc: string; ga4Desc: string; gidDesc: string;
  mktTitle: string; mktDesc: string; typebotDesc: string;
  hName: string; hDomain: string; hDesc: string; hDuration: string;
  d6m: string; d2y: string; d24h: string; dSession: string;
}

const STRINGS: Record<'pt' | 'en' | 'es' | 'fr', CcStrings> = {
  pt: {
    title: 'Sua privacidade é importante para nós',
    desc: 'Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdos. Você pode aceitar todos os cookies, rejeitá-los ou escolher suas preferências. Para saber mais, leia nossa <a href="/privacy-policy" class="cc__link">Política de Privacidade</a>.',
    acceptAll: 'Aceitar todos', reject: 'Rejeitar', customize: 'Personalizar',
    prefTitle: 'Preferências de cookies', rejectAll: 'Rejeitar todos',
    save: 'Salvar preferências', close: 'Fechar', serviceCounter: 'Serviço|Serviços',
    aboutTitle: 'Sobre os cookies',
    aboutDesc: 'Utilizamos cookies e tecnologias similares para garantir o funcionamento do site, analisar o uso e personalizar sua experiência. Você pode habilitar ou desabilitar cada categoria abaixo. Para mais detalhes, consulte nossa <a href="/privacy-policy" class="cc__link">Política de Privacidade</a>.',
    necTitle: 'Cookies Necessários',
    necDesc: 'Esses cookies são essenciais para o funcionamento do site e não podem ser desativados. Eles incluem as suas preferências de consentimento de cookies.',
    ccCookieDesc: 'Armazena suas preferências de consentimento de cookies',
    anaTitle: 'Cookies Analíticos',
    anaDesc: 'Esses cookies nos ajudam a entender como os visitantes interagem com o site, coletando e reportando informações de forma anônima. Utilizamos o Google Analytics (via Google Tag Manager) para análise de tráfego.',
    gaDesc: 'Identifica usuários únicos para análise de comportamento',
    ga4Desc: 'Mantém o estado de sessão do Google Analytics 4',
    gidDesc: 'Distingue usuários — dados de sessão diária',
    mktTitle: 'Cookies de Marketing',
    mktDesc: 'Esses cookies são utilizados para rastrear visitantes e personalizar a experiência de atendimento via chat (Typebot). O conteúdo é direcionado com base no seu perfil.',
    typebotDesc: 'Mantém o estado da conversa do chat Typebot',
    hName: 'Cookie', hDomain: 'Domínio', hDesc: 'Descrição', hDuration: 'Duração',
    d6m: '6 meses', d2y: '2 anos', d24h: '24 horas', dSession: 'Sessão',
  },
  en: {
    title: 'Your privacy matters to us',
    desc: 'We use cookies to improve your experience, analyse site traffic and personalise content. You can accept all cookies, reject them or choose your preferences. To learn more, read our <a href="/privacy-policy" class="cc__link">Privacy Policy</a>.',
    acceptAll: 'Accept all', reject: 'Reject', customize: 'Customise',
    prefTitle: 'Cookie preferences', rejectAll: 'Reject all',
    save: 'Save preferences', close: 'Close', serviceCounter: 'Service|Services',
    aboutTitle: 'About cookies',
    aboutDesc: 'We use cookies and similar technologies to keep the site running, analyse usage and personalise your experience. You can enable or disable each category below. For details, see our <a href="/privacy-policy" class="cc__link">Privacy Policy</a>.',
    necTitle: 'Necessary cookies',
    necDesc: 'These cookies are essential for the site to work and cannot be switched off. They include your cookie consent preferences.',
    ccCookieDesc: 'Stores your cookie consent preferences',
    anaTitle: 'Analytics cookies',
    anaDesc: 'These cookies help us understand how visitors interact with the site by collecting and reporting information anonymously. We use Google Analytics (via Google Tag Manager) for traffic analysis.',
    gaDesc: 'Identifies unique users for behaviour analysis',
    ga4Desc: 'Keeps the Google Analytics 4 session state',
    gidDesc: 'Distinguishes users — daily session data',
    mktTitle: 'Marketing cookies',
    mktDesc: 'These cookies are used to track visitors and personalise the chat support experience (Typebot). Content is tailored to your profile.',
    typebotDesc: 'Keeps the Typebot chat conversation state',
    hName: 'Cookie', hDomain: 'Domain', hDesc: 'Description', hDuration: 'Duration',
    d6m: '6 months', d2y: '2 years', d24h: '24 hours', dSession: 'Session',
  },
  fr: {
    title: 'Votre vie privée compte pour nous',
    desc: 'Nous utilisons des témoins (cookies) pour améliorer votre expérience, analyser le trafic du site et personnaliser le contenu. Vous pouvez tout accepter, tout refuser ou choisir vos préférences. Pour en savoir plus, consultez notre <a href="/privacy-policy" class="cc__link">politique de confidentialité</a>.',
    acceptAll: 'Tout accepter', reject: 'Refuser', customize: 'Personnaliser',
    prefTitle: 'Préférences de témoins', rejectAll: 'Tout refuser',
    save: 'Enregistrer les préférences', close: 'Fermer', serviceCounter: 'Service|Services',
    aboutTitle: 'À propos des témoins',
    aboutDesc: 'Nous utilisons des témoins et des technologies similaires pour assurer le fonctionnement du site, analyser son utilisation et personnaliser votre expérience. Vous pouvez activer ou désactiver chaque catégorie ci-dessous. Pour plus de détails, consultez notre <a href="/privacy-policy" class="cc__link">politique de confidentialité</a>.',
    necTitle: 'Témoins nécessaires',
    necDesc: 'Ces témoins sont essentiels au fonctionnement du site et ne peuvent pas être désactivés. Ils incluent vos préférences de consentement.',
    ccCookieDesc: 'Conserve vos préférences de consentement aux témoins',
    anaTitle: 'Témoins analytiques',
    anaDesc: 'Ces témoins nous aident à comprendre comment les visiteurs interagissent avec le site, en recueillant et en signalant l’information de façon anonyme. Nous utilisons Google Analytics (via Google Tag Manager) pour l’analyse du trafic.',
    gaDesc: 'Identifie les utilisateurs uniques pour l’analyse du comportement',
    ga4Desc: 'Conserve l’état de session de Google Analytics 4',
    gidDesc: 'Distingue les utilisateurs — données de session quotidienne',
    mktTitle: 'Témoins de marketing',
    mktDesc: 'Ces témoins servent à suivre les visiteurs et à personnaliser l’expérience de clavardage (Typebot). Le contenu est adapté à votre profil.',
    typebotDesc: 'Conserve l’état de la conversation du clavardage Typebot',
    hName: 'Témoin', hDomain: 'Domaine', hDesc: 'Description', hDuration: 'Durée',
    d6m: '6 mois', d2y: '2 ans', d24h: '24 heures', dSession: 'Session',
  },
  es: {
    title: 'Su privacidad es importante para nosotros',
    desc: 'Utilizamos cookies para mejorar su experiencia, analizar el tráfico del sitio y personalizar contenidos. Puede aceptar todas, rechazarlas o elegir sus preferencias. Para saber más, lea nuestra <a href="/privacy-policy" class="cc__link">Política de Privacidad</a>.',
    acceptAll: 'Aceptar todas', reject: 'Rechazar', customize: 'Personalizar',
    prefTitle: 'Preferencias de cookies', rejectAll: 'Rechazar todas',
    save: 'Guardar preferencias', close: 'Cerrar', serviceCounter: 'Servicio|Servicios',
    aboutTitle: 'Sobre las cookies',
    aboutDesc: 'Utilizamos cookies y tecnologías similares para garantizar el funcionamiento del sitio, analizar su uso y personalizar su experiencia. Puede habilitar o deshabilitar cada categoría abajo. Para más detalles, consulte nuestra <a href="/privacy-policy" class="cc__link">Política de Privacidad</a>.',
    necTitle: 'Cookies necesarias',
    necDesc: 'Estas cookies son esenciales para el funcionamiento del sitio y no se pueden desactivar. Incluyen sus preferencias de consentimiento.',
    ccCookieDesc: 'Almacena sus preferencias de consentimiento de cookies',
    anaTitle: 'Cookies analíticas',
    anaDesc: 'Estas cookies nos ayudan a entender cómo los visitantes interactúan con el sitio, recopilando e informando datos de forma anónima. Usamos Google Analytics (vía Google Tag Manager) para el análisis de tráfico.',
    gaDesc: 'Identifica usuarios únicos para análisis de comportamiento',
    ga4Desc: 'Mantiene el estado de sesión de Google Analytics 4',
    gidDesc: 'Distingue usuarios — datos de sesión diaria',
    mktTitle: 'Cookies de marketing',
    mktDesc: 'Estas cookies se utilizan para rastrear visitantes y personalizar la experiencia de atención por chat (Typebot). El contenido se adapta a su perfil.',
    typebotDesc: 'Mantiene el estado de la conversación del chat Typebot',
    hName: 'Cookie', hDomain: 'Dominio', hDesc: 'Descripción', hDuration: 'Duración',
    d6m: '6 meses', d2y: '2 años', d24h: '24 horas', dSession: 'Sesión',
  },
};

function buildTranslation(s: CcStrings) {
  const headers = { name: s.hName, domain: s.hDomain, desc: s.hDesc, duration: s.hDuration };
  return {
    consentModal: {
      title: s.title,
      description: s.desc,
      acceptAllBtn: s.acceptAll,
      acceptNecessaryBtn: s.reject,
      showPreferencesBtn: s.customize,
    },
    preferencesModal: {
      title: s.prefTitle,
      acceptAllBtn: s.acceptAll,
      acceptNecessaryBtn: s.rejectAll,
      savePreferencesBtn: s.save,
      closeIconLabel: s.close,
      serviceCounterLabel: s.serviceCounter,
      sections: [
        { title: s.aboutTitle, description: s.aboutDesc },
        {
          title: s.necTitle,
          description: s.necDesc,
          linkedCategory: 'necessary',
          cookieTable: {
            headers,
            body: [{ name: 'cc_cookie', domain: 'drivedata.com.br', desc: s.ccCookieDesc, duration: s.d6m }],
          },
        },
        {
          title: s.anaTitle,
          description: s.anaDesc,
          linkedCategory: 'analytics',
          cookieTable: {
            headers,
            body: [
              { name: '_ga', domain: 'google.com', desc: s.gaDesc, duration: s.d2y },
              { name: '_ga_*', domain: 'google.com', desc: s.ga4Desc, duration: s.d2y },
              { name: '_gid', domain: 'google.com', desc: s.gidDesc, duration: s.d24h },
            ],
          },
        },
        {
          title: s.mktTitle,
          description: s.mktDesc,
          linkedCategory: 'marketing',
          cookieTable: {
            headers,
            body: [{ name: 'typebot-*', domain: 'drivedata.com.br', desc: s.typebotDesc, duration: s.dSession }],
          },
        },
      ],
    },
  };
}

const SUPPORTED = ['pt', 'en', 'es', 'fr'] as const;
type CcLang = (typeof SUPPORTED)[number];
const normalize = (l?: string): CcLang => {
  const base = (l || 'pt').slice(0, 2).toLowerCase();
  return (SUPPORTED as readonly string[]).includes(base) ? (base as CcLang) : 'pt';
};

export function CookieConsentBanner() {
  const { i18n } = useTranslation();
  const lang = normalize(i18n.language);

  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'box',
          position: 'bottom left',
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          equalWeightButtons: false,
          flipButtons: false,
        },
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [{ name: /^(_ga|_gid|_gat|__utm)/ }],
          },
        },
        marketing: {
          autoClear: {
            cookies: [{ name: /^(typebot)/ }],
          },
        },
      },

      language: {
        default: lang,
        translations: {
          pt: buildTranslation(STRINGS.pt),
          en: buildTranslation(STRINGS.en),
          es: buildTranslation(STRINGS.es),
          fr: buildTranslation(STRINGS.fr),
        },
      },

      onFirstConsent: ({ cookie }) => {
        updateGTMConsent(
          cookie.categories.includes('analytics'),
          cookie.categories.includes('marketing'),
        );
      },

      onConsent: ({ cookie }) => {
        updateGTMConsent(
          cookie.categories.includes('analytics'),
          cookie.categories.includes('marketing'),
        );
      },

      onChange: ({ cookie }) => {
        updateGTMConsent(
          cookie.categories.includes('analytics'),
          cookie.categories.includes('marketing'),
        );
      },
    });
    // Inicializa uma vez. A troca de idioma é tratada no efeito abaixo, para
    // não reabrir o banner de quem já aceitou.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      CookieConsent.setLanguage(lang);
    } catch {
      /* o banner ainda não terminou de iniciar; o default já cobre o 1º render */
    }
  }, [lang]);

  return null;
}
