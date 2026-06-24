'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Container } from '@/common/components/container';
import {
  ChaosDescription,
  ChaosGrid,
  ChaosSectionContainer,
  ChaosSectionContent,
  ChaosTextContent,
  ChaosTitle,
  HighlightedText,
} from './styles';
import { ChaosSectionProps } from './types';

export const ChaosSection = ({ className }: ChaosSectionProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = contentRef.current;

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

  return (
    <ChaosSectionContainer className={className} data-visible={isVisible}>
      <Container>
        <ChaosSectionContent ref={contentRef} data-visible={isVisible}>
          <ChaosGrid data-visible={isVisible}>
            <div />

            <ChaosTextContent data-visible={isVisible}>
              <ChaosTitle>
                {t('chaosSection.title')}{' '}
                <HighlightedText>{t('chaosSection.titleHighlight')}</HighlightedText>
              </ChaosTitle>

              <ChaosDescription>
                {t('chaosSection.description')}
              </ChaosDescription>
            </ChaosTextContent>
          </ChaosGrid>
        </ChaosSectionContent>
      </Container>
    </ChaosSectionContainer>
  );
};

