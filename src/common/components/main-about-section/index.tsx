'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import {
  GhostButton,
  HighlightedText,
  MainActions,
  MainContainer,
  MainContent,
  MainDescription,
  MainTitle,
} from './styles';
import { MainAboutSectionProps } from './types';

export const MainAboutSection = ({ className }: MainAboutSectionProps) => {
  const { t } = useTranslation();

  const handleContactClick = () => {
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 120;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToSolutions = () => {
    document.getElementById('solucoes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainContainer className={className}>
      <MainContent>
        <MainTitle>
          {t('mainAboutSection.title')}{' '}
          <HighlightedText>{t('mainAboutSection.titleHighlight')}</HighlightedText>
        </MainTitle>

        <MainDescription>
          {t('mainAboutSection.description')}
        </MainDescription>

        <MainActions>
          <Button size="lg" onClick={handleContactClick}>
            {t('mainAboutSection.button')}
          </Button>
          <GhostButton onClick={scrollToSolutions}>
            {t('mainAboutSection.secondary', 'Ver soluções')}
          </GhostButton>
        </MainActions>
      </MainContent>
    </MainContainer>
  );
};
