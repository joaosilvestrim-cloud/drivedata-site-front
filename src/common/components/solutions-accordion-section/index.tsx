'use client';

import { Container } from '@/common/components/container';
import { LoadingOverlay } from '@/common/components/loading-overlay';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSolutions } from '@/modules/solution/hooks/use-solutions';
import {
  ChevronIcon,
  ExpandedDescription,
  IconImage,
  IconWrapper,
  SolutionDescription,
  SolutionHeaderRow,
  SolutionItem,
  SolutionsDescription,
  SolutionsList,
  SolutionsSectionContainer,
  SolutionsSectionContent,
  SolutionsTitle,
  SolutionTitleText,
} from './styles';
import { SolutionsAccordionSectionProps } from './types';

export const SolutionsAccordionSection = ({ className, solutions }: SolutionsAccordionSectionProps) => {
  const { t } = useTranslation();
  const { data: dynamicSolutions, isLoading } = useSolutions(solutions);
  const [openItem, setOpenItem] = useState<string | null>( null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <SolutionsSectionContainer id="solucoes" className={className}>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay isLoading={isLoading} />
        <Container>
          <SolutionsSectionContent>
            <SolutionsTitle>
              {t('solutionsAccordionSection.title')}
            </SolutionsTitle>

            <SolutionsDescription>
            {t('solutionsAccordionSection.description')}
          </SolutionsDescription>

          <SolutionsList>
            {dynamicSolutions.map((solution) => (
              <SolutionItem
                key={solution.id}
                isOpen={openItem === solution.id}
                onClick={() => toggleItem(solution.id)}
              >
                <SolutionDescription isOpen={openItem === solution.id}>
                  <SolutionHeaderRow>
                    <IconWrapper>
                      {solution.icon ? (
                        <IconImage src={solution.icon} alt="icon" />
                      ) : null}
                    </IconWrapper>
                    <SolutionTitleText>{solution.title}</SolutionTitleText>
                    <ChevronIcon isOpen={openItem === solution.id}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </ChevronIcon>
                  </SolutionHeaderRow>
                </SolutionDescription>
                {openItem === solution.id && (
                  <ExpandedDescription>
                    <div dangerouslySetInnerHTML={{ __html: solution.content }} />
                  </ExpandedDescription>
                )}
              </SolutionItem>
            ))}
          </SolutionsList>
        </SolutionsSectionContent>
      </Container>
    </div>
    </SolutionsSectionContainer>
  );
};

