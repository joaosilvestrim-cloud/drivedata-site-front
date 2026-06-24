'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { daltTheme } from '../theme';

const ledSlide = keyframes`
  0%   { left: -100%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { left: 120%; opacity: 0; }
`;

export const GlowCard = styled.div<{ active?: boolean }>`
  position: relative;
  overflow: hidden;
  background: ${daltTheme.gradients.cardBg};
  border: 1px solid ${({ active }) => (active ? daltTheme.colors.borderActive : daltTheme.colors.border)};
  border-radius: ${daltTheme.radius.lg};
  padding: 2rem;
  box-shadow: ${daltTheme.shadows.card};
  transition: border-color 0.4s ${daltTheme.animation.easing},
              box-shadow 0.4s ${daltTheme.animation.easing};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${daltTheme.colors.primary}, transparent);
    opacity: 0;
  }

  &:hover {
    border-color: ${daltTheme.colors.borderActive};
    box-shadow: ${daltTheme.shadows.glowPrimary}, ${daltTheme.shadows.card};

    &::before {
      animation: ${ledSlide} 1.4s ${daltTheme.animation.easing} forwards;
    }
  }
`;
