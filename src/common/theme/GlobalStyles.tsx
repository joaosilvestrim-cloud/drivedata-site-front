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

      /* Acessibilidade: respeita quem pede menos movimento (carrossel, fluxos, pops) */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          scroll-behavior: auto !important;
        }
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

      /* ═══════════ TOKENS DE TEMA ═══════════
         O ESCURO é o padrão (:root) e vale para o site inteiro — os valores aqui
         são exatamente os que já estavam fixos no código, então nada muda de
         aparência. O CLARO entra só como sobreposição, quando algum elemento
         marca data-theme="light" (hoje: a rota /portal-fabric). Enquanto esse
         atributo não existir, nenhuma página é afetada. */
      :root {
        /* Cores base como tripla RGB: o alfa é aplicado no uso, com
           rgb(var(--dd-ink-rgb) / 0.05). Um par de tokens cobre as dezenas de
           transparências diferentes espalhadas pelas seções, sem precisar de um
           token por opacidade.
             ink = o vidro que no escuro é branco e no claro vira tinta navy
             fog = o texto secundário */
        --dd-ink-rgb: 255 255 255;
        --dd-bg-rgb: 7 12 22;
        --dd-fog-rgb: 234 240 251;

        /* Superfície de cartão. No escuro é vidro branco sobre a página escura;
           no claro é branco sobre a página cinza. Nos DOIS casos o cartão é mais
           claro que o fundo, que é o que faz ele saltar. */
        /* Contorno do numerador: verde vivo no escuro, fechado no claro. */
        --dd-num-stroke: rgba(84, 218, 137, 0.5);
        --dd-surf-1: rgba(255, 255, 255, 0.045);
        --dd-surf-2: rgba(255, 255, 255, 0.07);
        --dd-surf-3: rgba(255, 255, 255, 0.12);

        --dd-bg: #070c16;
        --dd-bg-section: #0a1120;
        --dd-cyan: #22d3ee;
        /* Ciano e menta aparecem como TEXTO no rodapé e nos destaques. Os tons
           claros da marca brilham sobre navy, mas somem sobre branco, então no
           tema claro eles fecham. */
        --dd-danger: #f87171;
        /* Paradas dos gradientes usados como preenchimento de TEXTO. Em botao o
           gradiente segue vibrante; aqui ele fecha no claro pra o titulo ler. */
        --dd-grad-blue: #0a96ec;
        --dd-grad-green: #54da89;
        --dd-grad-cyan: #22d3ee;
        --dd-grad-sky: #38bdf8;
        /* Paineis de vidro que flutuam sobre a secao (dashboard do hero, chips).
           No escuro sao navy; no claro precisam virar vidro BRANCO, senao o texto
           do tema claro cai escuro sobre fundo escuro. */
        --dd-panel: rgba(10, 16, 28, 0.55);
        --dd-panel-solid: rgba(11, 18, 32, 0.92);
        --dd-mint: #8afff5;
        --dd-teal: #27b1c5;
        --dd-surface: rgba(255, 255, 255, 0.045);
        --dd-surface-2: rgba(255, 255, 255, 0.03);
        --dd-surface-3: rgba(255, 255, 255, 0.06);
        --dd-text: #ffffff;
        --dd-text-2: rgba(234, 240, 251, 0.66);
        --dd-text-muted: rgba(234, 240, 251, 0.4);
        --dd-border: rgba(255, 255, 255, 0.08);
        --dd-border-active: rgba(84, 218, 137, 0.35);
        --dd-primary: #54da89;
        --dd-accent: #0a96ec;
        --dd-on-brand: #06121f;
        /* campo de fundo */
        --dd-glow-1: rgba(10, 150, 236, 0.2);
        --dd-glow-2: rgba(84, 218, 137, 0.15);
        --dd-glow-3: rgba(10, 150, 236, 0.13);
        --dd-grid-line: rgba(255, 255, 255, 0.045);
        --dd-grid-opacity: 0.5;
        /* header (pílula flutuante) */
        --dd-header-bg-a: rgba(255, 255, 255, 0.08);
        --dd-header-bg-b: rgba(255, 255, 255, 0.03);
        --dd-header-border: rgba(255, 255, 255, 0.14);
        --dd-header-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
        --dd-nav-text: #ffffff;
        --dd-chip-bg: rgba(255, 255, 255, 0.1);
        --dd-chip-bg-hover: rgba(255, 255, 255, 0.15);
        --dd-dropdown-bg: rgba(15, 20, 30, 0.95);
        --dd-dropdown-border: rgba(255, 255, 255, 0.12);
      }

      [data-theme='light'] {
        /* Mesmas transparências, tinta invertida. */
        --dd-ink-rgb: 9 24 44;
        --dd-bg-rgb: 244 247 251;
        --dd-fog-rgb: 12 27 48;

        --dd-num-stroke: rgba(21, 128, 61, 0.65);
        --dd-surf-1: #ffffff;
        --dd-surf-2: #ffffff;
        --dd-surf-3: #e8eef6;

        /* Página um pouco mais cinza que o branco puro, para o cartão branco
           ter contra o que saltar. */
        --dd-bg: #eef2f7;
        --dd-bg-section: #ffffff;
        --dd-cyan: #0e7490;
        --dd-danger: #b91c1c;
        --dd-grad-blue: #0a72c4;
        --dd-grad-green: #15803d;
        --dd-grad-cyan: #0e7490;
        --dd-grad-sky: #0369a1;
        --dd-panel: rgba(255, 255, 255, 0.82);
        --dd-panel-solid: rgba(255, 255, 255, 0.94);
        --dd-mint: #0f766e;
        --dd-teal: #0e7490;
        --dd-surface: rgba(9, 24, 44, 0.04);
        --dd-surface-2: rgba(9, 24, 44, 0.025);
        --dd-surface-3: rgba(9, 24, 44, 0.06);
        --dd-text: #0a1628;
        --dd-text-2: rgba(12, 27, 48, 0.78);
        --dd-text-muted: rgba(12, 27, 48, 0.62);
        --dd-border: rgba(9, 24, 44, 0.1);
        --dd-border-active: rgba(23, 168, 102, 0.45);
        /* verde da marca não tem contraste sobre branco — no claro usamos a
           versão fechada só para TEXTO/ícone; o gradiente de fundo segue igual. */
        --dd-primary: #15803d;
        --dd-accent: #0a72c4;
        --dd-glow-1: rgba(10, 150, 236, 0.1);
        --dd-glow-2: rgba(84, 218, 137, 0.1);
        --dd-glow-3: rgba(10, 150, 236, 0.07);
        --dd-grid-line: rgba(9, 24, 44, 0.05);
        --dd-grid-opacity: 0.7;
        /* O cabeçalho e os flutuantes seguem ESCUROS no tema claro, de propósito:
           a marca no logotipo é escrita em branco e sumiria sobre fundo claro.
           Não basta "não sobrescrever": os valores do escuro são branco
           translúcido, pensados para vidro sobre fundo escuro, e sobre a página
           clara virariam quase branco (texto branco sumindo). Por isso aqui a
           pílula recebe navy de verdade, com o texto seguindo branco. */
        --dd-header-bg-a: rgba(10, 22, 40, 0.94);
        --dd-header-bg-b: rgba(10, 22, 40, 0.84);
        --dd-header-border: rgba(255, 255, 255, 0.12);
        --dd-header-shadow: 0 18px 50px rgba(9, 24, 44, 0.22);
        --dd-chip-bg: rgba(255, 255, 255, 0.12);
        --dd-chip-bg-hover: rgba(255, 255, 255, 0.2);
        --dd-dropdown-bg: rgba(10, 22, 40, 0.96);
        --dd-dropdown-border: rgba(255, 255, 255, 0.14);
      }

      /* ═══════════ REDESIGN GLOBAL (v2) — campo de fundo + superfícies ═══════════ */
      body {
        background-color: var(--dd-bg) !important;
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
          radial-gradient(620px 620px at 10% 6%, var(--dd-glow-1), transparent 60%),
          radial-gradient(560px 560px at 90% 24%, var(--dd-glow-2), transparent 60%),
          radial-gradient(720px 720px at 50% 108%, var(--dd-glow-3), transparent 60%),
          var(--dd-bg);
      }
      /* Grid técnico sutil sobre o campo */
      body::after {
        content: '';
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        opacity: var(--dd-grid-opacity);
        background-image: linear-gradient(var(--dd-grid-line) 1px, transparent 1px),
          linear-gradient(90deg, var(--dd-grid-line) 1px, transparent 1px);
        background-size: 60px 60px;
        mask-image: radial-gradient(ellipse 110% 70% at 50% 0%, #000 15%, transparent 92%);
      }
      /* Seções ficam posicionadas; o "assentar no campo" é feito por seção
         (transparência) conforme cada uma é redesenhada — evita texto escuro
         sobre fundo escuro em seções ainda não migradas. */
      section {
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
