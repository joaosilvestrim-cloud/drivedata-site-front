import { i18n } from '@/common/i18n';
import { getDefaultLanguageByHostname } from '@/common/i18n/domain-default-language';
import type { AppLanguage } from '@/common/i18n/resources';
import { resources } from '@/common/i18n/resources';
import { normalizeLanguageCode } from '@/common/i18n/utils';

const SUPPORTED_LANGUAGES = Object.keys(resources) as AppLanguage[];

const isSupportedLanguage = (language: string): language is AppLanguage =>
  SUPPORTED_LANGUAGES.includes(language as AppLanguage);

/**
 * Obtém o idioma atual de forma segura (APENAS para uso em client components).
 * Usa o valor padrão 'pt' se não conseguir determinar o idioma.
 * Trabalha exclusivamente com o i18n do cliente.
 *
 * @param defaultLang - Idioma padrão caso não seja possível determinar
 * @returns Código de idioma normalizado (pt, en, es, fr)
 */
export function getLanguageSafe(defaultLang: AppLanguage = 'pt'): AppLanguage {
  try {
    const domainDefaultLanguage =
      typeof window !== 'undefined'
        ? getDefaultLanguageByHostname(window.location.hostname)
        : defaultLang;

    const browserFallbackLanguage =
      typeof window !== 'undefined'
        ? normalizeLanguageCode(window.navigator.language)
        : defaultLang;

    // Tenta obter do i18n (apenas funciona no cliente, onde o i18n está disponível)
    if (i18n && i18n.isInitialized && typeof window !== 'undefined') {
      const currentLang = i18n.resolvedLanguage || i18n.language;
      if (currentLang) {
        const normalized = normalizeLanguageCode(currentLang);
        if (isSupportedLanguage(normalized)) {
          return normalized;
        }
      }
    }

    // Fallback para idioma padrão
    if (domainDefaultLanguage === 'en') {
      return 'en';
    }

    return browserFallbackLanguage;
  } catch {
    return defaultLang;
  }
}
