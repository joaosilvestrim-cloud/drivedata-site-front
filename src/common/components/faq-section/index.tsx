'use client';

import { Container } from '@/common/components/container';
import { LoadingOverlay } from '@/common/components/loading-overlay';
import { useFaqs } from '@/modules/faq/hooks/use-faqs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronIcon,
  FaqAnswer,
  FaqHeader,
  FaqHeaderRow,
  FaqItem,
  FaqList,
  FaqQuestion,
  FaqSectionContainer,
  FaqSectionContent,
  FaqSubtitle,
  FaqTitle,
} from './styles';
import { FaqSectionProps } from './types';

export const FaqSection = ({ className, faqs }: FaqSectionProps) => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { t } = useTranslation();
  const { data: dynamicFaqs, isLoading } = useFaqs(faqs);
  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <FaqSectionContainer className={className}>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay isLoading={isLoading} />
        <Container>
          <FaqSectionContent>
            <FaqHeader>
              <FaqTitle>{t('faqSection.title')}</FaqTitle>
              <FaqSubtitle>{t('faqSection.titleHighlight')}</FaqSubtitle>
            </FaqHeader>

            <FaqList>
            {dynamicFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                isOpen={openItem === faq.id}
                onClick={() => toggleItem(faq.id)}
              >
                <FaqHeaderRow>
                  <FaqQuestion isOpen={openItem === faq.id}>
                    {faq.title}
                  </FaqQuestion>
                  <ChevronIcon isOpen={openItem === faq.id}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </ChevronIcon>
                </FaqHeaderRow>
                {openItem === faq.id && (
                  <FaqAnswer>
                    <div dangerouslySetInnerHTML={{ __html: faq.description }} />
                  </FaqAnswer>
                )}
              </FaqItem>
            ))}
            </FaqList>
          </FaqSectionContent>
        </Container>
      </div>
    </FaqSectionContainer>
  );
};

