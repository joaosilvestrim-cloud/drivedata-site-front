'use client';

import { Container } from '@/common/components/container';
import { useTranslation } from 'react-i18next';
import {
  AcademyBadge,
  AcademyButton,
  AcademyCard,
  AcademyDescription,
  AcademySectionContainer,
  AcademyText,
  AcademyTitle,
} from './styles';

const ACADEMY_URL = 'https://academy.drivedata.com.br/';

export const AcademySection = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  return (
    <AcademySectionContainer className={className}>
      <Container>
        <AcademyCard>
          <AcademyText>
            <AcademyBadge>🎓 {t('academySection.badge')}</AcademyBadge>
            <AcademyTitle>{t('academySection.title')}</AcademyTitle>
            <AcademyDescription>{t('academySection.description')}</AcademyDescription>
          </AcademyText>
          <AcademyButton href={ACADEMY_URL} target="_blank" rel="noopener noreferrer">
            {t('academySection.button')} ↗
          </AcademyButton>
        </AcademyCard>
      </Container>
    </AcademySectionContainer>
  );
};
