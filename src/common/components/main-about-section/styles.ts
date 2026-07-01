import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const MainContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 130px 0 96px;
  /* foto de código fundida no campo navy */
  background-image:
    linear-gradient(
      180deg,
      rgba(7, 12, 22, 0.68) 0%,
      rgba(7, 12, 22, 0.86) 56%,
      #070c16 100%
    ),
    url('/main-about-new.jpg');
  background-size: cover;
  background-position: 70% 18%;
  background-color: #070c16;

  /* glows focais */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      radial-gradient(680px 480px at 12% 8%, rgba(10, 150, 236, 0.22), transparent 60%),
      radial-gradient(620px 460px at 88% 20%, rgba(84, 218, 137, 0.16), transparent 62%);
  }

  /* grade técnica sutil, com fade */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.5;
    background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 58px 58px;
    mask-image: radial-gradient(ellipse 90% 60% at 50% 30%, #000 20%, transparent 88%);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 78vh;
    padding: 116px 0 72px;
  }
`;

export const MainContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 900px;
  padding: 0 24px;
  text-align: center;
  color: white;

  > * {
    animation: ${fadeUp} 0.6s ease both;
  }
  > *:nth-of-type(2) {
    animation-delay: 0.06s;
  }
  > *:nth-of-type(3) {
    animation-delay: 0.12s;
  }
  > *:nth-of-type(4) {
    animation-delay: 0.18s;
  }
  > *:nth-of-type(5) {
    animation-delay: 0.24s;
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
  margin-bottom: 24px;
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
  font-size: clamp(36px, 4.6vw, 60px);
  line-height: 1.08;
  letter-spacing: -1.6px;
  font-weight: 800;
  margin: 0 auto ${theme.spacing.lg};
  max-width: 820px;
  color: #fff;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 32px;
    letter-spacing: -0.8px;
    max-width: 100%;
  }
`;

export const HighlightedText = styled.span`
  font-weight: 800;
  background: linear-gradient(120deg, #54da89 0%, #0a96ec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const MainDescription = styled.p`
  font-size: 19px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.74);
  margin: 0 auto;
  text-align: center;
  max-width: 640px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const MainActions = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${theme.spacing['2xl']};

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

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const TechRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 34px;
`;

export const TechPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(234, 240, 251, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 7px 14px;
  border-radius: 999px;
  backdrop-filter: blur(6px);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(120deg, #0a96ec, #54da89);
  }
`;
