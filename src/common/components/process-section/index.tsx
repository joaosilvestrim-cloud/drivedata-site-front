'use client';

import { Container } from '@/common/components/container';
import { useTranslation } from 'react-i18next';
import {
  ProcessCard,
  ProcessCardWrapper,
  ProcessGrid,
  ProcessHeader,
  ProcessSectionContainer,
  ProcessSectionContent,
  ProcessSubtitle,
  ProcessTitle,
  StepDescription,
  StepNumber,
  StepTitle
} from './styles';
import { ProcessSectionProps } from './types';

export const ProcessSection = ({ className }: ProcessSectionProps) => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      number: '1',
      title: t('processSection.steps.step1.title'),
      description: t('processSection.steps.step1.description'),
    },
    {
      id: 2,
      number: '2',
      title: t('processSection.steps.step2.title'),
      description: t('processSection.steps.step2.description'),
    },
    {
      id: 3,
      number: '3',
      title: t('processSection.steps.step3.title'),
      description: t('processSection.steps.step3.description'),
    },
  ];
  return (
    <ProcessSectionContainer className={className}>
      <Container>
        <ProcessSectionContent>
          <ProcessHeader>
            <ProcessTitle>
              {t('processSection.title')}
            </ProcessTitle>
            <ProcessSubtitle>
              {t('processSection.subtitle')}
            </ProcessSubtitle>
          </ProcessHeader>

          <ProcessGrid>
            {steps.map((step) => (
              <ProcessCardWrapper key={step.id}>
                <StepNumber>{step.number}</StepNumber>
                <ProcessCard>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </ProcessCard>
              </ProcessCardWrapper>
            ))}
          </ProcessGrid>
        </ProcessSectionContent>
      </Container>
    </ProcessSectionContainer>
  );
};

