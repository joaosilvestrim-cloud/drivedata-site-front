import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const backgroundParallax = keyframes`
  0% {
    transform: scale(1.02) translate3d(0, 0, 0);
    filter: saturate(105%);
  }

  45% {
    transform: scale(1.06) translate3d(-1.6%, 1.4%, 0);
    filter: saturate(112%);
  }

  75% {
    transform: scale(1.04) translate3d(1.2%, -1.2%, 0);
    filter: saturate(108%);
  }

  100% {
    transform: scale(1.02) translate3d(0, 0, 0);
    filter: saturate(105%);
  }
`;

const lightSweep = keyframes`
  0% {
    background-position: 0% 50%;
    opacity: 0.25;
  }

  45% {
    background-position: 100% 50%;
    opacity: 0.4;
  }

  100% {
    background-position: 0% 50%;
    opacity: 0.25;
  }
`;

const riseAndFade = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 48px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const highlightPulse = keyframes`
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
`;

export const ChaosSectionContainer = styled.section`
  width: 100%;
  min-height: 600px;
  padding: ${theme.spacing['4xl']} 0;
  background-color: #000000;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background-image: url('/touching-future-data-analysis-technology-interface.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.8;
    transform-origin: center;
    will-change: transform, filter;
    animation: ${backgroundParallax} 28s ease-in-out infinite;
    animation-play-state: paused;
    z-index: 0;

    @media (max-width: ${theme.breakpoints.lg}) {
      width: 100%;
      opacity: 0.35;
    }
  }

  &[data-visible='true']::before {
    animation-play-state: running;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 55%;
    max-width: 660px;
    background: linear-gradient(
        95deg,
        rgba(3, 10, 30, 0.4) 0%,
        rgba(0, 0, 0, 0.75) 58%,
        rgba(0, 0, 0, 0.95) 100%
      ),
      linear-gradient(120deg, rgba(0, 159, 255, 0.18), transparent 65%);
    background-size: 220% 100%;
    opacity: 0.22;
    mix-blend-mode: screen;
    animation: ${lightSweep} 18s ease-in-out infinite;
    animation-play-state: paused;
    z-index: 1;

    @media (max-width: ${theme.breakpoints.lg}) {
      width: 100%;
      max-width: none;
      background: linear-gradient(
        180deg,
        rgba(3, 10, 30, 0.35) 0%,
        rgba(0, 0, 0, 0.92) 80%
      );
      background-size: 200% 200%;
    }
  }

  &[data-visible='true']::after {
    animation-play-state: running;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 500px;
    padding: ${theme.spacing['3xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 400px;
    padding: ${theme.spacing['2xl']} 0;
  }
`;

export const ChaosSectionContent = styled.div`
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  min-height: 600px;
  opacity: 0;
  transform: translate3d(0, 56px, 0);
  animation: ${riseAndFade} 0.9s ease forwards;
  animation-play-state: paused;
  will-change: opacity, transform;

  &[data-visible='true'] {
    animation-play-state: running;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 500px;
    padding: 0 ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 400px;
  }
`;

export const ChaosGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: center;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    inset: -12% 48% auto -20%;
    height: 140%;
    background: radial-gradient(
      circle at left center,
      rgba(138, 255, 245, 0.15) 0%,
      rgba(138, 255, 245, 0) 60%
    );
    opacity: 0;
    transition: opacity 1s ease;
    pointer-events: none;
  }

  &[data-visible='true']::before {
    opacity: 1;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};

    &::before {
      inset: auto;
      top: -20%;
      left: -15%;
      right: -15%;
      bottom: 50%;
      height: auto;
    }
  }
`;

export const ChaosTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};

  & > * {
    opacity: 0;
    transform: translate3d(0, 28px, 0);
    transition:
      opacity 0.7s ease,
      transform 0.7s ease;
    will-change: opacity, transform;
  }

  &[data-visible='true'] > * {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &[data-visible='true'] > *:nth-of-type(1) {
    transition-delay: 140ms;
  }

  &[data-visible='true'] > *:nth-of-type(2) {
    transition-delay: 280ms;
  }

  &[data-visible='true'] > p {
    color: #eef2ff;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.lg};
  }
`;

export const ChaosTitle = styled.h2`
  font-size: 40px;
  line-height: 1.3;
  font-weight: ${theme.typography.fontWeight.medium};
  color: white;
  margin: 0;
  max-width: 470px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
    max-width: 100%;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const HighlightedText = styled.span`
  background: linear-gradient(180deg, #8afff5 0%, #009fff 60%, #8afff5 100%);
  background-size: 220% 220%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${theme.typography.fontWeight.medium};
  animation: ${highlightPulse} 7s ease-in-out infinite;
`;

export const ChaosDescription = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: #cfd6ff;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  transition: color 0.6s ease;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 18px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;


