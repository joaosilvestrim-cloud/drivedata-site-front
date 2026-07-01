import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const dash = keyframes`
  to { stroke-dashoffset: -220; }
`;

const hubPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 rgba(84,218,137,0.0), 0 24px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(10,150,236,0.15); }
  50% { box-shadow: 0 0 46px rgba(84,218,137,0.28), 0 24px 60px rgba(0,0,0,0.5), inset 0 0 46px rgba(10,150,236,0.22); }
`;

const revealUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SolutionsSectionContainer = styled.section`
  width: 100%;
  padding: 120px 0 100px;
  background: transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    width: 820px;
    height: 820px;
    left: 50%;
    top: 40px;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(10, 150, 236, 0.12), transparent 60%);
    filter: blur(20px);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 84px 0 72px;
  }
`;

export const SolutionsSectionContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
`;

export const SolutionsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -1px;
  font-size: clamp(30px, 3.4vw, 48px);
  line-height: 1.1;
  font-weight: 800;
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const SolutionsDescription = styled.p`
  font-family: 'Satoshi', sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.7);
  margin: 0 auto;
  max-width: 640px;
  font-weight: ${theme.typography.fontWeight.normal};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

/* ── Palco radial (desktop) ─────────────────────────────────────── */
export const EcosystemStage = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1040px;
  margin: 44px auto 0;
  aspect-ratio: 1040 / 640;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

export const ConnectorSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: visible;

  .line-base {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 1.4;
  }

  .line-flow {
    fill: none;
    stroke: url(#ecoLine);
    stroke-width: 1.6;
    stroke-dasharray: 6 14;
    opacity: 0.5;
    animation: ${dash} 3.4s linear infinite;
  }

  .packet {
    fill: #8affc0;
    filter: url(#ecoGlow);
    opacity: 0.85;
  }

  .conn.active .line-base {
    stroke: url(#ecoLine);
    stroke-width: 2.6;
    filter: url(#ecoGlow);
  }
  .conn.active .line-flow {
    opacity: 1;
    stroke-width: 2.4;
  }
`;

export const HubNode = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  width: 210px;
  height: 210px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  padding: 0 26px;
  background:
    radial-gradient(circle at 50% 35%, rgba(10, 150, 236, 0.22), transparent 60%),
    rgba(9, 15, 27, 0.86);
  border: 1px solid rgba(84, 218, 137, 0.4);
  backdrop-filter: blur(12px);
  animation: ${hubPulse} 4.5s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 1px dashed rgba(84, 218, 137, 0.28);
    pointer-events: none;
  }

  .brand {
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.4px;
    background: linear-gradient(120deg, #0a96ec, #54da89);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .sub {
    font-size: 12.5px;
    line-height: 1.35;
    color: rgba(234, 240, 251, 0.72);
    font-weight: 500;
  }
`;

export const SolutionNode = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 3;
  width: 186px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 14px;
  border-radius: 14px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.4);
  transition: transform 0.28s ease, border-color 0.28s ease, background 0.28s ease,
    box-shadow 0.28s ease;

  &:hover,
  &[data-active='true'] {
    transform: translate(-50%, -50%) scale(1.07);
    border-color: rgba(84, 218, 137, 0.6);
    background: rgba(255, 255, 255, 0.09);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.5), 0 0 30px rgba(84, 218, 137, 0.18);
  }
`;

export const NodeIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 11px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(140deg, rgba(10, 150, 236, 0.32), rgba(84, 218, 137, 0.26));
  border: 1px solid rgba(255, 255, 255, 0.16);

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const NodeIconImg = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
`;

export const NodeLabel = styled.span`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 13.5px;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: #fff;
`;

/* ── Grade de nós (mobile) ──────────────────────────────────────── */
export const MobileGrid = styled.div`
  display: none;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 36px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: 10px;
  }
`;

export const NodeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 14px;
  border-radius: 14px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: border-color 0.25s ease, background 0.25s ease;

  &[data-active='true'] {
    border-color: rgba(84, 218, 137, 0.6);
    background: rgba(255, 255, 255, 0.09);
  }
`;

/* ── Painel de detalhe da solução ativa ─────────────────────────── */
export const DetailPanel = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 22px;
  max-width: 860px;
  margin: 48px auto 0;
  padding: 30px 32px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  overflow: hidden;
  clip-path: polygon(0 0, 96% 0, 100% 14%, 100% 100%, 0 100%);
  animation: ${revealUp} 0.35s ease both;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 22px;
    padding: 1px;
    clip-path: polygon(0 0, 96% 0, 100% 14%, 100% 100%, 0 100%);
    background: linear-gradient(140deg, rgba(84, 218, 137, 0.5), transparent 46%, rgba(10, 150, 236, 0.5));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    margin-top: 32px;
    padding: 24px;
    gap: 14px;
    clip-path: none;
    &::before {
      clip-path: none;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const DetailIndex = styled.span`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 52px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -2px;
  color: transparent;
  -webkit-text-stroke: 1.6px rgba(84, 218, 137, 0.45);

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 40px;
  }
`;

export const DetailTitle = styled.h3`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.4px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 10px;
`;

export const DetailBody = styled.div`
  font-family: 'Satoshi', sans-serif;
  font-size: 15.5px;
  line-height: 1.7;
  color: rgba(234, 240, 251, 0.74);

  p {
    margin: 0 0 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  ol,
  ul {
    margin: 0 0 10px 22px;
    padding-left: 18px;
    list-style-type: disc;
  }

  strong {
    color: #fff;
    font-weight: 600;
  }

  a {
    color: #54da89;
    text-decoration: underline;
  }
`;
