import styled from '@emotion/styled';
import { theme } from '../../theme';

export const HeaderContainer = styled.header`
  background-color: white;
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.sticky};
  box-shadow: ${theme.shadows.sm};
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md} ${theme.spacing.md};
    gap: ${theme.spacing.md};
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoImage = styled.img`
  height: 48px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${theme.breakpoints.md}) {
    height: 40px;
  }
`;

export const Navigation = styled.nav`
  display: flex;
  gap: ${theme.spacing.xs};
  background-color: ${theme.colors.neutral[50]};
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.xl};
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
  }
`;

export const NavLink = styled.a<{ isActive?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  background-color: ${(props) =>
    props.isActive ? theme.colors.primary[600] : 'transparent'};
  color: ${(props) =>
    props.isActive ? 'white' : theme.colors.neutral[700]};

  &:hover {
    background-color: ${(props) =>
      props.isActive
        ? theme.colors.primary[700]
        : theme.colors.neutral[100]};
    color: ${(props) =>
      props.isActive ? 'white' : theme.colors.neutral[900]};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.xs[0]};
    flex: 1 1 auto;
    text-align: center;
  }
`;
