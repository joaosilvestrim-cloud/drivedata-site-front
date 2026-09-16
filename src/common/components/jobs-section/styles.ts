import styled from '@emotion/styled';
import Link from 'next/link';
import { theme } from '../../theme';

export const Section = styled.section`
  position: relative;
  padding: 150px 24px 96px;
  color: var(--dd-text);

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 118px 20px 72px;
  }
`;

export const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
`;

export const Kicker = styled.p`
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--dd-primary);
`;

export const Title = styled.h1`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: clamp(34px, 4.2vw, 54px);
  line-height: 1.06;
  letter-spacing: -1.4px;
  font-weight: 800;
  margin: 0;
  max-width: 720px;
`;

export const Highlight = styled.span`
  background: linear-gradient(120deg, var(--dd-grad-blue), var(--dd-grad-green));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Intro = styled.p`
  margin: 20px 0 0;
  max-width: 600px;
  font-size: 17px;
  line-height: 1.65;
  color: var(--dd-text-2);
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin: 44px 0 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--dd-border);
`;

export const Count = styled.span`
  font-size: 14px;
  color: var(--dd-text-2);
  font-variant-numeric: tabular-nums;
`;

export const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Sep = styled.span`
  width: 1px;
  height: 18px;
  background: var(--dd-border);
  margin: 0 4px;
`;

export const Chip = styled.button`
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dd-text-2);
  background: transparent;
  border: 1px solid var(--dd-border);
  border-radius: 999px;
  padding: 7px 13px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &:hover {
    color: var(--dd-text);
    border-color: var(--dd-border-active);
  }
  &[aria-pressed='true'] {
    color: var(--dd-on-brand, #06121f);
    background: var(--dd-primary);
    border-color: var(--dd-primary);
  }
  &:focus-visible {
    outline: 2px solid var(--dd-primary);
    outline-offset: 2px;
  }
`;

export const List = styled.div`
  display: grid;
  gap: 12px;
`;

export const CardLink = styled(Link)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  padding: 22px 26px;
  border: 1px solid var(--dd-border);
  background: var(--dd-surf-1);
  border-radius: 16px;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.18s, transform 0.18s;

  &:hover {
    border-color: var(--dd-border-active);
    transform: translateY(-2px);
  }
  &:hover .cta-arrow {
    transform: translateX(3px);
  }
  &:focus-visible {
    outline: 2px solid var(--dd-primary);
    outline-offset: 3px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

export const CardTitle = styled.h3`
  margin: 0 0 8px;
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-size: 13px;
  color: var(--dd-text-2);

  span + span::before {
    content: '·';
    margin-right: 14px;
    color: var(--dd-text-muted);
  }
`;

export const Summary = styled.p`
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--dd-text-2);
  max-width: 680px;
`;

export const Cta = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--dd-primary);
  white-space: nowrap;

  .cta-arrow {
    display: inline-block;
    transition: transform 0.15s;
  }
`;

export const Empty = styled.div`
  margin-top: 40px;
  padding: 36px 28px;
  border: 1px dashed var(--dd-border-active);
  border-radius: 16px;
  text-align: center;
  color: var(--dd-text-2);

  p {
    margin: 0 0 14px;
    font-size: 16px;
    line-height: 1.6;
  }
  a {
    color: var(--dd-primary);
    font-weight: 600;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;
