import styled from '@emotion/styled';
import { theme } from '../../theme';

export const FaqSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  background-color: #000000;
  position: relative;
  overflow: visible;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['4xl']} 0 ${theme.spacing['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['4xl']} 0 ${theme.spacing['2xl']};
  }
`;

export const FaqSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.lg};
  }
`;

export const FaqHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xs};
  }
`;

export const FaqTitle = styled.h2`
  font-size: 48px;
  line-height: 1.2;
  font-weight: ${theme.typography.fontWeight.bold};
  color: white;
  margin: 0;
  text-align: center;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const FaqSubtitle = styled.p`
  font-size: 48px;
  line-height: 1.2;
  color: #8AFFF5;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.bold};
  text-align: center;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    margin-top: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.lg};
  }
`;

export const FaqItem = styled.div<{ isOpen: boolean }>`
  background: linear-gradient(180deg, #1F1F1F 0%, #1A1A1A 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  ${props => props.isOpen && `
    border-color: rgba(138, 255, 245, 0.5);
  `}

  &:hover {
    border-color: rgba(138, 255, 245, 0.5);
    transform: translateX(4px);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    border-radius: 8px;
    gap: ${theme.spacing.xs};

    &:hover {
      transform: translateX(2px);
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
  font-size: 18px;
  line-height: 1.6;
  color: white;
  font-weight: ${props => props.isOpen ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 16px;
    line-height: 1.5;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 1.4;
  }
`;

export const ChevronIcon = styled.div<{ isOpen: boolean }>`
  color: #8AFFF5;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const FaqAnswer = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: ${theme.colors.neutral[300]};
  margin-top: 16px;
  opacity: 1;
  font-weight: ${theme.typography.fontWeight.normal};

  p {
    margin: 0 0 12px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  ol, ul {
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

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 15px;
    line-height: 1.5;
    margin-top: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 1.4;
    margin-top: ${theme.spacing.sm};

    p {
      margin: 0 0 ${theme.spacing.sm} 0;
    }

    ol, ul {
      margin-left: ${theme.spacing.md};
      margin-bottom: ${theme.spacing.sm};
    }

    ol {
      padding-left: ${theme.spacing.md};
    }

    ul {
      padding-left: ${theme.spacing.md};
    }
  }
`;

