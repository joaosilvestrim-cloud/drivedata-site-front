'use client';

import { Container } from '@/common/components/container';
import { LoadingOverlay } from '@/common/components/loading-overlay';
import { TestimonialCard } from '@/common/components/testimonials-section/testimonial-card';
import { useTestimonials } from '@/modules/testimonial/hooks/use-testimonials';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  TestimonialsSectionContainer,
  TestimonialsSectionHeader,
  TestimonialsSectionSubtitle,
  TestimonialsSectionTitle,
} from './styles';
import { TestimonialsSectionProps } from './types';

export const TestimonialsSection = ({
  className,
  testimonials,
}: TestimonialsSectionProps) => {
  const { t } = useTranslation();
  const { data: dynamicTestimonials, isLoading } = useTestimonials(testimonials);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current && dynamicTestimonials.length > 0) {
      const timer = setTimeout(() => {
        if (swiperRef.current) {
          swiperRef.current.slideToLoop(0, 0);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [dynamicTestimonials.length]);

  // Duplica os testimonials para garantir loop infinito
  const duplicatedTestimonials = dynamicTestimonials.length > 0 
    ? [...dynamicTestimonials, ...dynamicTestimonials, ...dynamicTestimonials]
    : [];

  return (
    <TestimonialsSectionContainer id="clientes" className={className}>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay isLoading={isLoading} />
        <Container>
          <TestimonialsSectionHeader>
            <TestimonialsSectionTitle>
              {t('testimonialsSection.title')}
            </TestimonialsSectionTitle>
            <TestimonialsSectionSubtitle>
              {t('testimonialsSection.subtitle')}
            </TestimonialsSectionSubtitle>
          </TestimonialsSectionHeader>
          <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[]}
          spaceBetween={48}
          slidesPerView={'auto'}
          speed={600}
          loop={true}
          loopAdditionalSlides={3}
          grabCursor={true}
          allowTouchMove={true}
          touchEventsTarget="container"
          centeredSlides={false}
          watchSlidesProgress={true}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 16,
              speed: 500,
            },
            640: {
              slidesPerView: 'auto',
              spaceBetween: 24,
              speed: 600,
            },
            1024: {
              slidesPerView: 'auto',
              spaceBetween: 48,
              speed: 600,
            },
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <SwiperSlide key={`testimonial-${index}`}>
              <TestimonialCard {...testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
    </TestimonialsSectionContainer>
  );
};