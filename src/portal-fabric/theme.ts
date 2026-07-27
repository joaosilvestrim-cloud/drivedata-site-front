/**
 * Tokens visuais da landing "Portal DriveData / Microsoft Fabric".
 * Usa a linguagem da marca DriveData (navy + vidro + Sora + gradiente verde→azul),
 * a mesma do redesign do site. Estrutura espelha src/dalt/theme.ts.
 */

export const portalTheme = {
  colors: {
    bg: '#070c16',
    bgSection: '#0a1120',
    bgCard: 'rgba(255, 255, 255, 0.045)',
    primary: '#54da89',       // verde da marca
    primaryDim: 'rgba(84, 218, 137, 0.14)',
    accent: '#0a96ec',        // azul da marca
    accentDim: 'rgba(10, 150, 236, 0.12)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(234, 240, 251, 0.66)',
    textMuted: 'rgba(234, 240, 251, 0.4)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderActive: 'rgba(84, 218, 137, 0.35)',
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
