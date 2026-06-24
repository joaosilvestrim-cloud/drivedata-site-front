import styled from '@emotion/styled';
import { theme } from '../../theme';

export const FloatingContactContainer = styled.button`
  position: fixed;
  bottom: ${theme.spacing['2xl']};
  right: ${theme.spacing['2xl']};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  flex-direction: row-reverse;
  padding: ${theme.spacing.md};
  background: none;
  border: none;
  cursor: pointer;
  text-align: right;
  z-index: 1000;

  @media (max-width: ${theme.breakpoints.sm}) {
    bottom: ${theme.spacing.lg};
    right: ${theme.spacing.lg};
  }
`;

export const FloatingAvatarWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 64px;
    height: 64px;
  }
`;

export const FloatingAvatar = styled.div<{ backgroundImage: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  background-image: url(${props => props.backgroundImage});
  background-size: 150%;
  background-position: center 30%;
  background-repeat: no-repeat;
`;

export const FloatingAvatarStatus = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  background: linear-gradient(153.42deg, #54DA89 30.36%, #0A96EC 132.34%);
  border-radius: 50%;
  z-index: 3;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 14px;
    height: 14px;
    bottom: 2px;
    right: 2px;
  }
`;

export const FloatingBubble = styled.div<{ isVisible: boolean }>`
  position: relative;
  background: #FFFFFF;
  border-radius: 24px;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translateX(0)' : 'translateX(20px)'};
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 280px;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }

  &::before {
    content: '';
    position: absolute;
    right: -8px;
    top: 24px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 12px solid #FFFFFF;
    border-right: none;
  }
`;

export const FloatingBubbleText = styled.p`
  font-family: 'Satoshi', sans-serif;
  font-size: 16px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: #0A0A0F;
  line-height: 140%;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

