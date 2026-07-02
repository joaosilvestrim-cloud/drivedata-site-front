import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const flow = keyframes`
  to { stroke-dashoffset: -240; }
`;
const spin = keyframes`
  to { transform: translate(-50%, -50%) rotate(360deg); }
`;
const corePulse = keyframes`
  0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.12); }
`;

export const IntegrationsSectionContainer = styled.section`
  width: 100%;
  background: #060b16;
  padding: ${theme.spacing['4xl']} 0 calc(${theme.spacing['4xl']} + 24px);
  position: relative;
  overflow: hidden;

  /* brilho central (energia do nucleo) */
  &::before {
    content: '';
    position: absolute;
    top: 52%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1100px;
    height: 900px;
    background:
      radial-gradient(circle at 50% 50%, rgba(10, 150, 236, 0.22) 0%, transparent 52%),
      radial-gradient(circle at 50% 50%, rgba(84, 218, 137, 0.1) 0%, transparent 42%);
    pointer-events: none;
  }
  /* malha de circuito, esmaecida nas bordas */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(120, 190, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(120, 190, 255, 0.05) 1px, transparent 1px);
    background-size: 46px 46px;
    -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 10%, transparent 78%);
    mask-image: radial-gradient(circle at 50% 50%, #000 10%, transparent 78%);
    pointer-events: none;
  }
`;

export const IntegrationsSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing['3xl']};
  position: relative;
  z-index: 1;
`;

export const IntegrationsHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  max-width: 900px;
  margin: 0 auto;
`;

export const IntegrationsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -0.6px;
  font-size: 48px;
  line-height: 1.2;
  font-weight: ${theme.typography.fontWeight.bold};
  color: #FFFFFF;
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const IntegrationsTitleHighlight = styled.span`
  color: #0A96EC;
`;

export const IntegrationsDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.66);
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

// ── Palco: ecossistema de dados (núcleo + pedestais 3D + feixes) ──
export const IntegrationsStage = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 8px auto 0;
  aspect-ratio: 1040 / 640;
  perspective: 1400px;

  /* Mobile: vira grade (o radial com pedestais absolutos se sobrepõe no celular) */
  @media (max-width: ${theme.breakpoints.sm}) {
    aspect-ratio: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    place-items: center;
    padding: 10px 0;
  }
`;

export const IntConnectorSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 0;

  .line-base {
    stroke: rgba(120, 190, 255, 0.14);
    stroke-width: 1.5;
    fill: none;
  }
  .line-flow {
    stroke: url(#intLine);
    stroke-width: 2.4;
    fill: none;
    stroke-dasharray: 4 12;
    filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.7));
    animation: ${flow} 3s linear infinite;
  }
  .packet {
    fill: #7dd3fc;
    filter: url(#intGlow);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

export const IntHub = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  padding: 0 24px;
  z-index: 3;
  background: radial-gradient(circle at 50% 40%, rgba(10, 150, 236, 0.35), rgba(6, 11, 22, 0.96) 72%);
  box-shadow:
    0 0 0 1px rgba(84, 218, 137, 0.5),
    0 0 44px rgba(10, 150, 236, 0.55),
    inset 0 0 44px rgba(10, 150, 236, 0.32);

  .brand {
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-weight: 800;
    font-size: 26px;
    letter-spacing: -0.5px;
    background: linear-gradient(120deg, #38bdf8, #54da89);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .sub {
    font-size: 11px;
    color: rgba(234, 240, 251, 0.62);
    line-height: 1.3;
  }

  /* anel externo tracejado girando */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 134%;
    height: 134%;
    border-radius: 50%;
    border: 1px dashed rgba(84, 218, 137, 0.4);
    animation: ${spin} 26s linear infinite;
  }
  /* halo pulsando por trás */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 175%;
    height: 175%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(10, 150, 236, 0.28), transparent 62%);
    animation: ${corePulse} 4.2s ease-in-out infinite;
    z-index: -1;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    position: static;
    transform: none;
    grid-column: 1 / -1;
    margin: 0 auto 4px;
    width: 150px;
    height: 150px;
    .brand {
      font-size: 19px;
    }
    .sub {
      font-size: 9.5px;
    }
  }
`;

// wrapper que posiciona o nó no ponto radial
export const IntNode = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    position: static;
    transform: none;
  }
`;

// o "chip/pedestal" 3D onde o logo assenta
export const IntPedestal = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 148px;
  height: 86px;
  padding: 14px 20px;
  border-radius: 14px;
  transform: rotateX(12deg);
  background: linear-gradient(160deg, #ffffff, #e9f1fb);
  border: 1px solid rgba(120, 190, 255, 0.55);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.5),
    0 0 26px rgba(56, 189, 248, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  img {
    max-height: 46px;
    max-width: 110px;
    width: auto;
    height: auto;
    object-fit: contain;
  }
  span {
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    text-align: center;
  }

  /* base/reflexo brilhante do pedestal */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -11px;
    transform: translateX(-50%);
    width: 80%;
    height: 16px;
    background: radial-gradient(ellipse at center, rgba(56, 189, 248, 0.5), transparent 70%);
    filter: blur(4px);
  }

  ${IntNode}:hover & {
    transform: rotateX(6deg) translateY(-6px) scale(1.05);
    border-color: rgba(84, 218, 137, 0.55);
    box-shadow:
      0 26px 52px rgba(0, 0, 0, 0.6),
      0 0 32px rgba(10, 150, 236, 0.4);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    transform: none;
    width: 104px;
    height: 62px;
    padding: 8px 12px;
    img {
      max-height: 30px;
      max-width: 72px;
    }
    span {
      font-size: 11px;
    }
  }
`;

