import styled from '@emotion/styled';
import { theme } from '../../theme';

export const ProcessSectionContainer = styled.section`
  width: 100%;
  padding: 120px 0;
  position: relative;
  overflow: hidden;

  /* glow focal da seção sobre o campo navy global */
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    width: 760px;
    height: 760px;
    left: 50%;
    top: -260px;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(10, 150, 236, 0.14), transparent 62%);
    filter: blur(20px);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 84px 0;
  }
`;

export const ProcessSectionContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xl};
  }
`;

export const ProcessHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  text-align: center;
  max-width: 820px;
`;

export const ProcessTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.12;
  letter-spacing: -0.8px;
  font-weight: 800;
  color: #fff;
  margin: 0;

  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 26px;
  }
`;

export const ProcessSubtitle = styled.p`
  font-size: 16.5px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.66);
  margin: 0;
  max-width: 640px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 15px;
  }
`;

export const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 1120px;
  margin-top: 28px;
  padding: 0 24px;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 520px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: 26px;
    padding: 0 16px;
  }
`;

export const ProcessCard = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 44px 26px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  height: 100%;
  clip-path: polygon(0 0, 86% 0, 100% 16%, 100% 100%, 0 100%);
  transition: background 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    clip-path: polygon(0 0, 86% 0, 100% 16%, 100% 100%, 0 100%);
    background: linear-gradient(150deg, rgba(10, 150, 236, 0.45), transparent 46%, rgba(84, 218, 137, 0.4));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    clip-path: none;
    &::before {
      clip-path: none;
    }
  }
`;

export const ProcessCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }

  &:hover ${ProcessCard} {
    background: rgba(255, 255, 255, 0.07);
  }
`;

export const StepNumber = styled.div`
  position: absolute;
  top: 14px;
  right: 22px;
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 74px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -2px;
  margin: 0;
  z-index: 3;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(84, 218, 137, 0.45);
  pointer-events: none;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 60px;
    top: 10px;
  }
`;

export const StepTitle = styled.h3`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 700;
  margin: 0;
  color: #fff;
  position: relative;
  z-index: 4;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 17px;
  }
`;

export const StepDescription = styled.p`
  font-size: 14.5px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.66);
  margin: 0;
  position: relative;
  z-index: 4;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;
