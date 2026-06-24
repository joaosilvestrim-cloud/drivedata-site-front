'use client';

import type { AppLanguage } from './resources';
import { isEnglishDefaultDomain } from './domain-default-language';
import { resources } from './resources';

const GEOLOCATION_ENDPOINT = 'https://ipapi.co/json/';
const GEOLOCATION_STORAGE_KEY = 'drive-data-lp:geo-language';
export const USER_LANGUAGE_STORAGE_KEY = 'drive-data-lp:selected-language';

const COUNTRY_LANGUAGE_MAP: Record<string, AppLanguage> = {
  BR: 'pt',
  PT: 'pt',
  MZ: 'pt',
  AO: 'pt',
  CV: 'pt',
  ST: 'pt',
  TL: 'pt',

  US: 'en',
  GB: 'en',
  IE: 'en',
  CA: 'en',
  AU: 'en',
  NZ: 'en',
  ZA: 'en',
  NG: 'en',
  IN: 'en',
  PH: 'en',
  SG: 'en',

  ES: 'es',
  MX: 'es',
  AR: 'es',
  BO: 'es',
  CL: 'es',
  CO: 'es',
  CR: 'es',
  CU: 'es',
  DO: 'es',
  EC: 'es',
  GQ: 'es',
  GT: 'es',
  HN: 'es',
  NI: 'es',
  PA: 'es',
  PE: 'es',
  PR: 'es',
  PY: 'es',
  SV: 'es',
  UY: 'es',
  VE: 'es',

  FR: 'fr',
  BE: 'fr',
  LU: 'fr',
  MC: 'fr',
  SN: 'fr',
  CI: 'fr',
  CM: 'fr',
  ML: 'fr',
  BF: 'fr',
  NE: 'fr',
  TG: 'fr',
  BJ: 'fr',
  GA: 'fr',
  CG: 'fr',
  CD: 'fr',
  MG: 'fr',
  HT: 'fr',
};

const isAppLanguage = (language: string): language is AppLanguage =>
  Object.prototype.hasOwnProperty.call(resources, language);

const mapCountryToLanguage = (countryCode?: string): AppLanguage | undefined => {
  if (!countryCode) {
    return undefined;
  }

  return COUNTRY_LANGUAGE_MAP[countryCode.toUpperCase()];
};

const getCachedGeoLanguage = (): AppLanguage | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const cachedLanguage = window.localStorage.getItem(GEOLOCATION_STORAGE_KEY);

  if (cachedLanguage && isAppLanguage(cachedLanguage)) {
    return cachedLanguage;
  }

  return undefined;
};

const cacheGeoLanguage = (language: AppLanguage) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GEOLOCATION_STORAGE_KEY, language);
};

const fetchGeoLanguage = async (): Promise<AppLanguage | undefined> => {
  try {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const response = await fetch(GEOLOCATION_ENDPOINT, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      return undefined;
    }

    const data = (await response.json()) as { country_code?: string };
    const language = mapCountryToLanguage(data.country_code);

    if (language) {
      cacheGeoLanguage(language);
    }

    return language;
  } catch (error) {
    console.warn('Não foi possível detectar idioma via geolocalização.', error);
    return undefined;
  }
};

export const shouldApplyGeoLanguage = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // O domínio .ca sempre mantém inglês por padrão sem geolocalização.
  if (isEnglishDefaultDomain(window.location.hostname)) {
    return false;
  }

  // Fora do .ca, prioriza o idioma do navegador.
  if (window.navigator.language) {
    return false;
  }

  const storedPreference = window.localStorage.getItem(USER_LANGUAGE_STORAGE_KEY);
  return !storedPreference;
};

export const resolveGeoLanguage = async (): Promise<AppLanguage | undefined> => {
  const cachedLanguage = getCachedGeoLanguage();

  if (cachedLanguage) {
    return cachedLanguage;
  }

  return fetchGeoLanguage();
};
