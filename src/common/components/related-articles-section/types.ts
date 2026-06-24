import { FindManyArticleResult } from "@/modules/article/types/find-many-article-case";

export interface RelatedArticlesSectionProps {
  articles: FindManyArticleResult;
  className?: string;
}

