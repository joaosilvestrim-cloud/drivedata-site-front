'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '@/common/theme';
import { SITE_COUNTRY } from '@/common/config/site';
import { normalizeLanguageCode } from '@/common/i18n';
import { useThemeMode } from '@/common/theme/useThemeMode';
 import { Flag, type FlagCode } from '@/common/components/flags';

/**
 * Trilho flutuante de idiomas — atalho sempre à mão, em todas as páginas.
 * Complementa o seletor do header (que só existe nas páginas com Header).
 *
 * A persistência (cookie + <html lang>) é feita aqui também, porque o listener
 * que faz isso vive no Header e nem toda página monta o Header.
 */

interface Lang { code: FlagCode; label: string }

const ALL: Lang[] = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English'   },
  { code: 'es', label: 'Español'   },
  { code: 'fr', label: 'Français'  },
];

// Os quatro idiomas aparecem nos dois países: o site já é traduzido em todos e
// esconder um só cria dúvida em quem procura o próprio idioma.
const VISIBLE: Lang[] = ALL;

const HTML_LANG: Record<string, string> = {
  pt: 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR',
};

// Fora do site institucional o trilho não aparece.
const HIDDEN_PREFIXES = ['/admin', '/tambasa'];

// Rotas já migradas para tema claro. Só nelas o botão de tema aparece, porque
// nas outras ele não teria efeito e seria só confusão.
// A home entra por igualdade exata: com startsWith, '/' casaria com tudo.
const THEMED_PREFIXES = ['/portal-fabric', '/about', '/article'];
const THEMED_EXACT = ['/'];
const isThemedRoute = (path?: string | null) =>
  !!path && (THEMED_EXACT.includes(path) || THEMED_PREFIXES.some(p => path.startsWith(p)));

const Rail = styled.nav`
  position: fixed;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  z-index: ${theme.zIndex.sticky};
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 7px;
  border-radius: 999px;
  background: var(--dd-dropdown-bg, rgba(10, 16, 28, 0.72));
  border: 1px solid var(--dd-dropdown-border, rgb(var(--dd-ink-rgb) / 0.12));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--dd-header-shadow, 0 12px 34px rgba(0, 0, 0, 0.4));

  /* No mobile o seletor do menu já resolve — o trilho só atrapalharia. */
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const Btn = styled.button<{ isActive: boolean }>`
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid ${p => (p.isActive ? 'rgba(84, 218, 137, 0.55)' : 'transparent')};
  border-radius: 50%;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
  background: ${p => (p.isActive ? 'rgba(84, 218, 137, 0.16)' : 'transparent')};
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: var(--dd-chip-bg-hover, rgb(var(--dd-ink-rgb) / 0.15));
    transform: scale(1.08);
  }

  &:focus-visible {
    outline: 2px solid #54da89;
    outline-offset: 2px;
  }

  /* Rótulo ao passar o mouse */
  &::after {
    content: attr(data-label);
    position: absolute;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    font-family: var(--font-inter), sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
    background: var(--dd-dropdown-bg, rgba(10, 16, 28, 0.94));
    border: 1px solid var(--dd-dropdown-border, rgb(var(--dd-ink-rgb) / 0.12));
    border-radius: 8px;
    padding: 5px 10px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s ease;
  }
  &:hover::after { opacity: 1; }
`;

const Divider = styled.span`
  height: 1px;
  margin: 2px 6px;
  background: var(--dd-dropdown-border, rgb(var(--dd-ink-rgb) / 0.12));
`;

const ThemeBtn = styled(Btn)`
  font-size: 15px;
  /* A pílula é navy nos dois temas, então o ícone é claro fixo. */
  color: rgba(234, 240, 251, 0.8);
`;

export function LanguageRail() {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const { mode, toggle } = useThemeMode();
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState('pt');

  // Só resolve o idioma ativo depois de montar, pra o primeiro render do cliente
  // bater com o HTML do servidor (mesma regra do Header — evita erro de hidratação).
  useEffect(() => { setMounted(true) }, []);

  useEffect(() => {
    const sync = (lng?: string) => setCurrent(normalizeLanguageCode(lng ?? i18n.resolvedLanguage ?? i18n.language));
    sync();
    i18n.on('languageChanged', sync);
    return () => { i18n.off('languageChanged', sync) };
  }, [i18n]);

  const change = useCallback((code: string) => {
    if (code === current) return;
    void i18n.changeLanguage(code);
    document.cookie = `drive-data-lp:selected-language=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    document.documentElement.lang = HTML_LANG[code] ?? 'pt-BR';
  }, [current, i18n]);

  if (HIDDEN_PREFIXES.some(p => pathname?.startsWith(p))) return null;

  const showTheme = isThemedRoute(pathname);
  if (VISIBLE.length < 2 && !showTheme) return null;

  return (
    <Rail aria-label="Idioma e tema">
      {VISIBLE.map(l => (
        <Btn
          key={l.code}
          type="button"
          data-label={l.label}
          aria-label={l.label}
          aria-current={mounted && current === l.code ? 'true' : undefined}
          isActive={mounted && current === l.code}
          onClick={() => change(l.code)}
        >
          <Flag code={l.code} size={20} />
        </Btn>
      ))}

      {showTheme && (
        <>
          <Divider aria-hidden="true" />
          <ThemeBtn
            type="button"
            isActive={false}
            data-label={mode === 'light' ? 'Tema escuro' : 'Tema claro'}
            aria-label={mode === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
            onClick={toggle}
          >
            {mounted && mode === 'light' ? (
              /* lua = ir para o escuro */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
                  fill="currentColor"/>
              </svg>
            ) : (
              /* sol = ir para o claro */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" fill="currentColor"/>
                {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                  <rect key={deg} x="11.2" y="1.6" width="1.6" height="3.4" rx="0.8"
                    fill="currentColor" transform={`rotate(${deg} 12 12)`}/>
                ))}
              </svg>
            )}
          </ThemeBtn>
        </>
      )}
    </Rail>
  );
}
