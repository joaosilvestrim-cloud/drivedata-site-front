import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const fadeUpSoft = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 32px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const fadeInPop = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 30px, 0) scale(0.8) rotateY(-15deg);
  }
  50% {
    opacity: 1;
    transform: translate3d(0, -5px, 0) scale(1.05) rotateY(0deg);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1) rotateY(0deg);
  }
`;


export const PartnersSectionContainer = styled.section`
  width: 100%;
  position: relative;
  padding: ${theme.spacing['4xl']} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} 0;
  }
`;

export const PartnersSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing['4xl']};
  opacity: 0;
  animation: ${fadeUpSoft} 4s ease forwards;
  animation-play-state: paused;
  will-change: opacity, transform;

  &[data-animate='true'] {
    animation-play-state: running;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing['2xl']};
  }
`;

export const PartnersHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition:
    opacity 0.6s ease 0.1s,
    transform 0.6s ease 0.1s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const PartnersTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.15;
  letter-spacing: -0.8px;
  font-weight: 800;
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  opacity: 0;
  transform: translate3d(0, 16px, 0);
  transition:
    opacity 0.6s ease 0.2s,
    transform 0.6s ease 0.2s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const PartnersSubtitle = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.66);
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  transition:
    opacity 0.6s ease 0.3s,
    transform 0.6s ease 0.3s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${theme.spacing.xl} ${theme.spacing.lg};
  max-width: 1600px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  justify-items: center;
  align-items: center;
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  transition:
    opacity 0.7s ease 0.4s,
    transform 0.7s ease 0.4s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: ${theme.spacing.lg} ${theme.spacing.md};
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: ${theme.spacing.md} ${theme.spacing.sm};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.md} ${theme.spacing.sm};
  }
`;

// Não precisamos mais de delays escalonados, cada logo aparece quando entra na viewport

export const PartnerLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
  min-height: 100px;
  width: 100%;
  cursor: pointer;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
  opacity: 0;
  transform: translate3d(0, 30px, 0) scale(0.8) rotateY(-15deg);
  will-change: opacity, transform;
  transition: box-shadow 0.3s ease;

  /* Quando visível, aplica a animação */
  &[data-animate='true'] {
    animation: ${fadeInPop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  img {
    max-width: 100%;
    max-height: 74px;
    width: auto;
    height: auto;
    object-fit: contain !important;
    filter: none;
    opacity: 1;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-8px) scale(1.06) rotateY(0deg) !important;
    box-shadow: 0 16px 40px rgba(10, 150, 236, 0.28);

    img {
      transform: scale(1.08);
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.05) rotateY(0deg) !important;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 80px;
    padding: ${theme.spacing.sm};
    
    img {
      max-height: 60px;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 60px;
    padding: ${theme.spacing.xs};
    
    img {
      max-height: 45px;
    }
  }
`;

export const ResultsSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${theme.spacing.lg};
  padding: 0 ${theme.spacing.lg};
  opacity: 0;
  transform: translate3d(0, 32px, 0);
  transition:
    opacity 0.7s ease 0.5s,
    transform 0.7s ease 0.5s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    align-items: center;
    padding: 0 ${theme.spacing.md};
  }
`;

export const ResultsImageWrapper = styled.div`
  position: relative;
  opacity: 0;
  transform: translate3d(-24px, 0, 0);
  transition:
    opacity 0.7s ease 0.6s,
    transform 0.7s ease 0.6s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.sm};
    
    img {
      max-width: 100%;
      width: 100%;
      height: auto;
    }
  }
`;

export const ResultsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  opacity: 0;
  transform: translate3d(24px, 0, 0);
  transition:
    opacity 0.7s ease 0.7s,
    transform 0.7s ease 0.7s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    align-items: center;
    text-align: center;
  }
`;

export const ResultsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 36px;
  line-height: 1.15;
  letter-spacing: -0.6px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  max-width: 500px;
  opacity: 0;
  transform: translate3d(0, 16px, 0);
  transition:
    opacity 0.6s ease 0.8s,
    transform 0.6s ease 0.8s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 32px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
    max-width: 100%;
  }
`;

export const ResultsTitleBlue = styled.span`
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const ResultsDescription = styled.p`
  font-size: 20px;
  line-height: 150%;
  color: rgba(234, 240, 251, 0.7);
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  font-family: 'Satoshi', sans-serif;
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  transition:
    opacity 0.6s ease 0.9s,
    transform 0.6s ease 0.9s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 18px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const ResultsButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  position: absolute;
  bottom: -20px;
  right: -400px;
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition:
    opacity 0.6s ease 1s,
    transform 0.6s ease 1s;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.xl}) {
    right: -200px;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    position: static;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: ${theme.spacing.xl};
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.lg};
  }
`;

export const ResultButton = styled.div`
  background: #0A96EC;
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: 140px;
  font-size: 20px;
  font-weight: ${theme.typography.fontWeight.normal};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  opacity: 0;
  transform: translate3d(0, 16px, 0) scale(0.95);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease,
    background 0.3s ease;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  &[data-animate='true'][data-order='0'] {
    transition-delay: 1.1s;
  }

  &[data-animate='true'][data-order='1'] {
    transition-delay: 1.2s;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    font-size: 18px;
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    white-space: normal;
    width: 100%;
  }
`;

