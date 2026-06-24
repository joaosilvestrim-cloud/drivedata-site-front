import { getServerLanguage } from '@/common/i18n/server';
import type { AppLanguage } from '@/common/i18n/resources';

/**
 * Obtém o idioma atual de forma segura (APENAS para uso em server components).
 * Detecta o idioma através dos headers HTTP no servidor.
 * Usa o valor padrão 'pt' se não conseguir determinar o idioma.
 *
 * @param defaultLang - Idioma padrão caso não seja possível determinar
 * @returns Código de idioma normalizado (pt, en, es, fr)
 */
export async function getLanguageSafeAsync(
  defaultLang: AppLanguage = 'pt',
): Promise<AppLanguage> {
  try {
    const serverLang = await getServerLanguage();
    return serverLang;
  } catch {
    return defaultLang;
  }
}
