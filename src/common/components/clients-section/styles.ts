import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme';

const fadeUpSoft = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 32px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const ClientsSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  max-width: 992px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} 0;
  }
`;

export const ClientsSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.xl};
  opacity: 0;
  animation: ${fadeUpSoft} 0.6s ease forwards;
  animation-play-state: paused;
  will-change: opacity, transform;

  &[data-animate='true'] {
    animation-play-state: running;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.lg};
  }
`;

export const ClientsHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${theme.spacing.xl};
  flex-direction: row;
  text-align: left;
  opacity: 0;
  transform: translate3d(-16px, 0, 0);
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  img {
    flex-shrink: 0;
    transition: transform 0.45s ease 120ms;
  }

  &[data-animate='true'] img {
    transform: scale(1.03);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${theme.spacing.lg};

    img {
      width: 120px;
      height: auto;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.md};

    img {
      width: 100px;
      height: auto;
    }
  }
`;

export const ClientsHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  transition:
    opacity 0.45s ease 140ms,
    transform 0.45s ease 140ms;
  will-change: opacity, transform;

  ${ClientsHeader}[data-animate='true'] & {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    align-items: center;
  }
`;


export const ClientsTitle = styled.h2`
  font-size: 40px;
  line-height: 1.3;
  font-weight: ${theme.typography.fontWeight.medium};
  color: white;
  margin: 0;
  max-width: 600px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 32px;
    max-width: 100%;
    text-align: center;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

export const HighlightedText = styled.span`
  background: linear-gradient(
    to bottom,
    #009fff,
    #00b0ff,
    #00c0ff,
    #00cffd,
    #00dcf7,
    #2ce3f4,
    #45eaf1,
    #5bf1ee,
    #68f5f0,
    #74f8f1,
    #7ffcf3,
    #8afff5
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const HighlightedTextBlue = styled.span`
  background: linear-gradient(180deg, #8afff5 0%, #009fff 60%, #8afff5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const ClientsSubtitle = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: #B0B0B0;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.semibold};
  text-align: left;
  max-width: 800px;
  opacity: 0;
  transition: opacity 0.45s ease 200ms;

  &[data-animate='true'] {
    opacity: 1;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
    font-size: 18px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
  width: 100%;
  margin-top: ${theme.spacing.xl};
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  transition:
    opacity 0.45s ease 160ms,
    transform 0.45s ease 160ms;
  will-change: opacity, transform;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    margin-top: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
    margin-top: ${theme.spacing.md};
  }
`;

export const ClientCard = styled.div<{ backgroundImage: string; overlayColor: string }>`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.45s ease;
  border: 2px solid ${(props) => props.overlayColor};
  background-image: ${(props) => `url(${props.backgroundImage})`};
  background-size: auto 110%;
  background-position: center;
  background-repeat: no-repeat;
  max-width: 308px;
  max-height: 305px;
  z-index: 3;
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  will-change: transform, opacity;

  &[data-animate='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &[data-animate='true'][data-order='1'] {
    transition-delay: 90ms;
  }

  &[data-animate='true'][data-order='2'] {
    transition-delay: 180ms;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${(props) => {
      const hex = props.overlayColor;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(${r}, ${g}, ${b}, 0.3) 40%,
        rgba(${r}, ${g}, ${b}, 0.5) 70%,
        rgba(${r}, ${g}, ${b}, 0.6) 100%
      )`;
    }};
    z-index: 1;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${(props) => `0 12px 40px ${props.overlayColor}66`};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    border-radius: 20px;
    max-width: 100%;
    max-height: 100%;
  }
`;

export const ClientLogoOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-play-state: paused;

  &[data-animate='true'] {
    animation-play-state: running;
    animation-delay: 120ms;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

export const ClientBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4FD89C 0%, #48E2CF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(79, 216, 156, 0.4);

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

