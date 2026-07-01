import styled from '@emotion/styled';
import { theme } from '../../theme';

export const AboutUsSectionContainer = styled.section`
  width: 100%;
  min-height: 600px;
  background-image: url('/tamires-office.png');
  background-size: cover;
  background-position: 50% 30%;
  position: relative;
  padding: ${theme.spacing['4xl']} 0;

  /* Gradiente escuro da direita para esquerda, de baixo para cima */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top left,
      rgba(10, 14, 26, 0.95) 0%,
      rgba(10, 14, 26, 0.85) 40%,
      rgba(10, 14, 26, 0.6) 70%,
      rgba(10, 14, 26, 0) 100%
    );
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    &::before {
      background: linear-gradient(
        to top,
        rgba(10, 14, 26, 0.95) 0%,
        rgba(10, 14, 26, 0.7) 60%,
        rgba(10, 14, 26, 0.3) 100%
      );
    }
  }
`;

export const AboutUsSectionContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;

export const AboutUsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['3xl']};
  align-items: end;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing['2xl']};
    align-items: start;
  }
`;

export const FounderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  max-width: 500px;
  margin-top: auto;
  padding-top: ${theme.spacing['5xl']};

  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 100%;
    padding-top: 0;
    margin-top: 0;
  }
`;

export const FounderName = styled.h3`
  font-size: ${theme.typography.fontSize['3xl'][0]};
  line-height: 1.2;
  font-weight: ${theme.typography.fontWeight.bold};
  color: #ffffff;
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['2xl'][0]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.xl[0]};
  }
`;

export const FounderRole = styled.p`
  font-size: ${theme.typography.fontSize.lg[0]};
  line-height: 1.4;
  color: #0dd0d0;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.medium};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.base[0]};
  }
`;

export const FounderBio = styled.p`
  font-size: ${theme.typography.fontSize.base[0]};
  line-height: 1.6;
  color: #e0e0e0;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.sm[0]};
  }
`;
export const FounderSeal = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 40px;
    width: auto;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    img {
      height: 32px;
    }
  }
`;

export const AboutUsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const AboutUsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: ${theme.typography.fontSize['4xl'][0]};
  line-height: 1.15;
  letter-spacing: -0.6px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl'][0]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize['2xl'][0]};
  }
`;

export const AboutUsTitleHighlight = styled.span`
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const AboutUsSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg[0]};
  line-height: 1.5;
  color: #ffffff;
  margin: 0;
  font-weight: ${theme.typography.fontWeight.medium};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.base[0]};
  }
`;

export const AboutUsDescription = styled.p`
  font-size: ${theme.typography.fontSize.base[0]};
  line-height: 1.6;
  color: #c4c4c4;
  margin: 0;
  white-space: pre-line;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.sm[0]};
  }
`;

export const AboutUsSlogan = styled.p`
  font-size: ${theme.typography.fontSize.base[0]};
  line-height: 1;
  color: ${theme.colors.primary[300]};
  margin: 0;
  white-space: pre-line;
  font-weight: ${theme.typography.fontWeight.light};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.sm[0]};
  }
`;

export const TeamImageWrapper = styled.div`
  width: 100%;
  position: relative;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  margin-top: ${theme.spacing.md};

  img {
    display: block;
  }
`;
