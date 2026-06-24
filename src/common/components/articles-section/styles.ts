import styled from '@emotion/styled';
import { theme } from '../../theme';

export const ArticlesSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['5xl']} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['4xl']} 0 ${theme.spacing['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['4xl']} 0 ${theme.spacing['2xl']};
  }
`;

export const ArticlesSectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['4xl']};

  @media (max-width: ${theme.breakpoints.md}) {
    margin-bottom: ${theme.spacing['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing['2xl']};
  }
`;

export const ArticlesSectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize['4xl'][0]};
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(153.42deg, #54DA89 30.36%, #0A96EC 132.34%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl'][0]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize['2xl'][0]};
  }
`;

export const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xl};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};
  }
`;

export const ArticleCardContainer = styled.article`
  background: linear-gradient(180deg, rgba(84, 218, 137, 0.15) 0%, rgba(10, 150, 236, 0.15) 100%);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 12px 32px rgba(84, 218, 137, 0.2);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    border-radius: 12px;
  }
`;

export const ArticleThumbnail = styled.div`
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #54DA89 0%, #0A96EC 100%);
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 180px;
  }
`;

export const ArticleContent = styled.div`
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  flex: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
    gap: ${theme.spacing.sm};
  }
`;

export const ArticleCategory = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: #54DA89;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ArticleTitle = styled.h3`
  font-family: 'Satoshi', sans-serif;
  font-size: 20px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: #FFFFFF;
  line-height: 130%;
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 18px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const ArticleExcerpt = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: ${theme.typography.fontWeight.normal};
  color: ${theme.colors.neutral[300]};
  line-height: 150%;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 13px;
    line-height: 140%;
  }
`;

export const ArticleFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: auto;
  padding-top: ${theme.spacing.md};
`;

export const ArticleAuthorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: ${theme.colors.neutral[700]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ArticleAuthorName = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: #FFFFFF;
`;

