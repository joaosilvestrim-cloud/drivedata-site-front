'use client';

import { GlobalStyles } from '@/common/theme/GlobalStyles';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// Criar cache do Emotion para SSR
const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

const clientSideEmotionCache = createEmotionCache();

interface EmotionProviderProps {
  children: React.ReactNode;
}

export const EmotionProvider = ({ children }: EmotionProviderProps) => {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <GlobalStyles />
      {children}
    </CacheProvider>
  );
};
