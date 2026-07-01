import { Global, css } from '@emotion/react';
import { theme } from './index';

export const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        font-size: 16px;
        scroll-behavior: smooth;
        overflow-x: hidden;
      }

      body {
        font-family:
          var(--font-sora), ${theme.typography.fontFamily.sans.join(', ')};
        font-size: ${theme.typography.fontSize.base[0]};
        line-height: ${theme.typography.fontSize.base[1].lineHeight};
        color: ${theme.colors.neutral[900]};
        background-color: #000000;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        overflow-x: hidden;
      }

      /* ═══════════ REDESIGN GLOBAL (v2) — campo de fundo + superfícies ═══════════ */
      body {
        background-color: #070c16 !important;
        position: relative;
      }
      /* Campo de fundo fixo: mesh de glow (ciano/verde) atrás de todo o site */
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        z-index: -2;
        pointer-events: none;
        background:
          radial-gradient(620px 620px at 10% 6%, rgba(10, 150, 236, 0.2), transparent 60%),
          radial-gradient(560px 560px at 90% 24%, rgba(84, 218, 137, 0.15), transparent 60%),
          radial-gradient(720px 720px at 50% 108%, rgba(10, 150, 236, 0.13), transparent 60%),
          #070c16;
      }
      /* Grid técnico sutil sobre o campo */
      body::after {
        content: '';
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        opacity: 0.5;
        background-image: linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
        background-size: 60px 60px;
        mask-image: radial-gradient(ellipse 110% 70% at 50% 0%, #000 15%, transparent 92%);
      }
      /* Seções assentam no campo (removem o preto sólido antigo) */
      section {
        background-color: transparent !important;
        position: relative;
      }
      /* Headings no display font, com tracking apertado */
      h1,
      h2,
      h3 {
        font-family: var(--font-sora), 'Sora', sans-serif;
        letter-spacing: -0.6px;
      }
      /* ═══════════════════════════════════════════════════════════════════════════ */

      /* Reset para elementos específicos */
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: ${theme.typography.fontWeight.bold};
        line-height: 1.2;
      }

      h1 {
        font-size: ${theme.typography.fontSize['4xl'][0]};
      }

      h2 {
        font-size: ${theme.typography.fontSize['3xl'][0]};
      }

      h3 {
        font-size: ${theme.typography.fontSize['2xl'][0]};
      }

      h4 {
        font-size: ${theme.typography.fontSize.xl[0]};
      }

      h5 {
        font-size: ${theme.typography.fontSize.lg[0]};
      }

      h6 {
        font-size: ${theme.typography.fontSize.base[0]};
      }

      p {
        margin-bottom: ${theme.spacing.md};
      }

      a {
        color: ${theme.colors.primary[600]};
        text-decoration: none;
        transition: color 0.2s ease-in-out;

        &:hover {
          color: ${theme.colors.primary[700]};
        }
      }

      button {
        cursor: pointer;
        border: none;
        background: none;
        font-family: inherit;
      }

      input,
      textarea,
      select {
        font-family: inherit;
        font-size: inherit;
      }

      /* Scrollbar personalizada */
      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar-track {
        background: ${theme.colors.neutral[100]};
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.neutral[300]};
        border-radius: ${theme.borderRadius.full};
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.neutral[400]};
      }

      /* Focus styles para acessibilidade */
      :focus-visible {
        outline: 2px solid ${theme.colors.primary[500]};
        outline-offset: 2px;
      }

      /* Utilitários de performance */
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* ── vanilla-cookieconsent: tema dark Drive Data ─────────────── */
      #cc-main {
        --cc-font-family: var(--font-sora), 'Sora', system-ui, sans-serif;
        --cc-modal-border-radius: 12px;
        --cc-btn-border-radius: 8px;
        --cc-modal-transition-duration: 0.22s;
        --cc-z-index: 9999;

        /* backgrounds */
        --cc-bg: #0f1a2e;
        --cc-secondary-color: #c4c4c4;

        /* primary accent */
        --cc-primary-color: #0dd0d0;

        /* text */
        --cc-text: #c4c4c4;
        --cc-link-color: #0dd0d0;

        /* buttons — primary (Aceitar todos) */
        --cc-btn-primary-bg: #0dd0d0;
        --cc-btn-primary-text: #0a0e1a;
        --cc-btn-primary-hover-bg: #1fe5e5;
        --cc-btn-primary-hover-text: #0a0e1a;
        --cc-btn-primary-border-color: #0dd0d0;

        /* buttons — secondary (Rejeitar / Salvar) */
        --cc-btn-secondary-bg: transparent;
        --cc-btn-secondary-text: #a0aec0;
        --cc-btn-secondary-hover-bg: rgba(255, 255, 255, 0.08);
        --cc-btn-secondary-hover-text: #ffffff;
        --cc-btn-secondary-border-color: rgba(255, 255, 255, 0.15);

        /* separator */
        --cc-separator-border-color: rgba(255, 255, 255, 0.08);

        /* toggle */
        --cc-toggle-on-bg: #0dd0d0;
        --cc-toggle-off-bg: rgba(255, 255, 255, 0.15);
        --cc-toggle-readonly-bg: rgba(13, 208, 208, 0.25);
        --cc-toggle-on-knob-bg: #0a0e1a;
        --cc-toggle-off-knob-bg: rgba(255, 255, 255, 0.6);

        /* cookie category block */
        --cc-cookie-category-block-bg: rgba(255, 255, 255, 0.03);
        --cc-cookie-category-block-border: rgba(255, 255, 255, 0.06);
        --cc-cookie-category-block-hover-bg: rgba(13, 208, 208, 0.06);
        --cc-cookie-category-block-hover-border: rgba(13, 208, 208, 0.25);
        --cc-cookie-category-expanded-block-hover-bg: rgba(255, 255, 255, 0.03);
        --cc-cookie-category-expanded-block-bg: rgba(0, 0, 0, 0.2);

        /* overlay */
        --cc-overlay-bg: rgba(0, 0, 0, 0.65);

        /* footer */
        --cc-footer-bg: rgba(255, 255, 255, 0.03);
        --cc-footer-color: #a0aec0;
        --cc-footer-border-color: rgba(255, 255, 255, 0.08);

        /* table */
        --cc-cookie-table-border: rgba(255, 255, 255, 0.08);
      }

      #cc-main .cm__title {
        color: #ffffff;
        font-weight: 600;
      }

      #cc-main .pm__title {
        color: #ffffff;
        font-weight: 600;
      }

      #cc-main .cc__link {
        color: #0dd0d0;
        text-decoration: underline;
      }
      /* ─────────────────────────────────────────────────────────────── */
    `}
  />
);
