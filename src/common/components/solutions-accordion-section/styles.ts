import styled from '@emotion/styled';
import { theme } from '../../theme';

const CLIP = 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 0 100%)';

/* ── Card de solução (slide do carrossel) ───────────────────────── */
export const SolutionCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 28px 26px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 22px;
  clip-path: ${CLIP};
  overflow: hidden;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 22px;
    padding: 1px;
    clip-path: ${CLIP};
    background: linear-gradient(140deg, rgba(84, 218, 137, 0.55), transparent 46%, rgba(10, 150, 236, 0.55));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.55;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 22px 20px;
    border-radius: 16px;
    clip-path: none;
    &::before {
      clip-path: none;
      border-radius: 16px;
    }
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const IconWrapper = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  background: linear-gradient(140deg, rgba(10, 150, 236, 0.32), rgba(84, 218, 137, 0.26));
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 10px 24px rgba(10, 150, 236, 0.2);

  svg {
    width: 26px;
    height: 26px;
  }
`;

export const IconImage = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

export const CardIndex = styled.span`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 46px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -2px;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(84, 218, 137, 0.4);
  pointer-events: none;
`;

export const CardTitle = styled.h3`
  font-family: var(--font-sora), 'Sora', sans-serif;
  font-size: 23px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  font-weight: 800;
  color: #fff;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;

export const CardBody = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  font-family: 'Satoshi', sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: rgba(234, 240, 251, 0.72);
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  /* desvanece o texto no rodapé do card */
  -webkit-mask-image: linear-gradient(180deg, #000 78%, transparent);
  mask-image: linear-gradient(180deg, #000 78%, transparent);

  p {
    margin: 0 0 10px 0;
  }

  ol,
  ul {
    margin: 0 0 10px 20px;
    padding-left: 18px;
    list-style-type: disc;
  }

  strong {
    color: #fff;
    font-weight: 600;
  }

  a {
    color: #54da89;
    text-decoration: underline;
  }
`;

/* ── Seção + carrossel ──────────────────────────────────────────── */
export const SolutionsSectionContainer = styled.section`
  width: 100%;
  padding: 120px 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    width: 720px;
    height: 720px;
    left: 50%;
    top: -180px;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(84, 218, 137, 0.12), transparent 60%);
    filter: blur(20px);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 84px 0;
  }
`;

export const CarouselWrap = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 52px;
  overflow: hidden;
  padding: 0 12px;

  .swiper {
    overflow: visible;
    padding-bottom: 68px;
  }

  .swiper-slide {
    width: 460px;
    height: 430px;
    opacity: 0.38;
    transition: opacity 0.45s ease;
  }
  .swiper-slide-active {
    opacity: 1;
  }
  .swiper-slide-active ${SolutionCard}::before {
    opacity: 1;
  }
  .swiper-slide-active ${SolutionCard} {
    box-shadow: 0 34px 74px rgba(0, 0, 0, 0.5), 0 0 54px rgba(84, 218, 137, 0.12);
  }

  /* setas em chip de vidro */
  .swiper-button-next,
  .swiper-button-prev {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(10px);
    color: #fff;
    transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
  }
  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    background: linear-gradient(135deg, rgba(10, 150, 236, 0.4), rgba(84, 218, 137, 0.4));
    border-color: rgba(84, 218, 137, 0.6);
    transform: scale(1.06);
  }
  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 17px;
    font-weight: 700;
  }

  /* bolinhas de paginação */
  .swiper-pagination {
    bottom: 18px;
  }
  .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.28);
    opacity: 1;
    transition: width 0.3s ease, background 0.3s ease;
  }
  .swiper-pagination-bullet-active {
    width: 26px;
    border-radius: 5px;
    background: linear-gradient(90deg, #0a96ec, #54da89);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-top: 34px;

    .swiper-slide {
      width: 86vw;
      max-width: 360px;
      height: 460px;
    }
  }
`;

export const SolutionsSectionContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
`;

export const SolutionsTitle = styled.h2`
  font-family: var(--font-sora), 'Sora', sans-serif;
  letter-spacing: -1px;
  font-size: clamp(30px, 3.4vw, 48px);
  line-height: 1.1;
  font-weight: 800;
  background: linear-gradient(120deg, #0a96ec, #54da89);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 28px;
  }
`;

export const SolutionsDescription = styled.p`
  font-family: 'Satoshi', sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: rgba(234, 240, 251, 0.7);
  margin: 0 auto;
  max-width: 640px;
  font-weight: ${theme.typography.fontWeight.normal};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;
