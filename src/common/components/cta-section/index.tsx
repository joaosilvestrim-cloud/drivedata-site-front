'use client';

import { Button } from '@/common/components/button';
import { Container } from '@/common/components/container';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { useTranslation } from 'react-i18next';
import {
    CtaButtonWrapper,
    CtaDescription,
    CtaSectionContainer,
    CtaSectionContent,
    CtaTitle
} from './styles';
import { CtaSectionProps } from './types';

export const CtaSection = ({ className }: CtaSectionProps) => {
  const { t } = useTranslation();
  const { openTypebot } = useTypebot();

  return (
    <CtaSectionContainer className={className}>
      <Container>
        <CtaSectionContent>
          <CtaTitle>
            {t('ctaSection.title')}
          </CtaTitle>

          <CtaDescription>
            {t('ctaSection.description')}
          </CtaDescription>

          <CtaButtonWrapper>
            <Button size="lg" onClick={openTypebot}>
              {t('ctaSection.button')}
            </Button>
          </CtaButtonWrapper>
        </CtaSectionContent>
      </Container>
    </CtaSectionContainer>
  );
};

