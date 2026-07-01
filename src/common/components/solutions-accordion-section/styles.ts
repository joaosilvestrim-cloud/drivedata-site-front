import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const revealDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SolutionsSectionContainer = styled.section`
  width: 100%;
  padding: 120px 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  /* glows focais sobre o campo navy */
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    width: 640px;
    height: 640px;
    right: -180px;
    top: 60px;
    background: radial-gradient(circle, rgba(84, 218, 137, 0.13), transparent 62%);
    filter: blur(20px);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    z-index: 0;
    width: 560px;
    height: 560px;
    left: -160px;
    bottom: -80px;
    background: radial-gradient(circle, rgba(10, 150, 236, 0.12), transparent 62%);
    filter: blur(20px);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 84px 0;
  }
`;

export const SolutionsSectionContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  max-width: 860px;
  margin: 0 auto;
`;

export const SolutionsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -1px;
  font-size: clamp(30px, 3.4vw, 48px);
  line-height: 1.1;
  font-weight: 800;
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const SolutionsDescription = styled.p`
  font-family: 'Satoshi', sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.7);
  margin: 0 auto;
  max-width: 640px;
  font-weight: ${theme.typography.fontWeight.normal};
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const SolutionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 40px;

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-top: 28px;
  }
`;

const CLIP = 'polygon(0 0, 97% 0, 100% 24%, 100% 100%, 0 100%)';

export const SolutionItem = styled.div<{ isOpen: boolean; isHighlighted?: boolean }>`
  position: relative;
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(14px);
  border-radius: 18px;
  padding: 20px 24px 20px 22px;
  cursor: pointer;
  overflow: hidden;
  clip-path: ${CLIP};
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  /* borda gradiente (acende no hover/aberto) */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    padding: 1px;
    clip-path: ${CLIP};
    background: linear-gradient(140deg, rgba(84, 218, 137, 0.5), transparent 46%, rgba(10, 150, 236, 0.5));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.55;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  /* barra de luz lateral (acende ao abrir) */
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
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.07);
  }
  &:hover::before {
    opacity: 1;
  }

  ${(props) =>
    props.isOpen &&
    `
    background: rgba(255, 255, 255, 0.075);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 44px rgba(84, 218, 137, 0.1);

    &::before { opacity: 1; }
    &::after { opacity: 1; }
  `}

  ${(props) =>
    props.isHighlighted &&
    `
    &::before { opacity: 1; }
  `}

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 18px;
    border-radius: 14px;
    clip-path: none;

    &::before {
      clip-path: none;
      border-radius: 14px;
    }
  }
`;

/* badge de ícone em gradiente */
export const IconWrapper = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  background: linear-gradient(140deg, rgba(10, 150, 236, 0.28), rgba(84, 218, 137, 0.22));
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 8px 20px rgba(10, 150, 236, 0.18);

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
    border-radius: 11px;
  }
`;

export const SolutionDescription = styled.div<{ isOpen?: boolean }>`
  font-size: 18px;
  line-height: 1.6;
  color: #fff;
  font-weight: ${(props) =>
    props.isOpen
      ? theme.typography.fontWeight.medium
      : theme.typography.fontWeight.normal};
  transition: opacity 0.3s ease;
  position: relative;
  z-index: 1;

  strong {
    font-weight: ${theme.typography.fontWeight.medium};
  }
`;

/* chevron dentro de um chip que preenche com gradiente ao abrir */
export const ChevronIcon = styled.div<{ isOpen: boolean }>`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: ${(props) =>
    props.isOpen
      ? 'linear-gradient(135deg, #0a96ec, #54da89)'
      : 'rgba(255, 255, 255, 0.05)'};
  color: ${(props) => (props.isOpen ? '#04121f' : '#54da89')};
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 30px;
    height: 30px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const SolutionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

export const SolutionTitleText = styled.strong`
  flex: 1;
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: #fff;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const IconImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

export const ExpandedDescription = styled(SolutionDescription)`
  font-family: 'Satoshi', sans-serif;
  font-size: 15.5px;
  line-height: 1.65;
  color: rgba(234, 240, 251, 0.72);
  margin-top: 16px;
  padding-top: 16px;
  padding-left: 62px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 1;
  animation: ${revealDown} 0.3s ease both;

  ol,
  ul {
    margin-left: 24px;
  }

  ol {
    list-style-type: disc;
    padding-left: 24px;
  }

  a {
    color: #54da89;
    text-decoration: underline;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding-left: 0;
    font-size: 14.5px;
  }
`;
