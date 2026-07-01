'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import {
  Eyebrow,
  GhostButton,
  HighlightedText,
  MainActions,
  MainContainer,
  MainContent,
  MainDescription,
  MainTitle,
  TechPill,
  TechRow,
} from './styles';
import { MainAboutSectionProps } from './types';

const TECHS = ['BI', 'Analytics', 'IA', 'Engenharia de Dados'];

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
        <Eyebrow>
          <span className="dot" />
          {t('mainAboutSection.eyebrow', 'Sobre a DriveData')}
        </Eyebrow>

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

        <TechRow>
          {TECHS.map((tech) => (
            <TechPill key={tech}>{tech}</TechPill>
          ))}
        </TechRow>
      </MainContent>
    </MainContainer>
  );
};
