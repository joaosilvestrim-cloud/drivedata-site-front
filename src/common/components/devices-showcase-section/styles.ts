import styled from '@emotion/styled';
import { theme } from '../../theme';

export const DevicesSectionContainer = styled.section`
  width: 100%;
  position: relative;
  background-color: transparent;
  padding: ${theme.spacing['4xl']} 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 900px;
    height: 900px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(10, 150, 236, 0.13),
      transparent 62%
    );
    filter: blur(40px);
    z-index: 0;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} 0;
  }
`;

export const DevicesSectionContent = styled.div`
  position: relative;
  z-index: 1;
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
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: ${(props) =>
    props.contentSide === 'left' ? '1fr 430px' : '430px 1fr'};
  align-items: center;
  gap: ${theme.spacing['2xl']};
  padding: ${theme.spacing['2xl']};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(14px);
  clip-path: polygon(0 0, 88% 0, 100% 14%, 100% 100%, 0 100%);
  transition: transform 0.3s ease, background 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(
      150deg,
      rgba(84, 218, 137, 0.4),
      transparent 46%,
      rgba(10, 150, 236, 0.4)
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    clip-path: polygon(0 0, 88% 0, 100% 14%, 100% 100%, 0 100%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.07);
  }

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
    padding: ${theme.spacing.xl};
    clip-path: none;

    &::before {
      clip-path: none;
    }
  }

  img {
    width: 100%;
    height: auto;
    max-width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(234, 240, 251, 0.1);
    box-shadow: 0 12px 40px rgba(7, 12, 22, 0.5);
  }
`;

export const DevicesItemContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.sm};
  }
`;

export const DevicesItemTitle = styled.h3`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: ${theme.typography.fontSize.lg[0]};
  font-weight: 800;
  letter-spacing: -0.6px;
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

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
  color: rgba(234, 240, 251, 0.66);
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
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: ${theme.typography.fontSize.base[0]};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all 0.2s ease-in-out;
  align-self: flex-start;
  white-space: nowrap;

  ${(props) => {
    if (props.variant === 'outlined') {
      return `
        background-color: transparent;
        color: #fff;
        border: 1px solid rgba(34, 211, 238, 0.5);

        &:hover {
          background-color: rgba(34, 211, 238, 0.12);
          border-color: #22d3ee;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(10, 150, 236, 0.25);
        }
      `;
    }
    // variant 'filled' (default)
    return `
      background: linear-gradient(120deg, #0a96ec, #54da89);
      color: #fff;
      border: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(10, 150, 236, 0.35);
        filter: brightness(1.08);
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
