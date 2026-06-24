'use client';

import { Container } from '@/common/components/container';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PartnerLogo,
  PartnersGrid,
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

// Componente individual para cada logo com seu próprio observer
const PartnerLogoItem = ({ logo, index }: { logo: string; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !logoRef.current) {
      return;
    }

    const element = logoRef.current;
    let observer: IntersectionObserver | null = null;

    // Verifica se já está visível
    const checkInitialVisibility = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        setIsVisible(true);
        return true;
      }
      return false;
    };

    // Configura o observer
    const setupObserver = () => {
      if (checkInitialVisibility()) {
        return;
      }

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
          threshold: 0.1,
          rootMargin: '50px 0px',
        },
      );

      observer.observe(element);
    };

    const rafId = requestAnimationFrame(() => {
      setupObserver();
    });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <PartnerLogo ref={logoRef} data-animate={isVisible} data-index={index}>
      <Image
        src={`/partners/${logo}`}
        alt={`Parceiro ${index + 1}`}
        width={150}
        height={80}
        loading="lazy"
        quality={75}
        unoptimized
      />
    </PartnerLogo>
  );
};

// Lista de todos os logos de parceiros
const partnerLogos = [
  'android-chrome-512x512.png',
  'Ativo 1 1.png',
  'image 27993.png',
  'image 27995.png',
  'image 27996.png',
  'image 27997 1.png',
  'image 27998.png',
  'image 27999.png',
  'image 28002.png',
  'image 28003.png',
  'image 28004.png',
  'image 28005.png',
  'image 28008.png',
  'image 28009-1.png',
  'image 28009-2.png',
  'image 28009.png',
  'image 28010.png',
  'image 28011.png',
  'image 28012.png',
  'image 28013.png',
  'image 28014.png',
  'image 28015.png',
  'image 28016.png',
  'image 28017.png',
  'image 28018.png',
  'image 28020.png',
  'image 28022.png',
  'image 28023.png',
  'image 28043 1.png',
  'image 28044 1.png',
  'Logo-Eureca-preferencial-2 1.png',
  'Logomarca-Rei-das-Canecas-_-Aplicacao-em-cores_Branco-994x1024.png',
  'mcdonald-s-transparent-mcdonald-s-free-free-png.png',
  'Vector.png',
  'VISA LOGO.png'

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

            <PartnersGrid data-animate={isVisible}>
              {partnerLogos.map((logo, index) => (
                <PartnerLogoItem key={logo} logo={logo} index={index} />
              ))}
            </PartnersGrid>
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
