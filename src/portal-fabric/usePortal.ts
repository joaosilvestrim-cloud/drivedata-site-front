'use client';

import { useTranslation } from 'react-i18next';
import { normalizeLanguageCode } from '@/common/i18n';
import { SITE_COUNTRY } from '@/common/config/site';
import { PORTAL_COPY, PRICING, type PortalCopy, type PortalLang, type CountryPricing } from './content';

/**
 * Resolve a copy pelo idioma ativo (es cai pra en, já que a landing tem pt/en/fr)
 * e o pricing pelo país do site (BR = R$, CA = CA$).
 */
export function usePortal(): { copy: PortalCopy; pricing: CountryPricing; fmt: (n: number) => string } {
  const { i18n } = useTranslation();
  const code = normalizeLanguageCode(i18n.resolvedLanguage ?? i18n.language);
  const lang: PortalLang = code === 'pt' || code === 'en' || code === 'fr' ? code : 'en';
  const copy = PORTAL_COPY[lang];
  const pricing = PRICING[SITE_COUNTRY];
  const fmt = (n: number) =>
    `${pricing.currency} ${new Intl.NumberFormat(pricing.locale, { maximumFractionDigits: 0 }).format(Math.round(n))}`;
  return { copy, pricing, fmt };
}
