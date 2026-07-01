import styled from '@emotion/styled';
import { theme } from '../../theme';

export const FooterContainer = styled.footer`
  width: 100%;
  position: relative;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0) 40%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing['3xl']} 0 ${theme.spacing.xl} 0;

  /* linha de topo com brilho da marca (ciano→verde) */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(10, 150, 236, 0.6), rgba(84, 218, 137, 0.6), transparent);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['2xl']} 0 ${theme.spacing.lg} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} 0 ${theme.spacing.md} 0;
  }
`;

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: ${theme.spacing['4xl']};
  align-items: flex-end;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.xl};
    align-items: flex-start;

    > div:first-of-type {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.lg};
  }
`;

export const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  
  img {
    height: 40px;
    width: auto;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    img {
      height: 32px;
    }
  }
`;

export const FooterUrl = styled.a`
  font-size: 15px;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: #8AFFF5;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  transition: color 0.3s ease;
  display: inline-block;
  margin-bottom: ${theme.spacing.sm};

  &:hover {
    color: #54DA89;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 13px;
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-bottom: 0;
  }
`;

export const FooterSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: #27B1C5;
  margin: 0 0 ${theme.spacing.xs} 0;
  font-family: 'Satoshi', sans-serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 14px;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 13px;
  }
`;

export const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

export const FooterLinkItem = styled.li`
  margin: 0;
`;

export const FooterLink = styled.a`
  font-size: 14px;
  color: white;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    color: #8AFFF5;
  }

  svg {
    color: #27B1C5;
    width: 16px;
    height: 16px;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

export const SocialLink = styled.a`
  font-size: 14px;
  color: white;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    color: #8AFFF5;
  }

  svg {
    color: #27B1C5;
    width: 16px;
    height: 16px;
  }
`;

export const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.xl};
  margin-top: ${theme.spacing['2xl']};
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    text-align: center;
    padding-top: ${theme.spacing.lg};
    margin-top: ${theme.spacing.xl};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding-top: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
  }
`;

export const FooterCopyright = styled.p`
  font-size: 14px;
  color: ${theme.colors.neutral[400]};
  margin: 0;
  font-family: 'Inter', sans-serif;
  padding-right: ${theme.spacing.lg};
  margin-right: ${theme.spacing.lg};
  border-right: 3px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${theme.breakpoints.md}) {
    border-right: none;
    padding-right: 0;
    margin-right: 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 12px;
  }
`;

export const FooterMadeBy = styled.p`
  font-size: 14px;
  color: ${theme.colors.neutral[400]};
  margin: 0;
  font-family: 'Inter', sans-serif;

  a {
    color: #8AFFF5;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #54DA89;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 12px;
  }
`;

export const FooterBottomContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;