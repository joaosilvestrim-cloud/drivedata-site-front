'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { i18n } from '@/common/i18n';
import type { AppLanguage } from '@/common/i18n/resources';
import { resolveGeoLanguage, shouldApplyGeoLanguage } from '@/common/i18n/geolocation';

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage: AppLanguage;
}

export const I18nProvider = ({ children, initialLanguage }: I18nProviderProps) => {
  const [instance] = useState(() => {
    // Isolate concurrent server requests, while keeping the browser singleton
    // used by language controls and content-refetch helpers.
    if (typeof window === 'undefined') {
      return i18n.cloneInstance({ lng: initialLanguage, initAsync: false });
    }
    // Resources are bundled: this resolves synchronously before child hydration.
    if (i18n.language !== initialLanguage) void i18n.changeLanguage(initialLanguage);
    return i18n;
  });
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

      if (instance.language !== geoLanguage) {
        await instance.changeLanguage(geoLanguage);
      }
    };

    void detectLanguage();

    return () => {
      isActive = false;
    };
  }, [instance]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
};
