'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Container } from '@/common/components/container';
import Image from 'next/image';
import {
  ClientCard,
  ClientLogoOverlay,
  ClientsGrid,
  ClientsHeader,
  ClientsHeaderContent,
  ClientsSectionContainer,
  ClientsSectionContent,
  ClientsSubtitle,
  ClientsTitle,
  HighlightedText,
  HighlightedTextBlue
} from './styles';
import { ClientsSectionProps } from './types';

const clients = [
  {
    id: 'macdonalds',
    name: 'MacDonalds',
    logo: '/mac.png',
    background: '/bg-mac.png',
    color: '#FF595C', // Vermelho
  },
  {
    id: 'pepsico',
    name: 'PepsiCo',
    logo: '/pepsico.png',
    background: '/bg-pepsico.png',
    color: '#0066CC', // Azul mais escuro
  },
  {
    id: 'mc-cain',
    name: 'McCain',
    logo: '/mc-cain.png',
    background: '/bg-mc-cain.png',
    color: '#D4AF37', // Amarelo dourado mais suave
  },
];

export const ClientsSection = ({ className }: ClientsSectionProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = sectionRef.current;

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
    <ClientsSectionContainer ref={sectionRef} className={className} data-animate={isVisible}>
      <Container>
        <ClientsSectionContent data-animate={isVisible}>
          <ClientsHeader data-animate={isVisible}>
              <Image
                src="/drive-data-icon.png"
                alt="DriveData"
                width={155}
                height={128}
                loading="lazy"
                quality={85}
                unoptimized
              />
            <ClientsHeaderContent>
            <ClientsTitle>
            <HighlightedTextBlue>{t('clientsSection.titlePart1')}</HighlightedTextBlue>{' '}
              <HighlightedText>{t('clientsSection.titlePart2')}</HighlightedText>
            </ClientsTitle>
            <ClientsSubtitle data-animate={isVisible}>
              {t('clientsSection.subtitle')}
            </ClientsSubtitle>
            </ClientsHeaderContent>
          </ClientsHeader>

          <ClientsGrid data-animate={isVisible}>
            {clients.map((client, index) => (
              <ClientCard
                key={client.id}
                backgroundImage={client.background}
                overlayColor={client.color}
                data-animate={isVisible}
                data-order={index}
              >
                <ClientLogoOverlay data-animate={isVisible}>
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
                    loading="lazy"
                    quality={85}
                    unoptimized
                  />
                </ClientLogoOverlay>
              </ClientCard>
            ))}
          </ClientsGrid>
        </ClientsSectionContent>
      </Container>
    </ClientsSectionContainer>
  );
};

