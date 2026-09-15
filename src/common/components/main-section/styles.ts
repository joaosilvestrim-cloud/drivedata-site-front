import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const marquee = keyframes`from { transform: translateX(0); } to { transform: translateX(-50%); }`;
const termFade = keyframes`
  0% { opacity: 0; transform: translateY(8px) scale(0.94); }
  12% { opacity: 0.9; transform: translateY(0) scale(1); }
  78% { opacity: 0.9; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-8px) scale(0.94); }
`;

export const MainContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;

  /* glows focais do hero (sobre o campo global) */
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    width: 900px;
    height: 900px;
    left: -240px;
    top: -220px;
    background: radial-gradient(circle, rgba(10, 150, 236, 0.22), transparent 60%);
    filter: blur(20px);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    z-index: 0;
    width: 760px;
    height: 760px;
    right: -180px;
    bottom: -220px;
    background: radial-gradient(circle, rgba(84, 218, 137, 0.16), transparent 60%);
    filter: blur(20px);
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 3;
  }

  /* Mobile: fluir do topo (o min-height 100vh + center cortava o topo da hero) */
  @media (max-width: ${theme.breakpoints.lg}) {
    min-height: auto;
    align-items: flex-start;
  }
`;

export const HeroCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
`;

/* Palco do globo: quadrado grande à direita, sangrando a borda. É o foco
   visual do hero (o painel de dashboard que ficava por cima saiu). */
export const GlobeStage = styled.div`
  position: absolute;
  right: -6%;
  top: 52%;
  transform: translateY(-50%);
  /* Limitado também pela altura: em telas largas e baixas o globo não
     encosta no cabeçalho nem no ticker. */
  width: min(clamp(600px, 58vw, 900px), calc(100vh - 110px));
  aspect-ratio: 1;
  z-index: 1;
  pointer-events: none;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

/* Termos de Dados e IA aparecendo/sumindo em volta do globo */
export const GlobeTerms = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;

  & span {
    position: absolute;
    font-family: ui-monospace, 'SF Mono', 'Courier New', monospace;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.3px;
    white-space: nowrap;
    opacity: 0;
    text-shadow: 0 0 14px currentColor;
    animation: ${termFade} linear infinite;
  }
`;

/* Faixa de métricas rolando (rodapé do hero) */
export const Ticker = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  border-top: 1px solid rgb(var(--dd-ink-rgb) / 0.08);
  background: rgba(7, 12, 22, 0.45);
  backdrop-filter: blur(8px);
  overflow: hidden;
  padding: 13px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);

  & .track {
    display: flex;
    gap: 46px;
    width: max-content;
    animation: ${marquee} 34s linear infinite;
  }
  & .it {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: rgb(var(--dd-fog-rgb) / 0.72);
    white-space: nowrap;
  }
  & .it .d {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #54da89;
    box-shadow: 0 0 8px #54da89;
  }
  & .it b {
    color: var(--dd-text);
    font-weight: 600;
  }
  & .it .up {
    color: var(--dd-primary);
    font-weight: 700;
  }
  & .it .dn {
    color: var(--dd-cyan);
    font-weight: 700;
  }
`;

/* Texto à esquerda; a coluna da direita fica livre para o globo passar atrás. */
export const MainContent = styled.div`
  width: 100%;
  max-width: 1216px;
  margin: 0 auto;
  padding: 130px 24px 60px;
  display: grid;
  grid-template-columns: minmax(0, 640px) 1fr;
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 120px;
  }
`;

export const HeroLeft = styled.div`
  color: var(--dd-text);

  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const MainTitle = styled.h1`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(40px, 4.6vw, 62px);
  line-height: 1.05;
  letter-spacing: -1.6px;
  font-weight: 800;
  margin: 0;
  max-width: 620px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 34px;
    letter-spacing: -0.8px;
  }
`;

export const HighlightedText = styled.span`
  font-weight: 800;
  background: linear-gradient(120deg, var(--dd-grad-blue), var(--dd-grad-green));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const MainActions = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 34px;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.lg}) {
    justify-content: center;
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

export const GhostButton = styled.button`
  font-family: inherit;
  cursor: pointer;
  background: var(--dd-surf-2);
  border: 1px solid rgb(var(--dd-ink-rgb) / 0.22);
  color: var(--dd-text);
  font-size: 16px;
  font-weight: 600;
  padding: 15px 26px;
  border-radius: 999px;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: var(--dd-surf-3);
    transform: translateY(-2px);
  }
`;
