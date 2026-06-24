import { AppLanguage, resources } from './resources';

type SupportedLanguage = AppLanguage | `${AppLanguage}-${string}`;

/**
 * Normaliza um código de idioma para um dos idiomas suportados.
 * Usado tanto no cliente quanto no servidor.
 *
 * @param language - Código de idioma a ser normalizado (ex: 'en-US', 'pt-BR', 'es')
 * @returns Código de idioma normalizado (pt, en, es, fr) ou 'pt' como fallback
 */
export const normalizeLanguageCode = (
  language: string | undefined,
): AppLanguage => {
  if (!language) {
    return 'pt';
  }

  const baseLanguage = language.split('-')[0].toLowerCase() as SupportedLanguage;

  if (baseLanguage in resources) {
    return baseLanguage as AppLanguage;
  }

  return 'pt';
};

