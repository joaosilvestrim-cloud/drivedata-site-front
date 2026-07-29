import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Wrap = styled.section`
  width: 100%;
  padding: 0 ${theme.spacing.xl} ${theme.spacing['3xl']};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md} ${theme.spacing['2xl']};
  }
`;

export const FaqBlock = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0;
  }
`;

export const FaqTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: 30px;
  color: #4dc3ee;
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
    margin-bottom: ${theme.spacing.lg};
  }
`;

export const FaqItem = styled.details`
  border: 1px solid rgb(var(--dd-ink-rgb) / 0.12);
  border-radius: 14px;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.md};
  background: rgb(var(--dd-ink-rgb) / 0.03);
  transition: border-color 0.2s ease;

  &[open] {
    border-color: rgba(77, 195, 238, 0.5);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }
`;

export const FaqQ = styled.summary`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: 18px;
  color: var(--dd-text);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: '+';
    color: #4dc3ee;
    font-size: 24px;
    line-height: 1;
    flex-shrink: 0;
  }

  details[open] &::after {
    content: '−';
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const FaqA = styled.p`
  margin-top: ${theme.spacing.md};
  font-size: 16px;
  line-height: 175%;
  color: rgb(var(--dd-fog-rgb) / 0.82);

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 15px;
  }
`;
