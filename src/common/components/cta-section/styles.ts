import styled from '@emotion/styled';
import { theme } from '../../theme';

export const CtaSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  background-color: #000000;
  position: relative;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['3xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} 0;
  }
`;

export const CtaSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing['2xl']};
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xl};
  }
`;

export const CtaTitle = styled.h2`
  background: linear-gradient(
    to right,
    #54DA89 0%,
    #0A96EC 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 40px;
  line-height: 1.3;
  font-weight: ${theme.typography.fontWeight.medium};
  margin: 0;
  max-width: 800px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 32px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const CtaDescription = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: #B0B0B0;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.normal};
  max-width: 700px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 18px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

export const CtaButtonWrapper = styled.div`
  margin-top: ${theme.spacing.lg};
  display: flex;
  justify-content: center;
`;

