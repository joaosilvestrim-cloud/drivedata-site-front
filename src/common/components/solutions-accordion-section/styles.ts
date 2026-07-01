import styled from '@emotion/styled';
import { theme } from '../../theme';

export const SolutionsSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  background: transparent;
  position: relative;
  overflow: visible;

`;

export const SolutionsSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`;

export const SolutionsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -0.6px;
  font-size: 48px;
  line-height: 1.2;
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-align: center;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const SolutionsDescription = styled.p`
  font-family: 'Satoshi', sans-serif;
  font-size: 20px;
  line-height: 1.6;
  color: white;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const SolutionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

export const SolutionItem = styled.div<{ isOpen: boolean; isHighlighted?: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
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

  ${props => props.isHighlighted && `
    border: 1px solid #0A96EC;
  `}

  &:hover {
    border-color: rgba(138, 255, 245, 0.5);
    transform: translateX(4px);
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8AFFF5;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const SolutionDescription = styled.div<{ isOpen?: boolean }>`
  font-size: 18px;
  line-height: 1.6;
  color: white;
  font-weight: ${props => props.isOpen ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal};
  transition: opacity 0.3s ease;

  strong {
    font-weight: ${theme.typography.fontWeight.medium};
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
`;

export const SolutionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

export const SolutionTitleText = styled.strong`
  flex: 1;
`;

export const IconImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

export const ExpandedDescription = styled(SolutionDescription)`
  font-family: 'Satoshi', sans-serif;
  margin-top: 16px;
  opacity: 1;

  ol, ul {
    margin-left: 24px;
  }

  /* Force ordered lists to display bullets instead of numbers */
  ol {
    list-style-type: disc;
    padding-left: 24px;
  }
`;

