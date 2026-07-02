import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const flow = keyframes`
  to { stroke-dashoffset: -240; }
`;

export const IntegrationsSectionContainer = styled.section`
  width: 100%;
  background: transparent;
  padding: ${theme.spacing['4xl']} 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(10, 150, 236, 0.15) 0%, transparent 70%);
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

// ── Palco radial animado (núcleo DriveData + plataformas + conectores) ──
export const IntegrationsStage = styled.div`
  position: relative;
  width: 100%;
  max-width: 980px;
  margin: 8px auto 0;
  aspect-ratio: 1040 / 640;

  @media (max-width: ${theme.breakpoints.sm}) {
    aspect-ratio: 1 / 1.15;
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
    stroke: rgba(255, 255, 255, 0.09);
    stroke-width: 1.4;
    fill: none;
  }
  .line-flow {
    stroke: url(#intLine);
    stroke-width: 1.8;
    fill: none;
    stroke-dasharray: 5 14;
    animation: ${flow} 3.6s linear infinite;
    opacity: 0.9;
  }
  .packet {
    fill: #54da89;
    filter: url(#intGlow);
  }
`;

export const IntHub = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 168px;
  height: 168px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  padding: 0 18px;
  background: radial-gradient(circle at 50% 35%, rgba(10, 150, 236, 0.28), rgba(7, 12, 22, 0.9));
  border: 1px solid rgba(84, 218, 137, 0.4);
  box-shadow: 0 0 0 6px rgba(10, 150, 236, 0.06), 0 20px 60px rgba(10, 150, 236, 0.25);
  z-index: 2;

  .brand {
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-weight: 800;
    font-size: 22px;
    background: linear-gradient(120deg, #0a96ec, #54da89);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .sub {
    font-size: 10.5px;
    color: rgba(234, 240, 251, 0.6);
    line-height: 1.3;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 132px;
    height: 132px;
    .brand {
      font-size: 17px;
    }
    .sub {
      font-size: 9.5px;
    }
  }
`;

export const IntNode = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 138px;
  height: 78px;
  padding: 14px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  z-index: 1;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;

  img {
    max-height: 46px;
    max-width: 104px;
    width: auto;
    height: auto;
    object-fit: contain;
    /* silhueta branca uniforme — logo claro ou escuro fica sempre visivel */
    filter: brightness(0) invert(1);
  }

  span {
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    line-height: 1.2;
  }

  &:hover {
    transform: translate(-50%, -50%) scale(1.08);
    border-color: rgba(84, 218, 137, 0.5);
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 96px;
    height: 58px;
    padding: 8px 12px;

    img {
      max-height: 30px;
      max-width: 68px;
    }
    span {
      font-size: 11px;
    }
  }
`;

