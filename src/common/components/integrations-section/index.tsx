'use client';

import { Container } from '@/common/components/container';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import {
    IntegrationsDescription,
    IntegrationsHeader,
    IntegrationsImageWrapper,
    IntegrationsSectionContainer,
    IntegrationsSectionContent,
    IntegrationsTitle,
    IntegrationsTitleHighlight
} from './styles';
import { IntegrationsSectionProps } from './types';

export const IntegrationsSection = ({ className }: IntegrationsSectionProps) => {
  const { t } = useTranslation();

  return (
    <IntegrationsSectionContainer className={className}>
      <Container>
        <IntegrationsSectionContent>
          <IntegrationsHeader>
            <IntegrationsTitle>
              {t('integrationsSection.title')} <IntegrationsTitleHighlight>{t('integrationsSection.titleHighlight')}</IntegrationsTitleHighlight>
            </IntegrationsTitle>
            <IntegrationsDescription>
              {t('integrationsSection.description')}
            </IntegrationsDescription>
          </IntegrationsHeader>

          <IntegrationsImageWrapper>
            <Image
              src="/integration.png"
              alt="Integrações com diversas plataformas"
              width={1200}
              height={700}
              priority
            />
          </IntegrationsImageWrapper>
        </IntegrationsSectionContent>
      </Container>
    </IntegrationsSectionContainer>
  );
};

