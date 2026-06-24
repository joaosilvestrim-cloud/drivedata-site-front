'use client';

import { MainContainer, MainContent, MainSubTitle, MainTitle } from './styles';
import { MainArticleSectionProps } from './types';

export const MainArticleSection = ({
  article,
  className,
}: MainArticleSectionProps) => {
  return (
    <MainContainer className={className}>
      <MainContent>
        <MainTitle>{article.title}</MainTitle>

        {article.subTitle && <MainSubTitle>{article.subTitle}</MainSubTitle>}
      </MainContent>
    </MainContainer>
  );
};
