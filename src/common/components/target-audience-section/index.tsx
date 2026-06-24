'use client';
import { useEffect, useRef, useState } from 'react';

import { Container } from '@/common/components/container';
import { LoadingOverlay } from '@/common/components/loading-overlay';
import { useTargetAudienceProfiles } from '@/modules/target-audience-profile/hooks/use-target-audience-profiles';
import { useTranslation } from 'react-i18next';
import {
  Circle,
  Column,
  ColumnContentTitle,
  ColumnsContainer,
  ColumnTitle,
  HighlightedBrand,
  HighlightedWord,
  HighlightedWordBlue,
  Item,
  ItemContent,
  ItemDescription,
  ItemIcon,
  ItemTitle,
  TargetAudienceContainer,
  TargetAudienceTitle
} from './styles';
import { TargetAudienceSectionProps } from './types';


export const TargetAudienceSection = ({
  className,
  profiles,
}: TargetAudienceSectionProps) => {
  const { t } = useTranslation();
  const { data: dynamicProfiles, isLoading } = useTargetAudienceProfiles(profiles);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(() => new Set());
  const positiveRefs = useRef<(HTMLLIElement | null)[]>([]);
  const negativeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const positiveItems = dynamicProfiles
    .filter((p) => p.type === 'CUSTOMER')
    .map((p) => ({
      id: p.id,
      title: p.title ?? '',
      description: p.description ?? '',
    }));

  const negativeItems = dynamicProfiles
    .filter((p) => p.type === 'NON_CUSTOMER')
    .map((p) => ({
      id: p.id,
      title: p.title ?? '',
      description: p.description ?? '',
    }));

  const maxLen = Math.max(positiveItems.length, negativeItems.length);
  const positivePadded = [...positiveItems];
  const negativePadded = [...negativeItems];
  while (positivePadded.length < maxLen) {
    positivePadded.push({ id: `pos-placeholder-${positivePadded.length}`, title: '', description: '' });
  }
  while (negativePadded.length < maxLen) {
    negativePadded.push({ id: `neg-placeholder-${negativePadded.length}`, title: '', description: '' });
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const itemId = entry.target.getAttribute('data-item-id');
          if (!itemId) {
            return;
          }

          setVisibleItems((prev) => {
            if (prev.has(itemId)) {
              return prev;
            }

            const next = new Set(prev);
            next.add(itemId);
            return next;
          });

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  useEffect(() => {
     const observer = observerRef.current;
     if (!observer) {
       return;
     }
 
     const elements = [...positiveRefs.current, ...negativeRefs.current].filter(
       (element): element is HTMLLIElement => Boolean(element),
     );

     elements
       .filter((element) => !visibleItems.has(element.dataset.itemId ?? ''))
       .forEach((element) => observer.observe(element));
   }, [dynamicProfiles, visibleItems]);

  return (
    <TargetAudienceContainer className={className}>
      <Container>
        <TargetAudienceTitle>
          {t('targetAudienceSection.titleNormal')} <HighlightedWordBlue>{t('targetAudienceSection.titleHighlightBlue')}</HighlightedWordBlue>{' '}
          <HighlightedWord>{t('targetAudienceSection.titleHighlight')}</HighlightedWord>
        </TargetAudienceTitle>

        <div style={{ position: 'relative' }}>
          <LoadingOverlay isLoading={isLoading} />
          <ColumnsContainer>
          <Column isPositive>
            <Item data-visible="true">
              <ColumnContentTitle>
                <ColumnTitle isPositive>
                  	{t('targetAudienceSection.forWho')}{' '}
                  <HighlightedBrand isPositive>
                    {t('targetAudienceSection.forWhoHighlight')}{' '}
                  </HighlightedBrand>
                  {t('targetAudienceSection.forWhoDesc')}
                </ColumnTitle>
              </ColumnContentTitle>
            </Item>
            {positivePadded.map((item, index) => {
              const hasContent = Boolean(item.title || item.description);

              if (!hasContent) {
                return <Item key={item.id} data-placeholder="true" />;
              }

              const uniqueId = `positive-${item.id}`;

              return (
                <Item
                  key={uniqueId}
                  ref={(element) => {
                    positiveRefs.current[index] = element;
                  }}
                  data-item-id={uniqueId}
                  data-visible={visibleItems.has(uniqueId)}
                >
                  <Circle>
                    <ItemIcon isPositive>
                      ✓
                    </ItemIcon>
                  </Circle>
                  <ItemContent>
                    {item.title && <ItemTitle isPositive>{item.title}</ItemTitle>}
                    <ItemDescription dangerouslySetInnerHTML={{ __html: item.description }} />
                  </ItemContent>
                </Item>
              );
            })}
          </Column>
          <Column isPositive={false}>
            <Item data-visible="true">
              <ColumnContentTitle>
                <ColumnTitle isPositive={false}>
                  {t('targetAudienceSection.forWho')}{' '}
                  <HighlightedBrand isPositive={false}>
                    {t('targetAudienceSection.forWhoHighlight')}{' '}
                  </HighlightedBrand>
                  {t('targetAudienceSection.forWhoDontDesc')}
                </ColumnTitle>
              </ColumnContentTitle>
            </Item>
            {negativePadded.map((item, index) => {
              const hasContent = Boolean(item.title || item.description);

              if (!hasContent) {
                return <Item key={item.id} data-placeholder="true" />;
              }

              const uniqueId = `negative-${item.id}`;

              return (
                <Item
                  key={uniqueId}
                  ref={(element) => {
                    negativeRefs.current[index] = element;
                  }}
                  data-item-id={uniqueId}
                  data-visible={visibleItems.has(uniqueId)}
                >
                  <Circle>
                    <ItemIcon isPositive={false}>
                      ✕
                    </ItemIcon>
                  </Circle>
                  <ItemContent>
                    {item.title && <ItemTitle isPositive={false}>{item.title}</ItemTitle>}
                    <ItemDescription dangerouslySetInnerHTML={{ __html: item.description }} />
                  </ItemContent>
                </Item>
              );
            })}
          </Column>
        </ColumnsContainer>
      </div>
      </Container>
    </TargetAudienceContainer>
  );
};
