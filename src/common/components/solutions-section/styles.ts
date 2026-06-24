import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const fadeUpSoft = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 28px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const SolutionsSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  background-color: #000000;
  position: relative;
  overflow: visible;

  &[data-animate='true']::before {
    opacity: 0.85;
  }

  &[data-animate='true']::after {
    opacity: 0.45;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['4xl']} 0 ${theme.spacing['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['4xl']} 0 ${theme.spacing['2xl']};
  }

  /* Gradiente azulado no centro */
  &::before {
    content: '';
    position: absolute;
    top: -400px;
    left: 0;
    right: 0;
    bottom: -400px;
    background: radial-gradient(
      ellipse 1800px 1800px at 50% 50%,
      rgba(9, 162, 255, 0.25) 0%,
      rgba(9, 162, 255, 0.15) 40%,
      rgba(0, 0, 0, 0.8) 85%,
      transparent 100%
    );
    z-index: 2;
    pointer-events: none;
    opacity: 0.6;
    transition: opacity 0.6s ease;
  }

  /* Círculos concêntricos (elipses) - 8 anéis */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    background: repeating-radial-gradient(
      circle at center,
      transparent 0px,
      transparent 198px,
      rgba(200, 220, 255, 0.5) 198px,
      rgba(200, 220, 255, 0.5) 200px,
      transparent 200px,
      transparent 398px,
      rgba(200, 220, 255, 0.45) 398px,
      rgba(200, 220, 255, 0.45) 400px,
      transparent 400px,
      transparent 598px,
      rgba(200, 220, 255, 0.4) 598px,
      rgba(200, 220, 255, 0.4) 600px,
      transparent 600px,
      transparent 798px,
      rgba(200, 220, 255, 0.35) 798px,
      rgba(200, 220, 255, 0.35) 800px,
      transparent 800px,
      transparent 998px,
      rgba(200, 220, 255, 0.3) 998px,
      rgba(200, 220, 255, 0.3) 1000px,
      transparent 1000px,
      transparent 1198px,
      rgba(200, 220, 255, 0.25) 1198px,
      rgba(200, 220, 255, 0.25) 1200px,
      transparent 1200px,
      transparent 1398px,
      rgba(200, 220, 255, 0.2) 1398px,
      rgba(200, 220, 255, 0.2) 1400px,
      transparent 1400px,
      transparent 1598px,
      rgba(200, 220, 255, 0.15) 1598px,
      rgba(200, 220, 255, 0.15) 1600px,
      transparent 1600px
    );
    opacity: 0.3;
    mix-blend-mode: overlay;
    z-index: 2;
    pointer-events: none;
    transition: opacity 0.6s ease;
  }

  > * {
    position: relative;
    z-index: 3;
  }
`;

export const SolutionsSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xl};
  text-align: center;
  opacity: 0;
  animation: ${fadeUpSoft} 0.7s ease forwards;
  animation-play-state: paused;
  will-change: opacity, transform;

  &[data-animate='true'] {
    animation-play-state: running;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
  }
`;

export const SolutionsTitle = styled.h2`
  font-size: 40px;
  line-height: 1.3;
  font-weight: ${theme.typography.fontWeight.medium};
  color: white;
  margin: 0;
  max-width: 800px;
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  transition:
    opacity 0.5s ease 120ms,
    transform 0.5s ease 120ms,
    text-shadow 0.6s ease;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    text-shadow: 0 0 24px rgba(138, 255, 245, 0.18);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 32px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const HighlightedText = styled.span`
  background: linear-gradient(
    to bottom,
    #009fff,
    #00b0ff,
    #00c0ff,
    #00cffd,
    #00dcf7,
    #2ce3f4,
    #45eaf1,
    #5bf1ee,
    #68f5f0,
    #74f8f1,
    #7ffcf3,
    #8afff5
  );
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${theme.typography.fontWeight.medium};
  animation: ${fadeIn} 0.6s ease forwards;
  animation-play-state: paused;

  &[data-animate='true'] {
    animation-play-state: running;
    animation-delay: 180ms;
  }
`;

export const SolutionsDescription = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: #B0B0B0;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  max-width: 900px;
  opacity: 0;
  transform: translate3d(0, 16px, 0);
  transition:
    opacity 0.5s ease 180ms,
    transform 0.5s ease 180ms;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 18px;
    line-height: 1.5;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
    line-height: 1.4;
  }
`;

export const SolutionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  width: 100%;
  margin-top: ${theme.spacing.xl};
  max-width: 742px;
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition:
    opacity 0.5s ease 220ms,
    transform 0.5s ease 220ms;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
  }
`;

export const SolutionCard = styled.div`
  background: linear-gradient(
    180deg,
    #080B17 0%,
    #101423 100%
  );
  border: 1px solid rgba(92, 102, 148, 0.6);
  border-radius: 24px;
  padding: ${theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translate3d(0, 16px, 0);

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &[data-animate='true'][data-order='1'] {
    transition-delay: 90ms;
  }

  &[data-animate='true'][data-order='2'] {
    transition-delay: 180ms;
  }

  &[data-animate='true'][data-order='3'] {
    transition-delay: 270ms;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(138, 255, 245, 0.3);
    box-shadow: 0 12px 40px rgba(138, 255, 245, 0.1);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl};
    gap: ${theme.spacing.md};
    border-radius: 20px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
    gap: ${theme.spacing.sm};
    border-radius: 16px;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  opacity: 0;
  animation: ${fadeIn} 0.45s ease forwards;
  animation-play-state: paused;

  &[data-animate='true'] {
    animation-play-state: running;
    animation-delay: 180ms;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const CardTitle = styled.h3`
  font-size: 20px;
  line-height: 24px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: #8AFFF5;
  margin: 0;
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  transition:
    opacity 0.45s ease 120ms,
    transform 0.45s ease 120ms;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;

export const CardDescription = styled.p`
  font-size: 16px;
  line-height: 100%;
  color: #E6E9FA;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  opacity: 0;
  transform: translate3d(0, 16px, 0);
  transition:
    opacity 0.45s ease 160ms,
    transform 0.45s ease 160ms;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

export const CTAButtonWrapper = styled.div`
  margin-top: ${theme.spacing['2xl']};
  display: flex;
  justify-content: center;
  opacity: 0;
  animation: ${fadeUpSoft} 0.6s ease forwards;
  animation-play-state: paused;

  &[data-animate='true'] {
    animation-play-state: running;
    animation-delay: 260ms;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    margin-top: ${theme.spacing.xl};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-top: ${theme.spacing.lg};
  }
`;
