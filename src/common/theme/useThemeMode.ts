'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Tema claro/escuro.
 *
 * O escuro é o padrão do site. O claro só é aplicado nas rotas que optam por ele
 * (hoje /portal-fabric), marcando data-theme="light" no <html>. Assim o resto do
 * site fica intocado enquanto a migração não avança.
 *
 * A preferência fica num cookie e é aplicada ANTES da primeira pintura por um
 * script inline na rota (ver themeBootScript), pra não piscar escuro→claro. Aqui
 * a gente só lê o que já está no DOM — nada de ler cookie durante o render, que
 * é o que causaria divergência de hidratação.
 */

export type ThemeMode = 'light' | 'dark'

export const THEME_COOKIE = 'drive-data-lp:theme'

/**
 * Script inline para rodar antes da pintura, na rota que suporta tema claro.
 * Fica fora do React de propósito: mexe só no atributo do <html>, que o React
 * não renderiza, então não há mismatch.
 */
export const themeBootScript = `(function(){try{var m=document.cookie.match(/(?:^|; )drive-data-lp:theme=(light|dark)/);if(m&&m[1]==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`

function readDom(): ThemeMode {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

/** Notifica os componentes montados quando o tema muda. */
const listeners = new Set<(m: ThemeMode) => void>()

export function useThemeMode() {
  // Começa sempre em 'dark' (igual ao HTML do servidor) e corrige no efeito.
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    setMode(readDom())
    const fn = (m: ThemeMode) => setMode(m)
    listeners.add(fn)
    return () => { listeners.delete(fn) }
  }, [])

  const set = useCallback((next: ThemeMode) => {
    if (next === 'light') document.documentElement.setAttribute('data-theme', 'light')
    else document.documentElement.removeAttribute('data-theme')
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    listeners.forEach(fn => fn(next))
  }, [])

  const toggle = useCallback(() => { set(readDom() === 'light' ? 'dark' : 'light') }, [set])

  return { mode, set, toggle }
}

/**
 * Aplica o tema salvo enquanto a rota estiver montada e volta pro escuro ao sair.
 * É o que impede o claro de vazar para as páginas ainda não migradas.
 */
export function useScopedTheme() {
  useEffect(() => {
    const saved = document.cookie.match(/(?:^|; )drive-data-lp:theme=(light|dark)/)?.[1]
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light')
    return () => { document.documentElement.removeAttribute('data-theme') }
  }, [])
}
