import styled from '@emotion/styled';
import { theme } from '../../theme';

/* export const MainContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-image:
    linear-gradient(
      rgba(0, 0, 0, 0.35),
      rgba(0, 0, 0, 0.85),
      rgba(0, 0, 0, 0.95)
    ),
    url('/main.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #000000;

  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      rgba(255, 255, 255, 0.35) 0%,
      rgba(9, 162, 255, 1) 50% rgba(9, 162, 255, 1) 100%
    );

    mix-blend-mode: multiply;
    z-index: 1;
  }
`; 
*/

export const MainContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: url('/main-min.webp') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #000;

  /* Camada escura azulada */
  /* &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(5, 15, 35, 0.8),
      rgba(0, 20, 50, 0.9)
    );

    mix-blend-mode: multiply;
    z-index: 1;
  } */

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(9, 162, 255, 0.25) 0%,
      rgba(0, 0, 0, 0.9) 70%
    );
    z-index: 1; /* abaixo dos círculos, acima da imagem */
    pointer-events: none;
  }

  /* Círculos concêntricos (radar) */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 1200px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: repeating-radial-gradient(
      circle at 50% 50%,
      rgba(200, 220, 255, 0.8) 0px,
      rgba(200, 220, 255, 0.8) 2px,
      transparent 2px,
      transparent 80px,
      rgba(200, 220, 255, 0.6) 80px,
      rgba(200, 220, 255, 0.6) 82px,
      transparent 82px,
      transparent 160px,
      rgba(200, 220, 255, 0.4) 160px,
      rgba(200, 220, 255, 0.4) 162px,
      transparent 162px,
      transparent 240px
    );
    opacity: 0.6;
    mix-blend-mode: overlay;
    z-index: 1;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 3;
  }
`;

export const MainContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1216px;
  padding: 0 24px;
  text-align: center;
  color: white;
`;

export const MainTitle = styled.h1`
  font-size: 40px;
  line-height: 130%;
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing['2xl']};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 36px;
    max-width: 480px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 32px;
    max-width: 300px;
  }
`;

export const MainActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

export const HighlightedText = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
  background: linear-gradient(to right, #ffffff, #8afff5);
  -webkit-background-clip: text;
  color: #8afff5;
`;
