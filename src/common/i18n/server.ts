import { createInstance } from 'i18next';
import { cookies, headers } from 'next/headers';
import { isEnglishDefaultDomain } from './domain-default-language';
import { AppLanguage, defaultNamespace, resources } from './resources';
import { normalizeLanguageCode } from './utils';

const LANGUAGE_COOKIE_NAME = 'drive-data-lp:selected-language';
const SUPPORTED_LANGUAGES: AppLanguage[] = ['pt', 'en', 'es', 'fr'];

const parseAcceptLanguage = (acceptLanguage: string): AppLanguage | undefined => {
  const candidates = acceptLanguage
    .split(',')
    .map((entry) => entry.trim())
    .map((entry) => {
      const [rawLanguage, ...params] = entry.split(';').map((part) => part.trim());
      const qParam = params.find((param) => param.startsWith('q='));
      const quality = qParam ? Number.parseFloat(qParam.replace('q=', '')) : 1;

      return {
        language: normalizeLanguageCode(rawLanguage),
        quality: Number.isFinite(quality) ? quality : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  const bestSupported = candidates.find((candidate) =>
    SUPPORTED_LANGUAGES.includes(candidate.language),
  );

  return bestSupported?.language;
};

/**
 * Detecta o idioma no servidor a partir de cookies primeiro, depois headers.
 */
const getLanguage = async (): Promise<AppLanguage> => {
  const headersList = await headers();

  // Primeiro tenta obter do cookie (escolha do usuário)
  const cookieStore = await cookies();
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;

  console.log('[getServerLanguage] Cookie language:', cookieLanguage);

  if (cookieLanguage) {
    const normalized = normalizeLanguageCode(cookieLanguage);
    console.log('[getServerLanguage] Normalized from cookie:', normalized);
    // Valida se é um idioma suportado
    if (SUPPORTED_LANGUAGES.includes(normalized)) {
      return normalized;
    }
  }

  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');

  if (host && isEnglishDefaultDomain(host)) {
    console.log('[getServerLanguage] English default domain detected:', host);
    return 'en';
  }

  // Se não encontrar no cookie, tenta obter do header Accept-Language
  const acceptLanguage = headersList.get('Accept-Language');

  console.log('[getServerLanguage] Accept-Language header:', acceptLanguage);

  if (acceptLanguage) {
    const preferredLanguage = parseAcceptLanguage(acceptLanguage);
    console.log('[getServerLanguage] Preferred from header:', preferredLanguage);

    if (preferredLanguage) {
      return preferredLanguage;
    }
  }

  // Fallback para pt se não encontrar nada
  console.log('[getServerLanguage] Using fallback: pt');
  return 'pt';
};

/**
 * Obtém o idioma atual no servidor de forma segura.
 */
export const getServerLanguage = async (): Promise<AppLanguage> => {
  return getLanguage();
};

/**
 * Cria uma instância i18n no lado do servidor.
 */
export const getServerTranslations = async () => {
  const lng = await getLanguage();
  const i18nInstance = createInstance();

  await i18nInstance.init({
    resources,
    lng, // Define o idioma detectado
    fallbackLng: 'pt',
    ns: [defaultNamespace],
    defaultNS: defaultNamespace,
    supportedLngs: Object.keys(resources),
    interpolation: {
      escapeValue: false,
    },
    // Não usa initReactI18next no servidor (é apenas para React no cliente)
  });

  return {
    t: i18nInstance.t, // A função de tradução
    i18n: i18nInstance, // A instância completa
    lng, // O idioma detectado
  };
};
