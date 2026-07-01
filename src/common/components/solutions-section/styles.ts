import styled from '@emotion/styled';
import { theme } from '../../theme';

export const SolutionsSectionContainer = styled.section`
  width: 100%;
  padding: 110px 0;
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 80px 0;
  }
`;

export const SolutionsSectionContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

export const SolutionsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.12;
  letter-spacing: -0.8px;
  font-weight: 800;
  color: #fff;
  max-width: 680px;
  margin: 0 auto 14px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 26px;
  }
`;

export const HighlightedText = styled.span`
  background: linear-gradient(120deg, #0a96ec, #54da89);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
`;

export const SolutionsDescription = styled.p`
  color: rgba(234, 240, 251, 0.66);
  font-size: 16.5px;
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto 52px;
`;

export const SolutionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  max-width: 1120px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const SolutionCard = styled.div`
  position: relative;
  text-align: left;
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 26px 24px 28px;
  clip-path: polygon(0 0, 88% 0, 100% 14%, 100% 100%, 0 100%);
  overflow: hidden;
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 0.6s ease, transform 0.6s ease, background 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    clip-path: polygon(0 0, 88% 0, 100% 14%, 100% 100%, 0 100%);
    background: linear-gradient(150deg, rgba(84, 218, 137, 0.4), transparent 45%, rgba(10, 150, 236, 0.35));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -30%;
    width: 70%;
    height: 70%;
    background: radial-gradient(circle, rgba(84, 218, 137, 0.18), transparent 70%);
    filter: blur(20px);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &[data-animate='true'] {
    opacity: 1;
    transform: translateY(0);
  }
  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.07);
  }
  &:hover::after {
    opacity: 1;
  }
  &:nth-of-type(2) {
    transition-delay: 90ms;
  }
  &:nth-of-type(3) {
    transition-delay: 170ms;
  }
  &:nth-of-type(4) {
    transition-delay: 250ms;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    clip-path: none;
    &::before {
      clip-path: none;
    }
  }
`;

export const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: linear-gradient(140deg, rgba(10, 150, 236, 0.18), rgba(84, 218, 137, 0.14));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 24px rgba(10, 150, 236, 0.18);

  img {
    filter: brightness(0) saturate(100%) invert(78%) sepia(38%) saturate(560%) hue-rotate(90deg);
  }
`;

export const CardTitle = styled.h3`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 17.5px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 9px;
  line-height: 1.25;
`;

export const CardDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.66);
  margin: 0;
`;

export const CTAButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;

  &[data-animate='true'] {
    opacity: 1;
    transform: translateY(0);
  }
`;
