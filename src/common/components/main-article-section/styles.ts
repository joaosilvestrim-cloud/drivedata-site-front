import styled from '@emotion/styled';
import { theme } from '../../theme';

export const MainContainer = styled.section<{ $imageUrl?: string }>`
  position: relative;
  width: 100%;
  min-height: 70vh;
  padding-top: 120px;
  background-image: 
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.4) 40%,
      rgba(0, 0, 0, 0.4) 70%,
      rgba(0, 0, 0, 0.4) 100%
    ),
    ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'url(/main-about.jpg)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #000;

  @media (max-width: ${theme.breakpoints.md}) {
    padding-top: 100px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding-top: 90px;
    min-height: 60vh;
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

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.md};
  }
`;

export const MainTitle = styled.h1`
  font-size: 63px;
  line-height: 130%;
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(156.28deg, #54DA89 16.11%, #0A96EC 100.01%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 40px;
    max-width: 700px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 32px;
    max-width: 100%;
  }
`;

export const MainSubTitle = styled.p`
  font-family: 'Satoshi', ${theme.typography.fontFamily.sans};
  font-size: 24px;
  line-height: 140%;
  color: white;
  margin: 0 0 ${theme.spacing['2xl']} 0;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 20px;
    line-height: 135%;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
    line-height: 130%;
    margin-bottom: ${theme.spacing.xl};
  }
`;

