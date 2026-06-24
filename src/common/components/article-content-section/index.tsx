'use client';

import { ArticleContent, ContentContainer, ContentSection } from './styles';
import { ArticleContentSectionProps } from './types';

export const ArticleContentSection = ({ content, className }: ArticleContentSectionProps) => {
  return (
    <ContentSection className={className}>
      <ContentContainer>
        <ArticleContent dangerouslySetInnerHTML={{ __html: content }} />
      </ContentContainer>
    </ContentSection>
  );
};

