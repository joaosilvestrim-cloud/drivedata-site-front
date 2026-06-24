'use client';

import { Container } from "@/common/components/container";
import { PreviewSolutionCard } from "@/common/components/preview-solutions-section/preview-solution-card";
import { PreviewSolutionsSectionContainer } from "@/common/components/preview-solutions-section/styles";
import { PreviewSolutionCardProps, PreviewSolutionsSectionProps } from "@/common/components/preview-solutions-section/types";
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

export const PreviewSolutionsSection = ({ className }: PreviewSolutionsSectionProps) => {
  const { t } = useTranslation();

  const solutionCards: PreviewSolutionCardProps[] = [
    {
      backgroundImage: "/preview-bg-mccain.png",
      title: t('previewSolutionsSection.cards.mccain'),
      logo: {
        src: "/mc-cain.png",
        alt: "McCain",
        width: 194,
        height: 112,
      },
      gridColumns: "285px 1fr",
      mockupImage: {
        src: "/mockup-mcclain.png",
        alt: "McCain Mockup",
        width: 542,
        height: 361,
      },
      imagePositionMobile: {
        bottom: "-80px",
        right: "-80px",
      },
    },
    {
      backgroundImage: "/preview-bg-erp.png",
      title: t('previewSolutionsSection.cards.erp'),
      mockupImage: {
        src: "/mockup-erp.png",
        alt: "ERP Mockup",
        width: 542,
        height: 361,
      },
      gridColumns: "380px",
      imagePosition: {
        bottom: "-150px",
        right: "-190px",
      },
      imagePositionMobile: {
        bottom: "-80px",
        right: "-80px",
      },
    },
    {
      backgroundImage: "/preview-bg-pepsico.png",
      title: t('previewSolutionsSection.cards.pepsico'),
      logo: {
        src: "/pepsico.png",
        alt: "Pepsico",
        width: 182,
        height: 53,
      },
      gridColumns: "347px 1fr",
      imagePosition: {
        bottom: "-120px",
        right: "-270px",
        rotate: "-16deg",
      },
      mockupImage: {
        src: "/mockup-notebook.png",
        alt: "Pepsico Mockup",
        width: 542,
        height: 361,
      },
      imagePositionMobile: {
        bottom: "-90px",
        right: "-80px",
      },
    },
    {
      backgroundImage: "/preview-bg-darwin.png",
      title: t('previewSolutionsSection.cards.darwin'),
      logo: {
        src: "/logo-darwin.png",
        alt: "Darwin",
        width: 233,
        height: 64,
      },
      mockupImage: {
        src: "/mockup-notebook-tablet.png",
        alt: "Darwin Mockup",
        width: 542,
        height: 361,
      },
      gridColumns: "218px 1fr",
      imagePosition: {
        bottom: "-120px",
        right: "-170px",
      },
      imagePositionMobile: {
        bottom: "-80px",
        right: "-80px",
      },
    },
  ];

  return (
    <PreviewSolutionsSectionContainer className={className}>
      <Container>
        <Swiper
          // modules={[Autoplay]}
          spaceBetween={96}
          slidesPerView={2}
          // autoplay={{
          //   delay: 5000,
          //   disableOnInteraction: false,
          // }}
          loop={true}
          grabCursor={true}
          allowTouchMove={true}
          touchEventsTarget="container"
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 96,
            },
          }}
        >
          {solutionCards.map((card, index) => (
            <SwiperSlide key={index}>
              <PreviewSolutionCard {...card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </PreviewSolutionsSectionContainer>
  );
};