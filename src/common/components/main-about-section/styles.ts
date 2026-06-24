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
  min-height: 70vh;
  background-image:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.4) 40%,
      rgba(0, 0, 0, 0.4) 70%,
      rgba(0, 0, 0, 0.4) 100%
    ),
    url('/main-about-new.jpg');
  background-size: cover;
  background-position: 80% 0%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #000;
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
  font-size: 48px;
  line-height: 130%;
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing.lg};
  //text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  color: white;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 40px;
    max-width: 700px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 32px;
    max-width: 100%;
  }
`;

export const MainDescription = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: white;
  margin: 0 0 ${theme.spacing['2xl']} 0;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
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
  background: linear-gradient(156.28deg, #54da89 16.11%, #0a96ec 100.01%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
