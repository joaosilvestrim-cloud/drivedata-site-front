'use client';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { SITE_COUNTRY } from '@/common/config/site';
import { getDefaultLanguageByHostname, isEnglishDefaultDomain } from './domain-default-language';
import { defaultNamespace, resources } from './resources';
import { normalizeLanguageCode } from './utils';

const getClientHostname = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.location.hostname;
};

const clientHostname = getClientHostname();
// Site do Canadá (SITE_COUNTRY=CA) força inglês por padrão mesmo fora do domínio
// drivedata.ca (ex.: preview *.vercel.app), ignorando o idioma do navegador.
const forceEnglish = isEnglishDefaultDomain(clientHostname) || SITE_COUNTRY === 'CA';
const domainDefaultLanguage = forceEnglish ? 'en' : getDefaultLanguageByHostname(clientHostname);

const detectionOptions = {
  order: forceEnglish
    ? ['localStorage', 'cookie']
    : ['localStorage', 'cookie', 'navigator', 'htmlTag'],
  caches: ['localStorage', 'cookie'],
  lookupLocalStorage: 'drive-data-lp:selected-language',
  lookupCookie: 'drive-data-lp:selected-language',
  cookieMinutes: 60 * 24 * 365, // 1 ano
  cookieDomain: undefined, // Usa o domínio atual
  cookiePath: '/',
  cookieSameSite: 'lax',
  cookieSecure: false, // true em produção com HTTPS
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: domainDefaultLanguage,
      ns: [defaultNamespace],
      defaultNS: defaultNamespace,
      interpolation: {
        escapeValue: false,
      },
      detection: detectionOptions,
      supportedLngs: Object.keys(resources),
      nonExplicitSupportedLngs: true,
    })
    .catch((error) => {
      console.warn('Erro ao inicializar i18next:', error);
    });
}

export { i18n, normalizeLanguageCode };
