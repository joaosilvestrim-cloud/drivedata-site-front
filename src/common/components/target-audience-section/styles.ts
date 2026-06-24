import styled from '@emotion/styled';
import { theme } from '../../theme';

export const TargetAudienceContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  isolation: isolate; /* ensure pseudo-elements stay behind content */

  /* Section overlay to match Figma glow */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        120% 60% at 50% -20%,
        rgba(84, 218, 137, 0.08) 0%,
        rgba(84, 218, 137, 0) 60%
      ),
      radial-gradient(
        120% 60% at 50% 120%,
        rgba(10, 150, 236, 0.06) 0%,
        rgba(10, 150, 236, 0) 60%
      ),
      linear-gradient(180deg, rgba(4, 6, 16, 0) 0%, rgba(4, 6, 16, 0.45) 100%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} 0;
  }
`;

export const TargetAudienceContent = styled.div`
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

export const TargetAudienceTitle = styled.h2`
  font-size: 40px;
  line-height: 130%;
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;
  color: white;
  max-width: 528px;
  margin: 0 auto ${theme.spacing['4xl']};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
    margin-bottom: ${theme.spacing['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
    margin-bottom: ${theme.spacing['2xl']};
  }
`;

// export const SectionDivider = styled.hr`
//   width: 100%;
//   max-width: 90%;
//   height: 0;
//   margin: ${theme.spacing.md} auto;
//   border: none;
//   border-top: 1.5px solid rgba(255, 255, 255, 0.2);
// `;

export const HighlightedWord = styled.span`
  background: linear-gradient(180deg, #8afff5 0%, #009fff 60%, #8afff5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${theme.typography.fontWeight.semibold};
`;

export const HighlightedWordBlue = styled.span`
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
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${theme.typography.fontWeight.semibold};
`;

export const ColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
  }
`;

export const Column = styled.ul<{ isPositive: boolean }>`
  display: grid;
  grid-auto-rows: 1fr;
  background: linear-gradient(180deg, #0A0C15 0%, #1A1D2E 100%);
  border-radius: 29px;
  padding: ${theme.spacing['2xl']};
  border: ${(props) => `1px solid ${props.isPositive ? '#48E2CF' : '#FF6B6B'}`};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: visible;
  list-style: none;
  padding: 0;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    border-radius: 20px;
  }

  /* Decorative top capsule, matching layout */
  &::before {
    content: '';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 340px;
    max-width: calc(100% - 32px);
    height: 24px;
    border-radius: 8px 8px 0 0;
    background: ${(props) =>
      props.isPositive
        ? 'linear-gradient(360deg, #2B755400 0%, #54DA89 100%)'
        : 'linear-gradient(360deg, #2B755400 0%, #EE0D4C 100%)'};
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.35),
      inset 0 -2px 8px rgba(255, 255, 255, 0.15);
    pointer-events: none;

    @media (max-width: ${theme.breakpoints.md}) {
      width: 280px;
    }

    @media (max-width: ${theme.breakpoints.sm}) {
      width: 240px;
      height: 20px;
    }
  }
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  position: relative;
  padding: ${theme.spacing.sm} ${theme.spacing['2xl']};
  flex: 1 1 0;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  will-change: opacity, transform;

  &[data-visible='true'] {
    opacity: 1;
    transform: translateY(0);
  }

  &[data-placeholder='true'] {
    opacity: 0;
    pointer-events: none;
  }

  &:nth-of-type(1) {
    transition-delay: 0ms;
  }

  &:nth-of-type(2) {
    transition-delay: 120ms;
  }

  &:nth-of-type(3) {
    transition-delay: 200ms;
  }

  &:nth-of-type(4) {
    transition-delay: 280ms;
  }

  &:nth-of-type(5) {
    transition-delay: 360ms;
  }

  &:nth-of-type(6) {
    transition-delay: 440ms;
  }

  &:nth-of-type(7) {
    transition-delay: 520ms;
  }

  &:nth-of-type(8) {
    transition-delay: 600ms;
  }

  &[data-placeholder='true']::after {
    display: none;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 90%;
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
  }

  &:last-child::after {
    display: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    gap: ${theme.spacing.sm};
  }
`;

export const ColumnContentTitle = styled.div`
  max-width: 340px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 100%;
    padding: ${theme.spacing.md} ${theme.spacing.sm};
  }
`;

export const ColumnTitle = styled.h3<{ isPositive: boolean }>`
  font-size: 40px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: white;
  text-align: center;
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 32px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 22px;
  }
`;

export const HighlightedBrand = styled.span<{ isPositive: boolean }>`
  color: ${(props) => (props.isPositive ? '#4FD89C' : '#EE0D4C')};
  font-weight: ${theme.typography.fontWeight.bold};
`;


export const Circle = styled.div`
  position: relative;
  width: 46.88px;
  height: 46.88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background:
    /* soft specular highlight top-left */
    radial-gradient(
      60% 60% at 20% 15%,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.28) 28%,
      rgba(255, 255, 255, 0.12) 48%,
      rgba(255, 255, 255, 0.0) 70%
    ),
    /* subtle dark falloff bottom-right */
    radial-gradient(
      80% 80% at 85% 85%,
      rgba(0, 0, 0, 0.25) 0%,
      rgba(0, 0, 0, 0.18) 40%,
      rgba(0, 0, 0, 0.0) 75%
    ),
    /* vertical light-to-dark gloss */
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.14) 0%,
      rgba(255, 255, 255, 0.04) 24%,
      rgba(4, 6, 16, 0.18) 70%,
      rgba(4, 6, 16, 0.32) 100%
    );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 -8px 16px rgba(0, 0, 0, 0.35),
    inset 0 1px 2px rgba(255, 255, 255, 0.25),
    0 2px 10px rgba(0, 0, 0, 0.35);
  pointer-events: none;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
  }
`;

export const ItemIcon = styled.span<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${(props) => (props.isPositive ? '#4FD89C' : '#EE0D4C')};
  font-size: 30px;
  font-weight: bold;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

export const ItemContent = styled.div`
  flex: 1;
  padding: ${theme.spacing.md};
  min-width: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
  }
`;

export const ItemTitle = styled.h4<{ isPositive: boolean }>`
  font-size: 18px;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: white;
  margin-bottom: ${theme.spacing.sm};
  line-height: 1.4;
  color: ${(props) => (props.isPositive ? '#4FD89C' : '#EE0D4C')};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const ItemDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;

  p {
    margin-bottom: 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;
