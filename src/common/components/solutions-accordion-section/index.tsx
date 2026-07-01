'use client';

import { Container } from '@/common/components/container';
import { LoadingOverlay } from '@/common/components/loading-overlay';
import { useSolutions } from '@/modules/solution/hooks/use-solutions';
import { useTranslation } from 'react-i18next';
import { Autoplay, EffectCoverflow, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  CardBody,
  CardIndex,
  CardTitle,
  CardTop,
  CarouselWrap,
  IconImage,
  IconWrapper,
  SolutionCard,
  SolutionsSectionContainer,
  SolutionsSectionContent,
  SolutionsDescription,
  SolutionsTitle,
} from './styles';
import { SolutionsAccordionSectionProps } from './types';

export const SolutionsAccordionSection = ({ className, solutions }: SolutionsAccordionSectionProps) => {
  const { t } = useTranslation();
  const { data: dynamicSolutions, isLoading } = useSolutions(solutions);

  return (
    <SolutionsSectionContainer id="solucoes" className={className}>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay isLoading={isLoading} />
        <Container>
          <SolutionsSectionContent>
            <SolutionsTitle>{t('solutionsAccordionSection.title')}</SolutionsTitle>
            <SolutionsDescription>
              {t('solutionsAccordionSection.description')}
            </SolutionsDescription>
          </SolutionsSectionContent>
        </Container>

        <CarouselWrap>
          <Swiper
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay, Keyboard]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop={dynamicSolutions.length > 2}
            slidesPerView="auto"
            keyboard={{ enabled: true }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 170, modifier: 2, slideShadows: false }}
          >
            {dynamicSolutions.map((solution, index) => (
              <SwiperSlide key={solution.id}>
                <SolutionCard>
                  <CardTop>
                    <IconWrapper>
                      {solution.icon ? <IconImage src={solution.icon} alt="icon" /> : null}
                    </IconWrapper>
                    <CardIndex>{String(index + 1).padStart(2, '0')}</CardIndex>
                  </CardTop>
                  <CardTitle>{solution.title}</CardTitle>
                  <CardBody dangerouslySetInnerHTML={{ __html: solution.content }} />
                </SolutionCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </CarouselWrap>
      </div>
    </SolutionsSectionContainer>
  );
};
