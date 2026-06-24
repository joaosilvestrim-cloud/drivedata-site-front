import styled from '@emotion/styled';
import { theme } from '../../theme';

export const FooterContainer = styled.footer`
  background-color: ${theme.colors.neutral[50]};
  border-top: 1px solid ${theme.colors.neutral[200]};
  margin-top: auto;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`;

export const CompaniesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.neutral[200]};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

export const CompanyCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const CompanyName = styled.h3`
  font-size: ${theme.typography.fontSize.lg[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[900]};
  margin-bottom: ${theme.spacing.xs};
`;

export const CompanyInfo = styled.p`
  font-size: ${theme.typography.fontSize.sm[0]};
  color: ${theme.colors.neutral[600]};
  line-height: 1.6;
  margin: 0;
`;

export const LinksSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

export const LinksTitle = styled.h4`
  font-size: ${theme.typography.fontSize.sm[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const LinksList = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

export const FooterLink = styled.a`
  font-size: ${theme.typography.fontSize.sm[0]};
  color: ${theme.colors.primary[600]};
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

export const CopyrightSection = styled.div`
  text-align: center;
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.neutral[200]};
`;

export const Copyright = styled.p`
  font-size: ${theme.typography.fontSize.sm[0]};
  color: ${theme.colors.neutral[600]};
  margin: 0;
`;
