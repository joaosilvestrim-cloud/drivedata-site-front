'use client';

import { Container } from "@/common/components/container";
import { useTranslation } from 'react-i18next';
import { ArticleCard } from "../articles-section/article-card";
import { ArticlesGrid, RelatedArticlesSectionContainer, RelatedArticlesSectionHeader, RelatedArticlesSectionTitle } from "./styles";
import { RelatedArticlesSectionProps } from "./types";

export const RelatedArticlesSection = ({ articles, className }: RelatedArticlesSectionProps) => {
  const { t } = useTranslation();

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <RelatedArticlesSectionContainer className={className}>
      <Container>
        <RelatedArticlesSectionHeader>
          <RelatedArticlesSectionTitle>{t('relatedArticlesSection.title')}</RelatedArticlesSectionTitle>
        </RelatedArticlesSectionHeader>
        <ArticlesGrid>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ArticlesGrid>
      </Container>
    </RelatedArticlesSectionContainer>
  );
};

