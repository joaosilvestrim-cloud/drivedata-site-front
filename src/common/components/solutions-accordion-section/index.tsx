'use client';

import { Container } from '@/common/components/container';
import { LoadingOverlay } from '@/common/components/loading-overlay';
import { useSolutions } from '@/modules/solution/hooks/use-solutions';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SolAnswer,
  SolChevron,
  SolHeaderRow,
  SolIcon,
  SolItem,
  SolList,
  SolTitle,
  SolutionsSectionContainer,
  SolutionsSectionContent,
  SolutionsDescription,
  SolutionsTitle,
} from './styles';
import { SolutionsAccordionSectionProps } from './types';

const ChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FIRST = '__first__';

export const SolutionsAccordionSection = ({ className, solutions }: SolutionsAccordionSectionProps) => {
  const { t } = useTranslation();
  const { data: dynamicSolutions, isLoading } = useSolutions(solutions);
  // '__first__' = estado inicial (abre o primeiro item); '' = todos fechados.
  const [openId, setOpenId] = useState<string>(FIRST);

  const effectiveOpen = openId === FIRST ? dynamicSolutions[0]?.id : openId;

  const toggle = (id: string) => {
    setOpenId((cur) => {
      const eff = cur === FIRST ? dynamicSolutions[0]?.id : cur;
      return eff === id ? '' : id;
    });
  };

  return (
    <SolutionsSectionContainer id="solucoes" className={className}>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay isLoading={isLoading} />
        <Container>
          <SolutionsSectionContent>
            <SolutionsTitle>{t('solutionsAccordionSection.title')}</SolutionsTitle>
            <SolutionsDescription>
              {t('solutionsAccordionSection.description')}
            </SolutionsDescription>
          </SolutionsSectionContent>

          <SolList>
            {dynamicSolutions.map((s) => {
              const isOpen = effectiveOpen === s.id;
              return (
                <SolItem key={s.id} isOpen={isOpen} onClick={() => toggle(s.id)}>
                  <SolHeaderRow>
                    {s.icon && (
                      <SolIcon>
                        <img src={s.icon} alt="" />
                      </SolIcon>
                    )}
                    <SolTitle isOpen={isOpen}>{s.title}</SolTitle>
                    <SolChevron isOpen={isOpen}>
                      <ChevronDown />
                    </SolChevron>
                  </SolHeaderRow>
                  {isOpen && s.content && (
                    <SolAnswer dangerouslySetInnerHTML={{ __html: s.content }} />
                  )}
                </SolItem>
              );
            })}
          </SolList>
        </Container>
      </div>
    </SolutionsSectionContainer>
  );
};
