import styled from '@emotion/styled';
import { theme } from '@/common/theme';

export const PageContainer = styled.section`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    #0a0e1a 0%,
    #0f1419 50%,
    #0a0e1a 100%
  );
  padding: ${theme.spacing['4xl']} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} 0;
  }
`;

export const PageContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
  }
`;

export const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize['4xl'][0]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: #0dd0d0;
  margin-bottom: ${theme.spacing.sm};
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl'][0]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize['2xl'][0]};
  }
`;

export const PageSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.sm[0]};
  color: #c4c4c4;
  margin-bottom: ${theme.spacing['2xl']};

  strong {
    color: #e0e0e0;
    font-weight: ${theme.typography.fontWeight.medium};
  }
`;

export const Section = styled.div`
  margin-bottom: ${theme.spacing['3xl']};

  @media (max-width: ${theme.breakpoints.md}) {
    margin-bottom: ${theme.spacing['2xl']};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl'][0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: #0dd0d0;
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.xl[0]};
  }
`;

export const SubSection = styled.div`
  margin-bottom: ${theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SubSectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  color: #ffffff;
  margin-bottom: ${theme.spacing.md};
  line-height: 1.4;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base[0]};
  }
`;

export const Paragraph = styled.p`
  font-size: ${theme.typography.fontSize.base[0]};
  line-height: 1.7;
  color: #c4c4c4;
  margin-bottom: ${theme.spacing.md};

  strong {
    color: #ffffff;
    font-weight: ${theme.typography.fontWeight.semibold};
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.sm[0]};
  }
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: ${theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ListItem = styled.li`
  font-size: ${theme.typography.fontSize.base[0]};
  line-height: 1.7;
  color: #c4c4c4;
  margin-bottom: ${theme.spacing.sm};
  padding-left: ${theme.spacing.lg};
  position: relative;

  &::before {
    content: '•';
    color: #0dd0d0;
    font-weight: ${theme.typography.fontWeight.bold};
    position: absolute;
    left: 0;
  }

  strong {
    color: #ffffff;
    font-weight: ${theme.typography.fontWeight.semibold};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.sm[0]};
  }
`;

export const InfoBox = styled.div`
  background: rgba(13, 208, 208, 0.08);
  border-left: 4px solid #0dd0d0;
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};

  ${Paragraph} {
    margin-bottom: 0;
    color: #e0e0e0;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md};
  }
`;

export const Link = styled.a`
  color: #0dd0d0;
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all 0.2s ease-in-out;

  &:hover {
    text-decoration: underline;
    color: #1fe5e5;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: ${theme.spacing['2xl']} 0;
`;

export const CompanyInfo = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

export const CompanyName = styled.h4`
  font-size: ${theme.typography.fontSize.lg[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: #ffffff;
  margin-bottom: ${theme.spacing.xs};
`;

export const CompanyDetails = styled.p`
  font-size: ${theme.typography.fontSize.sm[0]};
  line-height: 1.6;
  color: #c4c4c4;
  margin-bottom: ${theme.spacing.xs};

  &:last-child {
    margin-bottom: 0;
  }
`;
