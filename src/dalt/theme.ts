/**
 * Tokens visuais da landing page DALT DriveData.
 * Conceito: "Dark Premium Enterprise" — inspirado em painéis de veículos de luxo.
 */

export const daltTheme = {
  colors: {
    bg: '#05050a',
    bgCard: 'rgba(10, 14, 26, 0.85)',
    bgSection: '#0a0e1a',
    primary: '#00e5a0',       // ciano neon
    primaryDim: 'rgba(0, 229, 160, 0.15)',
    accent: '#0088ff',        // azul elétrico
    accentDim: 'rgba(0, 136, 255, 0.12)',
    textPrimary: '#f5f5f5',
    textSecondary: '#a0a8b8',
    textMuted: '#545e72',
    border: 'rgba(255, 255, 255, 0.06)',
    borderActive: 'rgba(0, 229, 160, 0.3)',
  },
  gradients: {
    accent: 'linear-gradient(135deg, #00e5a0 0%, #0088ff 100%)',
    heroBg: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0, 136, 255, 0.12) 0%, transparent 70%)',
    cardBg: 'linear-gradient(135deg, rgba(10, 14, 26, 0.9) 0%, rgba(5, 5, 10, 0.95) 100%)',
    overlay: 'linear-gradient(to bottom, rgba(5,5,10,0.65) 0%, rgba(5,5,10,0.85) 100%)',
    sectionFade: 'linear-gradient(180deg, #05050a 0%, #0a0e1a 40%, #0a0e1a 60%, #05050a 100%)',
  },
  shadows: {
    glowPrimary: '0 0 40px rgba(0, 229, 160, 0.25)',
    glowPrimaryStrong: '0 0 80px rgba(0, 229, 160, 0.35)',
    glowAccent: '0 0 40px rgba(0, 136, 255, 0.2)',
    card: '0 4px 32px rgba(0, 0, 0, 0.5)',
  },
  fonts: {
    heading: "'Space Grotesk', 'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    full: '9999px',
  },
  animation: {
    durationFast: '0.4s',
    durationBase: '0.8s',
    durationSlow: '1.1s',
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    easingOut: 'ease-out',
  },
} as const;
