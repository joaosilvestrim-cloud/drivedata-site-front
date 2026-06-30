'use client';

import { useEffect } from 'react';
import { captureAttribution } from '@/common/helpers/attribution';

// Componente sem UI: captura GCLID/UTM da URL no carregamento da página e
// persiste em cookie 1st-party (ver helpers/attribution). Montado no layout raiz.
export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
