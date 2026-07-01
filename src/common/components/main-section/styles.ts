import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const grow = keyframes`from { height: 0 !important; opacity: 0; }`;
const bob = keyframes`0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); }`;
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
`;

export const HeroCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
`;

/* Globo/rede 3D girando (atrás do dashboard, à direita) */
export const GlobeCanvas = styled.canvas`
  position: absolute;
  right: -3%;
  top: 50%;
  transform: translateY(-50%);
  width: 620px;
  height: 620px;
  z-index: 1;
  opacity: 0.9;
  pointer-events: none;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

/* Termos de Dados e IA aparecendo/sumindo em volta do globo */
export const GlobeTerms = styled.div`
  position: absolute;
  right: -3%;
  top: 50%;
  transform: translateY(-50%);
  width: 620px;
  height: 620px;
  z-index: 2;
  pointer-events: none;

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

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

/* Faixa de métricas rolando (rodapé do hero) */
export const Ticker = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
    color: rgba(234, 240, 251, 0.72);
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
    color: #fff;
    font-weight: 600;
  }
  & .it .up {
    color: #54da89;
    font-weight: 700;
  }
  & .it .dn {
    color: #22d3ee;
    font-weight: 700;
  }
`;

export const MainContent = styled.div`
  width: 100%;
  max-width: 1216px;
  margin: 0 auto;
  padding: 130px 24px 60px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 44px;
    text-align: center;
    padding-top: 120px;
  }
`;

export const HeroLeft = styled.div`
  color: #fff;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(84, 218, 137, 0.1);
  border: 1px solid rgba(84, 218, 137, 0.3);
  color: #54da89;
  font-size: 13px;
  font-weight: 600;
  padding: 7px 15px;
  border-radius: 999px;
  margin-bottom: 26px;
  backdrop-filter: blur(6px);

  & .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #54da89;
    box-shadow: 0 0 10px #54da89;
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
  background: linear-gradient(120deg, #0a96ec, #54da89);
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
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  padding: 15px 26px;
  border-radius: 999px;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.13);
    transform: translateY(-2px);
  }
`;

/* ── Dashboard em vidro (foco visual do hero) ───────────────── */
export const HeroDash = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.55);
  animation: ${bob} 8s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 22px;
    padding: 1px;
    background: linear-gradient(
      140deg,
      rgba(84, 218, 137, 0.5),
      transparent 42%,
      transparent 58%,
      rgba(10, 150, 236, 0.5)
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 460px;
    margin: 0 auto;
    animation: none;
  }
`;

export const DashHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  & .t {
    font-size: 13px;
    font-weight: 600;
    color: rgba(234, 240, 251, 0.62);
  }
  & .live {
    font-size: 10.5px;
    color: #54da89;
  }
`;

export const DashKpis = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;

  & .kpi {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    padding: 12px;
  }
  & .kpi .n {
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 800;
  }
  & .kpi .n.up {
    color: #54da89;
  }
  & .kpi .n.bl {
    color: #22d3ee;
  }
  & .kpi .l {
    font-size: 10px;
    color: rgba(234, 240, 251, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 3px;
  }
`;

export const DashBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
  padding: 10px 4px 0;

  & .bar {
    flex: 1;
    border-radius: 6px 6px 0 0;
    background: linear-gradient(120deg, #0a96ec, #54da89);
    animation: ${grow} 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
`;

export const FloatChip = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(11, 18, 32, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  padding: 11px 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);

  &.top {
    top: -20px;
    right: 22px;
    animation: ${bob} 5s ease-in-out infinite;
  }
  &.bot {
    bottom: -22px;
    left: -16px;
    animation: ${bob} 5s ease-in-out infinite 0.8s;
  }
  & .ic {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(84, 218, 137, 0.14);
    color: #54da89;
    font-weight: 800;
    font-size: 12px;
  }
  & .ic.bl {
    background: rgba(10, 150, 236, 0.16);
    color: #22d3ee;
  }
  & b {
    font-size: 12px;
    color: #fff;
  }
  & .s {
    color: rgba(234, 240, 251, 0.4);
    font-size: 10.5px;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;
