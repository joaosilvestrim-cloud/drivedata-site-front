import styled from '@emotion/styled';
import { theme } from '../../theme';

export const CtaSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  position: relative;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} 0;
  }
`;

export const CtaSectionContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  text-align: center;
  padding: 68px 40px;
  border-radius: 28px;
  overflow: hidden;
  background:
    radial-gradient(700px 300px at 50% -10%, rgba(84, 218, 137, 0.16), transparent 70%),
    radial-gradient(700px 300px at 50% 120%, rgba(10, 150, 236, 0.16), transparent 70%),
    rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(16px);
  clip-path: polygon(0 0, 90% 0, 100% 12%, 100% 100%, 10% 100%, 0 88%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
    padding: 1px;
    clip-path: polygon(0 0, 90% 0, 100% 12%, 100% 100%, 10% 100%, 0 88%);
    background: linear-gradient(135deg, rgba(84, 218, 137, 0.5), transparent 45%, rgba(10, 150, 236, 0.5));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
    padding: 44px 22px;
    clip-path: none;
    &::before {
      clip-path: none;
    }
  }
`;

export const CtaTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  background: linear-gradient(120deg, #54da89 0%, #0a96ec 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.15;
  letter-spacing: -0.8px;
  font-weight: 800;
  margin: 0;
  max-width: 800px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 32px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const CtaDescription = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: #B0B0B0;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  max-width: 700px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 18px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const CtaButtonWrapper = styled.div`
  margin-top: ${theme.spacing.lg};
  display: flex;
  justify-content: center;
`;

