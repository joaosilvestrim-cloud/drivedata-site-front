'use client';

import { Container } from '@/common/components/container';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import {
  DevicesItem,
  DevicesItemButton,
  DevicesItemContent,
  DevicesItemDescription,
  DevicesItemTitle,
  DevicesSectionContainer,
  DevicesSectionContent
} from './styles';
import { DevicesShowcaseSectionProps } from './types';

export const DevicesShowcaseSection = ({ className }: DevicesShowcaseSectionProps) => {
  const { t } = useTranslation();
  const { openTypebot } = useTypebot();

  const handleAnalisisClick = () => {
    openTypebot();
  };

  return (
    <DevicesSectionContainer className={className}>
      <Container>
        <DevicesSectionContent>
          <DevicesItem contentSide="left">
            <DevicesItemContent>
            <DevicesItemTitle>
              {t('devicesShowcaseSection.aiDashboard.title')}
            </DevicesItemTitle>
            <DevicesItemDescription>
            {t('devicesShowcaseSection.aiDashboard.description')}
            </DevicesItemDescription>
            <DevicesItemButton onClick={handleAnalisisClick}>
              {t('devicesShowcaseSection.aiDashboard.button')}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8V4M20 4H16M20 4L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </DevicesItemButton>
            </DevicesItemContent>
            <Image
              src="/notebook-mobile.png"
              alt="Dashboard em notebook"
              width={501}
              height={336}
              loading="lazy"
              quality={85}
            />
          </DevicesItem>
          <DevicesItem contentSide="right">
            <Image
              src="/notebook.png"
              alt="Dashboard em notebook"
              width={439}
              height={297}
              loading="lazy"
              quality={85}
            />
            <DevicesItemContent>
            <DevicesItemTitle>
            {t('devicesShowcaseSection.pickingList.title')}
            </DevicesItemTitle>
            <DevicesItemDescription>
            {t('devicesShowcaseSection.pickingList.description')}
            </DevicesItemDescription>
            <DevicesItemButton variant="outlined" onClick={handleAnalisisClick}>
            {t('devicesShowcaseSection.pickingList.button')}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8V4M20 4H16M20 4L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            </DevicesItemButton>
            </DevicesItemContent>
          </DevicesItem>
          <DevicesItem contentSide="left">
            <DevicesItemContent>
            <DevicesItemTitle>
            {t('devicesShowcaseSection.driveDex.title')}
            </DevicesItemTitle>
            <DevicesItemDescription>
            {t('devicesShowcaseSection.driveDex.description')}
            </DevicesItemDescription>
            <DevicesItemButton variant="outlined" onClick={handleAnalisisClick}>
            {t('devicesShowcaseSection.driveDex.button')}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8V4M20 4H16M20 4L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            </DevicesItemButton>
            </DevicesItemContent>
            <Image
              src="/mobile.png"
              alt="Dashboard em notebook"
              width={410}
              height={383}
              loading="lazy"
              quality={85}
            />
          </DevicesItem>
        </DevicesSectionContent>
      </Container>
    </DevicesSectionContainer>
  );
};


