'use client';

import { useEffect } from 'react';
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

export function CookieConsentBanner() {
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
        default: 'pt',
        translations: {
          pt: {
            consentModal: {
              title: 'Sua privacidade é importante para nós',
              description:
                'Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdos. Você pode aceitar todos os cookies, rejeitá-los ou escolher suas preferências. Para saber mais, leia nossa <a href="/privacy-policy" class="cc__link">Política de Privacidade</a>.',
              acceptAllBtn: 'Aceitar todos',
              acceptNecessaryBtn: 'Rejeitar',
              showPreferencesBtn: 'Personalizar',
            },
            preferencesModal: {
              title: 'Preferências de cookies',
              acceptAllBtn: 'Aceitar todos',
              acceptNecessaryBtn: 'Rejeitar todos',
              savePreferencesBtn: 'Salvar preferências',
              closeIconLabel: 'Fechar',
              serviceCounterLabel: 'Serviço|Serviços',
              sections: [
                {
                  title: 'Sobre os cookies',
                  description:
                    'Utilizamos cookies e tecnologias similares para garantir o funcionamento do site, analisar o uso e personalizar sua experiência. Você pode habilitar ou desabilitar cada categoria abaixo. Para mais detalhes, consulte nossa <a href="/privacy-policy" class="cc__link">Política de Privacidade</a>.',
                },
                {
                  title: 'Cookies Necessários',
                  description:
                    'Esses cookies são essenciais para o funcionamento do site e não podem ser desativados. Eles incluem as suas preferências de consentimento de cookies.',
                  linkedCategory: 'necessary',
                  cookieTable: {
                    headers: {
                      name: 'Cookie',
                      domain: 'Domínio',
                      desc: 'Descrição',
                      duration: 'Duração',
                    },
                    body: [
                      {
                        name: 'cc_cookie',
                        domain: 'drivedata.com.br',
                        desc: 'Armazena suas preferências de consentimento de cookies',
                        duration: '6 meses',
                      },
                    ],
                  },
                },
                {
                  title: 'Cookies Analíticos',
                  description:
                    'Esses cookies nos ajudam a entender como os visitantes interagem com o site, coletando e reportando informações de forma anônima. Utilizamos o Google Analytics (via Google Tag Manager) para análise de tráfego.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    headers: {
                      name: 'Cookie',
                      domain: 'Domínio',
                      desc: 'Descrição',
                      duration: 'Duração',
                    },
                    body: [
                      {
                        name: '_ga',
                        domain: 'google.com',
                        desc: 'Identifica usuários únicos para análise de comportamento',
                        duration: '2 anos',
                      },
                      {
                        name: '_ga_*',
                        domain: 'google.com',
                        desc: 'Mantém o estado de sessão do Google Analytics 4',
                        duration: '2 anos',
                      },
                      {
                        name: '_gid',
                        domain: 'google.com',
                        desc: 'Distingue usuários — dados de sessão diária',
                        duration: '24 horas',
                      },
                    ],
                  },
                },
                {
                  title: 'Cookies de Marketing',
                  description:
                    'Esses cookies são utilizados para rastrear visitantes e personalizar a experiência de atendimento via chat (Typebot). O conteúdo é direcionado com base no seu perfil.',
                  linkedCategory: 'marketing',
                  cookieTable: {
                    headers: {
                      name: 'Cookie',
                      domain: 'Domínio',
                      desc: 'Descrição',
                      duration: 'Duração',
                    },
                    body: [
                      {
                        name: 'typebot-*',
                        domain: 'drivedata.com.br',
                        desc: 'Mantém o estado da conversa do chat Typebot',
                        duration: 'Sessão',
                      },
                    ],
                  },
                },
              ],
            },
          },
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
  }, []);

  return null;
}
