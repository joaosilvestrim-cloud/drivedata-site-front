import type { AppLanguage } from './resources';

const ENGLISH_DEFAULT_DOMAIN_SUFFIX = 'drivedata.ca';

const normalizeHostname = (hostname?: string): string => {
  if (!hostname) {
    return '';
  }

  return hostname.split(':')[0].toLowerCase();
};

export const isEnglishDefaultDomain = (hostname?: string): boolean => {
  const normalizedHostname = normalizeHostname(hostname);

  return (
    normalizedHostname === ENGLISH_DEFAULT_DOMAIN_SUFFIX ||
    normalizedHostname.endsWith(`.${ENGLISH_DEFAULT_DOMAIN_SUFFIX}`)
  );
};

export const getDefaultLanguageByHostname = (hostname?: string): AppLanguage => {
  return isEnglishDefaultDomain(hostname) ? 'en' : 'pt';
};
