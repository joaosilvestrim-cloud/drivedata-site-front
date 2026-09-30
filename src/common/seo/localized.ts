import type { Metadata } from 'next';
import type { AppLanguage } from '@/common/i18n/resources';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { pageMetadata } from './index';

type MetaText = { title: string; description: string };

/**
 * Metadata de página no idioma da visita (cookie do trilho de idiomas, domínio e
 * Accept-Language, igual ao <html lang>). Quem não escolheu idioma recebe o
 * padrão do país: português no .com.br e inglês no .ca, como antes.
 */
export async function localizedMetadata(
  path: string,
  copy: Record<AppLanguage, MetaText>,
  extra?: { languages?: boolean; image?: string },
): Promise<Metadata> {
  const lang = await getLanguageSafeAsync();
  return pageMetadata({ path, ...copy[lang], ...extra });
}
