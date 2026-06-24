'use client';

import { theme } from '../../theme';
import { StyledContainer } from './styles';
import { ContainerProps } from './types';

export const Container = ({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className,
}: ContainerProps) => {
  const maxWidthMap = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  };

  const paddingMap = {
    none: '0',
    sm: `0 ${theme.spacing.sm}`,
    md: `0 ${theme.spacing.md}`,
    lg: `0 ${theme.spacing.lg}`,
    xl: `0 ${theme.spacing.xl}`,
  };

  return (
    <StyledContainer
      maxWidth={maxWidthMap[maxWidth]}
      padding={paddingMap[padding]}
      className={className}
    >
      {children}
    </StyledContainer>
  );
};
