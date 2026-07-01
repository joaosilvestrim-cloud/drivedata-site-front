import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const floaty = keyframes`
  0%, 100% { transform: translateY(-50%) translateY(0); }
  50% { transform: translateY(-50%) translateY(-14px); }
`;

export const ChaosSectionContainer = styled.section`
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 120px 0;
  background: #070c16;

  /* grid sutil */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.5;
    background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 70% 70% at 68% 50%, #000 30%, transparent 78%);
  }
  /* glow lateral */
  &::after {
    content: '';
    position: absolute;
    z-index: 0;
    width: 640px;
    height: 640px;
    right: -160px;
    top: 50%;
    transform: translateY(-50%);
    background: radial-gradient(circle, rgba(10, 150, 236, 0.26), transparent 65%);
    filter: blur(30px);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 80px 0;
  }
`;

export const ChaosSectionContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
`;

export const ChaosGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: center;

  /* tile angular da imagem (flutuante) */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 46%;
    height: 440px;
    border-radius: 26px;
    background: url('/touching-future-data-analysis-technology-interface.png') center/cover;
    clip-path: polygon(0 0, 100% 0, 100% 82%, 86% 100%, 0 100%);
    opacity: 0.55;
    box-shadow: 0 40px 90px rgba(0, 0, 0, 0.55);
    z-index: 0;
    animation: ${floaty} 9s ease-in-out infinite;
  }
  /* véu sobre a imagem */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 46%;
    height: 440px;
    border-radius: 26px;
    clip-path: polygon(0 0, 100% 0, 100% 82%, 86% 100%, 0 100%);
    background: linear-gradient(120deg, rgba(7, 12, 22, 0.15), rgba(7, 12, 22, 0.8));
    z-index: 1;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};

    &::before,
    &::after {
      position: relative;
      width: 100%;
      height: 200px;
      top: 0;
      transform: none;
      animation: none;
    }
    &::after {
      margin-top: -200px;
    }
  }
`;

export const ChaosTextContent = styled.div`
  position: relative;
  grid-column: 2;
  z-index: 3;
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  padding: 42px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 6% 100%, 0 90%);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;

  &[data-visible='true'] {
    opacity: 1;
    transform: none;
  }

  /* borda em gradiente acompanhando o corte */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 6% 100%, 0 90%);
    background: linear-gradient(
      140deg,
      rgba(84, 218, 137, 0.55),
      transparent 45%,
      transparent 60%,
      rgba(10, 150, 236, 0.55)
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  /* numeral índice decorativo */
  &::after {
    content: '01';
    position: absolute;
    top: -30px;
    right: 22px;
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-weight: 800;
    font-size: 120px;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(84, 218, 137, 0.22);
    z-index: -1;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-column: 1;
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 28px;
  }
`;

export const ChaosTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(30px, 3.4vw, 44px);
  line-height: 1.12;
  letter-spacing: -1px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 18px;
  max-width: 520px;

  /* barrinha de destaque (sem texto novo) */
  &::before {
    content: '';
    display: block;
    width: 46px;
    height: 4px;
    border-radius: 2px;
    margin-bottom: 22px;
    background: linear-gradient(90deg, #0a96ec, #54da89);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const ChaosDescription = styled.p`
  color: rgba(234, 240, 251, 0.72);
  font-size: 17px;
  line-height: 1.65;
  margin: 0;
  max-width: 480px;
`;

export const HighlightedText = styled.span`
  font-weight: 800;
  background: linear-gradient(120deg, #0a96ec, #54da89);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;
