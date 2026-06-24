import {
  enTranslations,
  esTranslations,
  frTranslations,
  ptTranslations,
} from './locales';

export const defaultNamespace = 'common';

export const resources = {
  pt: {
    [defaultNamespace]: ptTranslations,
  },
  en: {
    [defaultNamespace]: enTranslations,
  },
  es: {
    [defaultNamespace]: esTranslations,
  },
  fr: {
    [defaultNamespace]: frTranslations,
  },
} as const;

export type AppLanguage = keyof typeof resources;
