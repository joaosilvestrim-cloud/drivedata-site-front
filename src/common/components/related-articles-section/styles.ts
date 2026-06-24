import styled from '@emotion/styled';
import { theme } from '../../theme';

export const RelatedArticlesSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['5xl']} 0;
`;

export const RelatedArticlesSectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['4xl']};
`;

export const RelatedArticlesSectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(153.42deg, #54DA89 30.36%, #0A96EC 132.34%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

export const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing['2xl']};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

