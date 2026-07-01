import styled from '@emotion/styled';
import { theme } from '../../theme';

export const TestimonialsSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['4xl']} 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 8%;
    left: 50%;
    transform: translateX(-50%);
    width: 720px;
    height: 420px;
    background: radial-gradient(
      ellipse at center,
      rgba(84, 218, 137, 0.12),
      transparent 70%
    );
    filter: blur(80px);
    z-index: 0;
    pointer-events: none;
  }

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
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: #fff;
  margin: 0 0 ${theme.spacing.md} 0;
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

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
  color: rgba(234, 240, 251, 0.7);
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 16px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

export const TestimonialCardContainer = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: ${theme.spacing['2xl']};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  width: 490px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(
      150deg,
      rgba(84, 218, 137, 0.4),
      transparent 46%,
      rgba(10, 150, 236, 0.4)
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &::after {
    content: '\\201C';
    position: absolute;
    top: 12px;
    right: 24px;
    font-family: Georgia, serif;
    font-size: 96px;
    line-height: 1;
    color: rgba(84, 218, 137, 0.12);
    pointer-events: none;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 28px 56px rgba(0, 0, 0, 0.45);
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
  color: rgba(234, 240, 251, 0.82);
  margin: 0;
  position: relative;
  z-index: 1;
`;

export const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: ${theme.spacing.xs};
  position: relative;
  z-index: 1;
`;

export const TestimonialAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(10, 150, 236, 0.35), rgba(84, 218, 137, 0.35));
  border: 2px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: 18px;
  color: #fff;
  overflow: hidden;
  flex-shrink: 0;

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
  color: #fff;
  margin: 0;
  font-size: 16px;
`;

export const TestimonialAuthorRole = styled.p`
  font-size: 14px;
  color: rgba(234, 240, 251, 0.55);
  margin: 0;
`;

