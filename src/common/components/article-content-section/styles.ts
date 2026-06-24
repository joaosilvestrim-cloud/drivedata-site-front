import styled from '@emotion/styled';
import { theme } from '../../theme';

export const ContentSection = styled.section`
  width: 100%;
  padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.md};
  }
`;

export const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0;
  }
`;

export const ArticleContent = styled.div`
  font-size: 18px;
  line-height: 180%;
  color: #FFFFFF;

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.semibold};
    margin-top: ${theme.spacing['2xl']};
    margin-bottom: ${theme.spacing.md};
    line-height: 140%;
    color: #4DC3EE;

    @media (max-width: ${theme.breakpoints.sm}) {
      margin-top: ${theme.spacing.xl};
      margin-bottom: ${theme.spacing.sm};
    }
  }

  h1 {
    font-size: 40px;
    
    @media (max-width: ${theme.breakpoints.md}) {
      font-size: 36px;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 28px;
      line-height: 130%;
    }
  }

  h2 {
    font-size: 32px;
    
    @media (max-width: ${theme.breakpoints.md}) {
      font-size: 28px;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 24px;
      line-height: 130%;
    }
  }

  h3 {
    font-size: 26px;
    
    @media (max-width: ${theme.breakpoints.md}) {
      font-size: 24px;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 20px;
      line-height: 130%;
    }
  }

  h4 {
    font-size: 22px;
    
    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 18px;
    }
  }

  h5, h6 {
    font-size: 18px;
    
    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 16px;
    }
  }

  p {
    margin-bottom: ${theme.spacing.md};
    line-height: 180%;

    @media (max-width: ${theme.breakpoints.sm}) {
      margin-bottom: ${theme.spacing.sm};
      line-height: 160%;
    }
  }

  a {
    color: ${theme.colors.primary[600]};
    text-decoration: underline;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.primary[700]};
    }
  }

  strong, b {
    font-weight: ${theme.typography.fontWeight.semibold};
  }

  em, i {
    font-style: italic;
  }

  ul, ol {
    margin-bottom: ${theme.spacing.md};
    padding-left: ${theme.spacing.xl};

    @media (max-width: ${theme.breakpoints.sm}) {
      margin-bottom: ${theme.spacing.sm};
      padding-left: ${theme.spacing.lg};
    }
  }

  li {
    margin-bottom: ${theme.spacing.xs};
    line-height: 180%;

    @media (max-width: ${theme.breakpoints.sm}) {
      line-height: 160%;
    }
  }

  blockquote {
    border-left: 4px solid ${theme.colors.primary[500]};
    padding-left: ${theme.spacing.lg};
    margin: ${theme.spacing.xl} 0;
    font-style: italic;
    color: ${theme.colors.neutral[600]};

    @media (max-width: ${theme.breakpoints.sm}) {
      padding-left: ${theme.spacing.md};
      margin: ${theme.spacing.lg} 0;
      border-left-width: 3px;
    }
  }

  code {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 16px;

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 14px;
      padding: 2px 4px;
    }
  }

  pre {
    background-color: rgba(0, 0, 0, 0.05);
    padding: ${theme.spacing.lg};
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: ${theme.spacing.lg};

    code {
      background-color: transparent;
      padding: 0;
    }

    @media (max-width: ${theme.breakpoints.sm}) {
      padding: ${theme.spacing.md};
      margin-bottom: ${theme.spacing.md};
      border-radius: 6px;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: ${theme.spacing.xl} 0;

    @media (max-width: ${theme.breakpoints.sm}) {
      margin: ${theme.spacing.lg} 0;
      border-radius: 6px;
    }
  }

  hr {
    border: none;
    border-top: 1px solid ${theme.colors.neutral[200]};
    margin: ${theme.spacing['2xl']} 0;

    @media (max-width: ${theme.breakpoints.sm}) {
      margin: ${theme.spacing.xl} 0;
    }
  }

  table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    margin-bottom: ${theme.spacing.xl};
    display: table;
    table-layout: auto;
    
    @media (max-width: ${theme.breakpoints.sm}) {
      margin-bottom: ${theme.spacing.lg};
      font-size: 14px;
      min-width: 100%;
    }
    
    th, td {
      padding: ${theme.spacing.md};
      border: 1px solid ${theme.colors.neutral[200]};
      text-align: left;

      @media (max-width: ${theme.breakpoints.sm}) {
        padding: ${theme.spacing.sm};
        min-width: 100px;
      }
    }

    th {
      background-color: rgba(0, 0, 0, 0.02);
      font-weight: ${theme.typography.fontWeight.semibold};

      @media (max-width: ${theme.breakpoints.sm}) {
        font-size: 13px;
      }
    }
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 17px;
    line-height: 170%;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
    line-height: 160%;
  }
`;

