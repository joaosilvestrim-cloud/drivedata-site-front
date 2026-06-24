import { FindManyArticleResult } from "@/modules/article/types/find-many-article-case";

export interface ArticlesSectionProps {
  articles: FindManyArticleResult;
  className?: string;
}

