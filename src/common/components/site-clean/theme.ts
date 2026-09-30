'use client';

// Tema claro/escuro do site no cliente. Ver theme-boot.ts para a regra.
import { useCallback, useEffect, useState } from 'react';
import { SITE_THEME_ATTR, SITE_THEME_COOKIE } from './theme-boot';

export type SiteTheme = 'light' | 'dark';

/** Tema em vigor: o escuro só quando a pessoa escolheu; sem escolha, claro. */
export function currentSiteTheme(): SiteTheme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute(SITE_THEME_ATTR) === 'dark' ? 'dark' : 'light';
}

/** Chama `fn` quando o tema muda (troca pelo botão). Devolve o cancelamento. */
export function onSiteThemeChange(fn: () => void): () => void {
  const mo = new MutationObserver(fn);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: [SITE_THEME_ATTR] });
  return () => mo.disconnect();
}

/**
 * Tema em vigor e a troca. Começa em 'light' (igual ao HTML do servidor) e
 * corrige depois de montar.
 */
export function useSiteTheme() {
  const [theme, setTheme] = useState<SiteTheme>('light');

  useEffect(() => {
    const sync = () => setTheme(currentSiteTheme());
    sync();
    return onSiteThemeChange(sync);
  }, []);

  const set = useCallback((next: SiteTheme) => {
    document.documentElement.setAttribute(SITE_THEME_ATTR, next);
    document.cookie = `${SITE_THEME_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, []);

  const toggle = useCallback(() => set(currentSiteTheme() === 'dark' ? 'light' : 'dark'), [set]);

  return { theme, set, toggle };
}
