import styled from '@emotion/styled';
import { theme } from '../../theme';

export const TargetAudienceContainer = styled.section`
  width: 100%;
  padding: 110px 0;
  position: relative;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 80px 0;
  }
`;

export const TargetAudienceContent = styled.div`
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

export const TargetAudienceTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.12;
  letter-spacing: -0.8px;
  font-weight: 800;
  text-align: center;
  color: #fff;
  max-width: 620px;
  margin: 0 auto 56px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 26px;
    margin-bottom: 36px;
  }
`;

export const HighlightedWord = styled.span`
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

export const HighlightedWordBlue = styled.span`
  background: linear-gradient(120deg, #22d3ee, #0a96ec);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

export const ColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const Column = styled.ul<{ isPositive: boolean }>`
  position: relative;
  list-style: none;
  margin: 0;
  padding: 34px 30px;
  display: grid;
  grid-auto-rows: max-content;
  gap: 4px;
  background: ${(props) =>
    props.isPositive
      ? 'linear-gradient(180deg, rgba(84,218,137,0.07), rgba(255,255,255,0.03))'
      : 'linear-gradient(180deg, rgba(238,13,76,0.06), rgba(255,255,255,0.03))'};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  clip-path: ${(props) =>
    props.isPositive
      ? 'polygon(0 0, 90% 0, 100% 9%, 100% 100%, 0 100%)'
      : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 9%)'};

  /* borda em gradiente acompanhando o corte */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    clip-path: ${(props) =>
      props.isPositive
        ? 'polygon(0 0, 90% 0, 100% 9%, 100% 100%, 0 100%)'
        : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 9%)'};
    background: ${(props) =>
      props.isPositive
        ? 'linear-gradient(150deg, rgba(84,218,137,0.7), transparent 55%)'
        : 'linear-gradient(210deg, rgba(238,13,76,0.6), transparent 55%)'};
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* glow tingido no topo */
  &::after {
    content: '';
    position: absolute;
    top: -40%;
    ${(props) => (props.isPositive ? 'left: -10%;' : 'right: -10%;')}
    width: 60%;
    height: 60%;
    background: radial-gradient(
      circle,
      ${(props) => (props.isPositive ? 'rgba(84,218,137,0.16)' : 'rgba(238,13,76,0.14)')},
      transparent 70%
    );
    filter: blur(20px);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 26px 22px;
    clip-path: none;
    border-radius: 20px;
  }
`;

export const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  padding: 18px 8px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  will-change: opacity, transform;
  border-radius: 14px;

  &[data-visible='true'] {
    opacity: 1;
    transform: translateY(0);
  }
  &[data-placeholder='true'] {
    opacity: 0;
    pointer-events: none;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:nth-of-type(2) {
    transition-delay: 100ms;
  }
  &:nth-of-type(3) {
    transition-delay: 180ms;
  }
  &:nth-of-type(4) {
    transition-delay: 260ms;
  }
  &:nth-of-type(5) {
    transition-delay: 340ms;
  }
  &:nth-of-type(6) {
    transition-delay: 420ms;
  }

  /* divisória entre itens */
  &::after {
    content: '';
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
  }
  &:last-child::after,
  &[data-placeholder='true']::after {
    display: none;
  }
`;

export const ColumnContentTitle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px 18px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
`;

export const ColumnTitle = styled.h3<{ isPositive: boolean }>`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  text-align: left;
  line-height: 1.25;
  letter-spacing: -0.4px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 19px;
  }
`;

export const HighlightedBrand = styled.span<{ isPositive: boolean }>`
  color: ${(props) => (props.isPositive ? '#54da89' : '#ff5c7a')};
  font-weight: 800;
`;

export const Circle = styled.div`
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const ItemIcon = styled.span<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isPositive ? '#54da89' : '#ff5c7a')};
  font-size: 18px;
  font-weight: 800;
`;

export const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 2px;
`;

export const ItemTitle = styled.h4<{ isPositive: boolean }>`
  font-size: 15.5px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.35;
  color: ${(props) => (props.isPositive ? '#7ff0b3' : '#ff8199')};
`;

export const ItemDescription = styled.p`
  font-size: 14.5px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.7);
  margin: 0;

  p {
    margin-bottom: 0;
  }
`;
