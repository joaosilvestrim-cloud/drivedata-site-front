'use client';

import { Container } from "@/common/components/container";
import { LoadingOverlay } from '@/common/components/loading-overlay';
import { useTranslation } from 'react-i18next';
import { useArticles } from '@/modules/article/hooks/use-articles';
import { ArticleCard } from "./article-card";
import { ArticlesGrid, ArticlesSectionContainer, ArticlesSectionHeader, ArticlesSectionTitle } from "./styles";
import { ArticlesSectionProps } from "./types";

export const ArticlesSection = ({ articles, className }: ArticlesSectionProps) => {
  const { t } = useTranslation();
  const { data: dynamicArticles, isLoading } = useArticles(articles, { limit: 3 });

  return (
    <ArticlesSectionContainer id="articles" className={className}>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay isLoading={isLoading} />
        <Container>
          <ArticlesSectionHeader>
            <ArticlesSectionTitle>{t('articlesSection.title')}</ArticlesSectionTitle>
          </ArticlesSectionHeader>
          <ArticlesGrid>
            {dynamicArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ArticlesGrid>
        </Container>
      </div>
    </ArticlesSectionContainer>
  );
};

