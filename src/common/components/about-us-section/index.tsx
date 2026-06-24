'use client';

import { Container } from '@/common/components/container';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  AboutUsContent,
  AboutUsDescription,
  AboutUsGrid,
  AboutUsSectionContainer,
  AboutUsSectionContent,
  AboutUsSlogan,
  AboutUsSubtitle,
  AboutUsTitle,
  AboutUsTitleHighlight,
  FounderBio,
  FounderInfo,
  FounderName,
  FounderRole,
  FounderSeal,
} from './styles';
import { AboutUsSectionProps } from './types';

export const AboutUsSection = ({ className }: AboutUsSectionProps) => {
  const { t } = useTranslation();

  return (
    <AboutUsSectionContainer className={className}>
      <Container>
        <AboutUsSectionContent>
          <AboutUsGrid>
            {/* Left side - Founder Info */}
            <FounderInfo>
              <FounderName>{t('aboutUsSection.founderName')}</FounderName>
              <FounderRole>{t('aboutUsSection.founderRole')}</FounderRole>
              <FounderBio>{t('aboutUsSection.founderBio')}</FounderBio>
              <FounderSeal>
                <Image
                  src="/microsoftPartner.png"
                  alt="microsoft partner"
                  width={215}
                  height={52}
                  loading="lazy"
                  quality={85}
                />
              </FounderSeal>
            </FounderInfo>

            {/* Right side - About Us Card */}
            <AboutUsContent>
              <AboutUsTitle>
                <AboutUsTitleHighlight>
                  {t('aboutUsSection.title')}
                </AboutUsTitleHighlight>
              </AboutUsTitle>
              <AboutUsSubtitle>{t('aboutUsSection.subtitle')}</AboutUsSubtitle>
              <AboutUsDescription>
                {t('aboutUsSection.description')}
              </AboutUsDescription>
              <AboutUsSlogan>{t('aboutUsSection.slogan')}</AboutUsSlogan>
            </AboutUsContent>
          </AboutUsGrid>
        </AboutUsSectionContent>
      </Container>
    </AboutUsSectionContainer>
  );
};
