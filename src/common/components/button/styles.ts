import styled from '@emotion/styled';
import { theme } from '../../theme';

export const StyledButton = styled.button<{
  variant: string;
  size: string;
  disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;

  /* Border radius baseado na especificação */
  border-radius: 69px;

  /* Border branca com 8% de opacidade */
  border: 1px solid rgba(255, 255, 255, 0.08);

  /* Background blur */
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  /* Size variants baseados na especificação */
  ${(props) => {
    switch (props.size) {
      case 'sm':
        return `
          padding: 6px 12px;
          font-size: ${theme.typography.fontSize.sm[0]};
          min-height: 32px;
          min-width: 120px;
        `;
      case 'lg':
        return `
          padding: 12px 24px;
          font-size: ${theme.typography.fontSize.lg[0]};
          min-height: 48px;
          min-width: 180px;
        `;
      default: // md - baseado na especificação
        return `
          padding: 9px 17px;
          font-size: ${theme.typography.fontSize.base[0]};
          min-height: 38px;
          min-width: 148px;
        `;
    }
  }}

  /* Variant styles */
  ${(props) => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: linear-gradient(90deg, ${theme.colors.secondary[600]} 0%, ${theme.colors.secondary[700]} 100%);
          color: white;
          &:hover:not(:disabled) {
            background: linear-gradient(90deg, ${theme.colors.secondary[700]} 0%, ${theme.colors.secondary[800]} 100%);
            transform: translateY(-1px);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary[600]};
          border: 2px solid ${theme.colors.primary[600]};
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[600]};
            color: white;
            transform: translateY(-1px);
          }
        `;
      default: // primary - gradiente Drive Data
        return `
          background: linear-gradient(90deg, #54DA89 0%, #0A96EC 100%);
          color: ${theme.colors.neutral[900]};
          &:hover:not(:disabled) {
            background: linear-gradient(90deg, #4BCA7A 0%, #0885D4 100%);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(84, 218, 137, 0.3);
          }
        `;
    }
  }}

  /* Disabled state */
  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  `}

  /* Focus state */
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Active state */
  &:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Responsive adjustments */
  @media (max-width: ${theme.breakpoints.sm}) {
    min-width: auto;
    padding: 8px 16px;
    font-size: ${theme.typography.fontSize.sm[0]};
  }
`;
