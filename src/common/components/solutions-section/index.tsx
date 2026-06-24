'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/common/components/button';
import { Container } from '@/common/components/container';
import { useTypebot } from '@/common/providers/TypebotProvider';
import Image from 'next/image';
import {
  CardDescription,
  CardTitle,
  CTAButtonWrapper,
  HighlightedText,
  IconWrapper,
  SolutionCard,
  SolutionsDescription,
  SolutionsGrid,
  SolutionsSectionContainer,
  SolutionsSectionContent,
  SolutionsTitle
} from './styles';
import { SolutionsSectionProps } from './types';

export const SolutionsSection = ({ className }: SolutionsSectionProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { openTypebot } = useTypebot();

  const solutions = [
    {
      id: 'aumentar-receita',
      icon: '/paper-money.svg',
      title: t('solutionsSection.solutions.aumentarReceita.title'),
      description: t('solutionsSection.solutions.aumentarReceita.description'),
    },
    {
      id: 'reduzir-custos',
      icon: '/money.svg',
      title: t('solutionsSection.solutions.reduzirCustos.title'),
      description: t('solutionsSection.solutions.reduzirCustos.description'),
    },
    {
      id: 'ganhar-agilidade',
      icon: '/timer.svg',
      title: t('solutionsSection.solutions.ganharAgilidade.title'),
      description: t('solutionsSection.solutions.ganharAgilidade.description'),
    },
    {
      id: 'liberar-tempo',
      icon: '/clock.svg',
      title: t('solutionsSection.solutions.liberarTempo.title'),
      description: t('solutionsSection.solutions.liberarTempo.description'),
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = sectionRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          setIsVisible(true);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleOpenTypebot = () => {
    openTypebot();
  };

  return (
    <SolutionsSectionContainer id="solucoes" ref={sectionRef} className={className} data-animate={isVisible}>
      <Container>
        <SolutionsSectionContent data-animate={isVisible}>
          <SolutionsTitle data-animate={isVisible}>
            {t('solutionsSection.titlePart1')}{' '}
            {t('solutionsSection.titlePart2')}{' '}
            <HighlightedText data-animate={isVisible}>{t('solutionsSection.titleHighlight')}</HighlightedText>
          </SolutionsTitle>

          <SolutionsDescription data-animate={isVisible}>
            {t('solutionsSection.description')}
          </SolutionsDescription>

          <SolutionsGrid data-animate={isVisible}>
            {solutions.map((solution, index) => (
              <SolutionCard key={solution.id} data-animate={isVisible} data-order={index}>
                <IconWrapper data-animate={isVisible}>
                  <Image
                    src={solution.icon}
                    alt={solution.title}
                    width={32}
                    height={32}
                    loading="lazy"
                  />
                </IconWrapper>
                <CardTitle data-animate={isVisible}>{solution.title}</CardTitle>
                <CardDescription data-animate={isVisible}>{solution.description}</CardDescription>
              </SolutionCard>
            ))}
          </SolutionsGrid>

          <CTAButtonWrapper data-animate={isVisible}>
            <Button size="lg" onClick={handleOpenTypebot}>
              {t('solutionsSection.button')}
            </Button>
          </CTAButtonWrapper>
        </SolutionsSectionContent>
      </Container>
    </SolutionsSectionContainer>
  );
};
