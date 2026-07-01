import styled from '@emotion/styled';
import { theme } from '../../theme';

export const FaqSectionContainer = styled.section`
  width: 100%;
  padding: 120px 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  /* glow focal sobre o campo navy */
  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    width: 700px;
    height: 700px;
    left: -160px;
    top: 40px;
    background: radial-gradient(circle, rgba(10, 150, 236, 0.12), transparent 62%);
    filter: blur(20px);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 84px 0;
  }
`;

/* Layout editorial em 2 colunas: cabeçalho (esq., fixo) + accordion (dir.) */
export const FaqSectionContent = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 56px;
  align-items: start;
  max-width: 1120px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

export const FaqHeader = styled.div`
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: left;

  /* "?" gigante como marca d'água atrás do título */
  &::before {
    content: '?';
    position: absolute;
    top: -78px;
    left: -18px;
    font-family: var(--font-sora), 'Sora', sans-serif;
    font-size: 240px;
    line-height: 1;
    font-weight: 800;
    color: transparent;
    -webkit-text-stroke: 2px rgba(84, 218, 137, 0.16);
    z-index: -1;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    position: static;
    text-align: center;
    align-items: center;

    &::before {
      display: none;
    }
  }
`;

export const FaqTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -1px;
  font-size: 44px;
  line-height: 1.08;
  font-weight: 800;
  color: #fff;
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 34px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const FaqSubtitle = styled.p`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -1px;
  font-size: 44px;
  line-height: 1.08;
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-weight: 800;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 34px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const FaqList = styled.div`
  counter-reset: faq;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-top: ${theme.spacing.md};
  }
`;

export const FaqItem = styled.div<{ isOpen: boolean }>`
  counter-increment: faq;
  position: relative;
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 22px 22px 22px 68px;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;
  overflow: hidden;

  /* numeral 01/02/03 vazado (preenche quando aberto) */
  &::before {
    content: counter(faq, decimal-leading-zero);
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
  }

  ${(props) =>
    props.isOpen &&
    `
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(84, 218, 137, 0.45);

    &::before {
      -webkit-text-stroke: 0;
      color: transparent;
      background: linear-gradient(120deg, #0a96ec, #54da89);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    &::after {
      opacity: 1;
    }
  `}

  &:hover {
    border-color: rgba(84, 218, 137, 0.4);
    background: rgba(255, 255, 255, 0.07);
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

export const FaqHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

export const FaqQuestion = styled.strong<{ isOpen?: boolean }>`
  flex: 1;
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 17px;
  line-height: 1.45;
  letter-spacing: -0.2px;
  color: #fff;
  font-weight: ${(props) =>
    props.isOpen
      ? theme.typography.fontWeight.bold
      : theme.typography.fontWeight.semibold};
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 16px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14.5px;
    line-height: 1.4;
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

export const FaqAnswer = styled.div`
  font-size: 15.5px;
  line-height: 1.65;
  color: rgba(234, 240, 251, 0.72);
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 1;
  font-weight: ${theme.typography.fontWeight.normal};

  p {
    margin: 0 0 12px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ol,
  ul {
    margin-left: 24px;
    margin-bottom: 12px;
  }

  ol {
    list-style-type: decimal;
    padding-left: 24px;
  }

  ul {
    list-style-type: disc;
    padding-left: 24px;
  }

  a {
    color: #54da89;
    text-decoration: underline;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 1.5;
    margin-top: ${theme.spacing.sm};
    padding-top: ${theme.spacing.sm};

    ol,
    ul {
      margin-left: ${theme.spacing.md};
      padding-left: ${theme.spacing.md};
    }
  }
`;
