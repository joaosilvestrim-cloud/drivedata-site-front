import styled from '@emotion/styled';
import { theme } from '../../theme';

// ── Lista estilo FAQ (numeração 01/02, chevron em chip, barra lateral) ──
export const SolList = styled.div`
  counter-reset: sol;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 860px;
  margin: 40px auto 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-top: 28px;
  }
`;

export const SolItem = styled.div<{ isOpen: boolean }>`
  counter-increment: sol;
  position: relative;
  background: rgb(var(--dd-ink-rgb) / 0.045);
  backdrop-filter: blur(14px);
  border: 1px solid rgb(var(--dd-ink-rgb) / 0.1);
  border-radius: 16px;
  padding: 22px 22px 22px 68px;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;
  overflow: hidden;

  &::before {
    content: counter(sol, decimal-leading-zero);
    position: absolute;
    left: 22px;
    top: 20px;
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: transparent;
    -webkit-text-stroke: 1.2px rgba(84, 218, 137, 0.5);
    transition: all 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #0a96ec, #54da89);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${(props) =>
    props.isOpen &&
    `
    background: rgb(var(--dd-ink-rgb) / 0.07);
    border-color: rgba(84, 218, 137, 0.45);
    &::before {
      -webkit-text-stroke: 0;
      background: linear-gradient(120deg, var(--dd-grad-blue), var(--dd-grad-green));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    &::after { opacity: 1; }
  `}

  &:hover {
    border-color: rgba(84, 218, 137, 0.4);
    background: rgb(var(--dd-ink-rgb) / 0.07);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 18px 16px 18px 58px;
    border-radius: 12px;
    &::before {
      left: 16px;
      top: 17px;
      font-size: 17px;
    }
  }
`;

export const SolHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
`;

export const SolIcon = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(140deg, rgba(10, 150, 236, 0.18), rgba(84, 218, 137, 0.14));
  border: 1px solid rgb(var(--dd-ink-rgb) / 0.12);

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(78%) sepia(38%) saturate(560%) hue-rotate(90deg);
  }
`;

export const SolTitle = styled.strong<{ isOpen?: boolean }>`
  flex: 1;
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 17px;
  line-height: 1.45;
  letter-spacing: -0.2px;
  color: var(--dd-text);
  font-weight: ${(props) => (props.isOpen ? 700 : 600)};
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14.5px;
  }
`;

export const SolChevron = styled.div<{ isOpen: boolean }>`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(var(--dd-ink-rgb) / 0.16);
  background: ${(props) =>
    props.isOpen ? 'linear-gradient(135deg, #0a96ec, #54da89)' : 'rgb(var(--dd-ink-rgb) / 0.05)'};
  color: ${(props) => (props.isOpen ? 'var(--dd-bg-section)' : '#54da89')};
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const SolAnswer = styled.div`
  font-size: 15.5px;
  line-height: 1.65;
  color: rgb(var(--dd-fog-rgb) / 0.72);
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgb(var(--dd-ink-rgb) / 0.08);

  p {
    margin: 0 0 10px;
  }
  p:last-child {
    margin-bottom: 0;
  }
  ul,
  ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  a {
    color: var(--dd-primary);
  }
`;

export const SolutionsSectionContainer = styled.section`
  width: 100%;
  padding: 120px 0 100px;
  background: transparent;
  position: relative;
  overflow: hidden;
  scroll-margin-top: 96px;

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    width: 820px;
    height: 820px;
    left: 50%;
    top: 40px;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(10, 150, 236, 0.12), transparent 60%);
    filter: blur(20px);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 84px 0 72px;
  }
`;

export const SolutionsSectionContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
`;

export const SolutionsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -1px;
  font-size: clamp(30px, 3.4vw, 48px);
  line-height: 1.1;
  font-weight: 800;
  background: linear-gradient(120deg, var(--dd-grad-blue), var(--dd-grad-green));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const SolutionsDescription = styled.p`
  font-family: 'Satoshi', sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: rgb(var(--dd-fog-rgb) / 0.7);
  margin: 0 auto;
  max-width: 640px;
  font-weight: ${theme.typography.fontWeight.normal};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;
