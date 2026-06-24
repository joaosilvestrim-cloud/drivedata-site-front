'use client';

import { useTypebot } from '@/common/providers/TypebotProvider';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import {
  HighlightedText,
  MainActions,
  MainContainer,
  MainContent,
  MainTitle,
} from './styles';
import { MainSectionProps } from './types';

export const MainSection = ({ className }: MainSectionProps) => {
  const { t } = useTranslation();
  const { openTypebot } = useTypebot();

  const handleDemoClick = () => {
    openTypebot();
  };

  return (
    <MainContainer className={className}>
      <MainContent>
        <MainTitle>
          {t('mainSection.title')}{' '}
          <HighlightedText>{t('mainSection.titleHighlight')}</HighlightedText>
        </MainTitle>

        <MainActions>
          <Button size="lg" onClick={handleDemoClick}>
            {t('mainSection.button')}
          </Button>
        </MainActions>
      </MainContent>
    </MainContainer>
  );
};
