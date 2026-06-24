'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import { i18n } from '@/common/i18n';
import { resolveGeoLanguage, shouldApplyGeoLanguage } from '@/common/i18n/geolocation';

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  useEffect(() => {
    let isActive = true;

    const detectLanguage = async () => {
      if (!shouldApplyGeoLanguage()) {
        return;
      }

      const geoLanguage = await resolveGeoLanguage();

      if (!isActive || !geoLanguage) {
        return;
      }

      if (i18n.language !== geoLanguage) {
        await i18n.changeLanguage(geoLanguage);
      }
    };

    void detectLanguage();

    return () => {
      isActive = false;
    };
  }, [i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
