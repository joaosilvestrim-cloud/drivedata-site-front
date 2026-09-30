'use client';

// Idiomas do site "clean". Cada componente guarda os próprios textos num objeto
// COPY = { pt, en, es, fr } tipado pelo português (satisfies Copy<typeof pt>):
// se faltar uma chave em qualquer idioma, o build quebra.
//
// O idioma vem do i18next do site (o mesmo que o trilho de bandeiras troca), então
// a página muda de idioma na hora, sem recarregar. No primeiro render o i18next
// lê o <html lang> que o servidor escreveu, e a hidratação casa.
import { useTranslation } from 'react-i18next';
import { normalizeLanguageCode } from '@/common/i18n/utils';
import type { AppLanguage } from '@/common/i18n/resources';

export type Lang = AppLanguage;
export const LANGS: readonly Lang[] = ['pt', 'en', 'es', 'fr'];

/** Mesmo formato em todos os idiomas, com o português como referência. */
export type Copy<T> = Record<Lang, T>;

/** Idioma atual (pt, en, es ou fr). */
export function useLang(): Lang {
  const { i18n } = useTranslation();
  return normalizeLanguageCode(i18n.resolvedLanguage || i18n.language);
}

/** Atalho: textos do componente no idioma atual. */
export function useCopy<T>(copy: Copy<T>): T {
  return copy[useLang()];
}

/** Locale para Intl (datas e números). */
export const INTL_LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-CA', es: 'es', fr: 'fr-CA' };
