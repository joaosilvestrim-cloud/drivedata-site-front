import styled from '@emotion/styled';
import { theme } from '../../theme';

export const DevicesSectionContainer = styled.section`
  width: 100%;
  background-color: #F7FAFC;
  padding: ${theme.spacing['4xl']} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} 0;
  }
`;

export const DevicesSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.lg};
  }
`;

export const DevicesItem = styled.div<{ contentSide: 'left' | 'right'}>`
  display: grid;
  width: 100%;
  grid-template-columns: ${(props) =>
    props.contentSide === 'left' ? '1fr 430px' : '430px 1fr'};
  align-items: center;
  gap: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
    
    ${(props) =>
      props.contentSide === 'left' &&
      `
        > *:first-child {
          order: 2;
        }
        > *:last-child {
          order: 1;
        }
      `}
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.lg};
  }

  img {
    width: 100%;
    height: auto;
    max-width: 100%;
  }
`;

export const DevicesItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

export const DevicesItemTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  color: #2086EB;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base[0]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.sm[0]};
  }
`;

export const DevicesItemDescription = styled.p`
  font-size: ${theme.typography.fontSize.base[0]};
  font-weight: ${theme.typography.fontWeight.normal};
  color: #565656;
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.sm[0]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.xs[0]};
  }
`;

export const DevicesItemButton = styled.button<{ variant?: 'filled' | 'outlined' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.md};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.base[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all 0.2s ease-in-out;
  align-self: flex-start;
  white-space: nowrap;

  ${(props) => {
    if (props.variant === 'outlined') {
      return `
        background-color: transparent;
        color: #2086EB;
        border: 2px solid #2086EB;

        &:hover {
          background-color: #2086EB;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;
    }
    // variant 'filled' (default)
    return `
      background-color: #2086EB;
      color: #FFFFFF;
      border: none;

      &:hover {
        background-color: #1a6ec7;
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.md};
      }
    `;
  }}

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.sm[0]};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;