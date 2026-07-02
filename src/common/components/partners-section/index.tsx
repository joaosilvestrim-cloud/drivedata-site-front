'use client';

import { Container } from '@/common/components/container';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PartnersMarquee,
  PartnersMarqueeLogo,
  PartnersMarqueeTrack,
  PartnersHeader,
  PartnersSectionContainer,
  PartnersSectionContent,
  PartnersSubtitle,
  PartnersTitle,
  ResultButton,
  ResultsButtons,
  ResultsContent,
  ResultsDescription,
  ResultsImageWrapper,
  ResultsSection,
  ResultsTitle,
  ResultsTitleBlue,
} from './styles';
import { PartnersSectionProps } from './types';

// Logos de clientes (SVG exportados do Figma) em /public/clientes.
const partnerLogos = [
  'Camada_1.svg',
  'FROSTY_portal 1.svg',
  'Group 1707489281.svg',
  'image 27993.svg',
  'image 27996.svg',
  'image 27997 1.svg',
  'image 27998.svg',
  'image 27999.svg',
  'image 28000.svg',
  'image 28002.svg',
  'image 28003.svg',
  'image 28004.svg',
  'image 28005.svg',
  'image 28006.svg',
  'image 28008.svg',
  'image 28009.svg',
  'image 28010.svg',
  'image 28011.svg',
  'image 28012.svg',
  'image 28013.svg',
  'image 28014.svg',
  'image 28015.svg',
  'image 28016.svg',
  'image 28017.svg',
  'image 28018.svg',
  'image 28019.svg',
  'image 28020.svg',
  'image 28021.svg',
  'image 28023.svg',
  'image 28024.svg',
  'image 28025.svg',
  'layer1.svg',
  'PEP-a33c9cf1 1.svg',
  'VISA LOGO 1.svg',
];

export const PartnersSection = ({ className }: PartnersSectionProps) => {
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

    let observer: IntersectionObserver | null = null;
    let rafId: number | null = null;

    // Verifica se o elemento já está visível quando o componente monta
    const checkInitialVisibility = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      // Se qualquer parte do elemento já está visível na viewport (mesmo que parcialmente)
      // Ativa a animação imediatamente para evitar a "faixa branca"
      if (elementTop < windowHeight && elementBottom > 0) {
        setIsVisible(true);
        return true;
      }
      return false;
    };

    // Função para configurar o observer
    const setupObserver = () => {
      // Se já está visível, não precisa do observer
      if (checkInitialVisibility()) {
        return;
      }

      // Se não está visível inicialmente, cria o observer para detectar quando entrar na viewport
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              if (observer) {
                observer.unobserve(entry.target);
              }
            }
          });
        },
        {
          threshold: 0.1, // Reduzido para ativar mais cedo
          rootMargin: '50px 0px -10% 0px', // Adiciona margem superior para ativar antes
        },
      );

      observer.observe(element);
    };

    // Usa requestAnimationFrame para garantir que o DOM está renderizado
    rafId = requestAnimationFrame(() => {
      setupObserver();
    });

    // Também verifica quando a página terminar de carregar (para garantir que o layout foi calculado)
    const handleLoad = () => {
      // Verifica novamente se ficou visível após o carregamento completo
      if (checkInitialVisibility()) {
        // Se ficou visível após o carregamento, cancela o observer
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    };

    // Se a página já carregou, verifica imediatamente
    if (document.readyState === 'complete') {
      // Usa setTimeout para garantir que é executado após o requestAnimationFrame
      setTimeout(handleLoad, 0);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <PartnersSectionContainer
      ref={sectionRef}
      className={className}
      data-animate={isVisible}
    >
      <Container>
        <PartnersSectionContent data-animate={isVisible}>
          {/* Seção de Parceiros */}
          <div>
            <PartnersHeader data-animate={isVisible}>
              <PartnersTitle data-animate={isVisible}>
                {t('partnersSection.partnersTitle')}
              </PartnersTitle>
              <PartnersSubtitle data-animate={isVisible}>
                {t('partnersSection.partnersSubtitle')}
              </PartnersSubtitle>
            </PartnersHeader>

            <PartnersMarquee>
              <PartnersMarqueeTrack className="marquee-track">
                {[0, 1].map((dup) =>
                  partnerLogos.map((logo, index) => (
                    <PartnersMarqueeLogo key={`${dup}-${logo}`} aria-hidden={dup === 1}>
                      <Image
                        src={`/clientes/${logo}`}
                        alt={`Parceiro ${index + 1}`}
                        width={150}
                        height={80}
                        loading="lazy"
                        quality={75}
                        unoptimized
                      />
                    </PartnersMarqueeLogo>
                  )),
                )}
              </PartnersMarqueeTrack>
            </PartnersMarquee>
          </div>

          {/* Seção de Resultados */}
          <ResultsSection data-animate={isVisible}>
            <ResultsImageWrapper data-animate={isVisible}>
              <Image
                src="/tamires-back.png"
                alt="Transformando dados em resultados"
                width={491}
                height={318}
                loading="lazy"
                quality={80}
                unoptimized
              />
              <ResultsButtons data-animate={isVisible}>
                <ResultButton data-animate={isVisible} data-order={0}>
                  {t('partnersSection.clientsImpacted')}
                </ResultButton>
                <ResultButton data-animate={isVisible} data-order={1}>
                  {t('partnersSection.solutionsDelivered')}
                </ResultButton>
              </ResultsButtons>
            </ResultsImageWrapper>

            <ResultsContent data-animate={isVisible}>
              <ResultsTitle data-animate={isVisible}>
                {t('partnersSection.resultsTitle')}{' '}
                <ResultsTitleBlue>
                  {t('partnersSection.resultsTitleHighlight')}
                </ResultsTitleBlue>
              </ResultsTitle>

              <ResultsDescription data-animate={isVisible}>
                {t('partnersSection.resultsDescription')}
              </ResultsDescription>
            </ResultsContent>
          </ResultsSection>
        </PartnersSectionContent>
      </Container>
    </PartnersSectionContainer>
  );
};
