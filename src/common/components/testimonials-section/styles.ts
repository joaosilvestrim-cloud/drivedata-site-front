import styled from '@emotion/styled';
import { theme } from '../../theme';

export const TestimonialsSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  background: #F2F5EB;
  overflow: hidden;

  .swiper {
    overflow: visible;
    padding-left: 0;
    margin-left: 0;
    width: 100%;

    @media (max-width: ${theme.breakpoints.md}) {
      overflow: hidden;
    }
  }

  .swiper-wrapper {
    transition-timing-function: ease-in-out;
    align-items: stretch;
  }

  .swiper-slide {
    height: auto;
    width: 490px;
    display: flex;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['4xl']} 0 ${theme.spacing['3xl']};

    .swiper-slide {
      width: 100%;
      max-width: 490px;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['4xl']} 0 ${theme.spacing['2xl']};

    .swiper-slide {
      width: 100%;
      max-width: 100%;
    }
  }
`;

export const TestimonialsSectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['4xl']};

  @media (max-width: ${theme.breakpoints.md}) {
    margin-bottom: ${theme.spacing['3xl']};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing['2xl']};
  }
`;

export const TestimonialsSectionTitle = styled.h2`
  font-size: 40px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: #2086EB;
  margin: 0 0 ${theme.spacing.md} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 32px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

export const TestimonialsSectionSubtitle = styled.p`
  font-size: 18px;
  font-weight: ${theme.typography.fontWeight.normal};
  color: ${theme.colors.neutral[700]};
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 16px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

export const TestimonialCardContainer = styled.div`
  background: linear-gradient(0deg, #040509, #040509),
radial-gradient(280.6% 254.07% at 50% -150%, rgba(0, 0, 0, 0) 60%, rgba(255, 255, 255, 0.01) 100%),
radial-gradient(995.25% 901.14% at 50% -800%, rgba(0, 0, 0, 0) 96%, rgba(255, 255, 255, 0.01) 100%),
linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02));
  border-radius: 12px;
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  width: 490px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.xl};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    max-width: 490px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
    max-width: 100%;
    padding: ${theme.spacing.xl};
    gap: ${theme.spacing.md};
  }
`;

export const TestimonialDescription = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #FFFFFF;
  margin: 0;
  position: relative;
`;

export const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: auto;
  background: #26272B;
  border-radius: 24px 24px 24px 24px;
  padding: ${theme.spacing.xs};
`;

export const TestimonialAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${theme.colors.primary[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: 18px;
  color: ${theme.colors.primary[700]};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const TestimonialAuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TestimonialAuthorName = styled.p`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: #27B1C5;
  margin: 0;
  font-size: 16px;
`;

export const TestimonialAuthorRole = styled.p`
  font-size: 14px;
  color: #7091B2;
  margin: 0;
`;

