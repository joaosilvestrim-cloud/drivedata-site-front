'use client';

import { useScopedTheme } from '@/common/theme/useThemeMode';

/**
 * Liga o tema claro numa rota.
 *
 * As páginas são componentes de servidor, e o tema é um efeito de cliente, então
 * esta casquinha existe só para carregar o useScopedTheme dentro delas. Enquanto
 * a rota está montada o tema salvo vale; ao sair, volta ao escuro, que é o padrão
 * das páginas ainda não migradas.
 */
export function ThemeScope() {
  useScopedTheme();
  return null;
}
