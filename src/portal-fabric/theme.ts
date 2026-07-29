/**
 * Tokens visuais da landing "Portal DriveData / Microsoft Fabric".
 *
 * Os valores apontam para as variáveis CSS definidas em common/theme/GlobalStyles.
 * O escuro é o padrão; quando a rota marca data-theme="light" no <html>, as mesmas
 * variáveis passam a valer claro e a página inteira acompanha sem tocar nos
 * componentes. Gradientes de marca não mudam (o verde/azul funcionam nos dois).
 */

export const portalTheme = {
  colors: {
    bg: 'var(--dd-bg)',
    bgSection: 'var(--dd-bg-section)',
    bgCard: 'var(--dd-surface)',
    surfaceSubtle: 'var(--dd-surface-2)',
    surfaceStrong: 'var(--dd-surface-3)',
    primary: 'var(--dd-primary)',
    primaryDim: 'rgba(84, 218, 137, 0.14)',
    accent: 'var(--dd-accent)',
    accentDim: 'rgba(10, 150, 236, 0.12)',
    textPrimary: 'var(--dd-text)',
    textSecondary: 'var(--dd-text-2)',
    textMuted: 'var(--dd-text-muted)',
    border: 'var(--dd-border)',
    borderActive: 'var(--dd-border-active)',
    onBrand: 'var(--dd-on-brand)',
  },
  gradients: {
    brand: 'linear-gradient(120deg, #0a96ec, #54da89)',
    brandSoft: 'linear-gradient(120deg, rgba(10,150,236,0.16), rgba(84,218,137,0.16))',
    heroGlow: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(10, 150, 236, 0.16) 0%, transparent 70%)',
    card: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  },
  shadows: {
    glow: '0 0 40px rgba(84, 218, 137, 0.2)',
    glowStrong: '0 0 80px rgba(84, 218, 137, 0.3)',
    card: '0 12px 40px rgba(0, 0, 0, 0.4)',
  },
  fonts: {
    heading: "var(--font-sora), 'Sora', sans-serif",
    body: "var(--font-inter), 'Inter', sans-serif",
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '18px',
    full: '9999px',
  },
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
} as const;
