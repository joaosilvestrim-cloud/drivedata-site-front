import { FindManyArticleResult } from "@/modules/article/types/find-many-article-case";

export interface ArticlesSectionProps {
  articles: FindManyArticleResult;
  className?: string;
  /** Nível do título: 'h1' quando a seção é a página (/article), 'h2' quando é trecho (/about). */
  titleAs?: 'h1' | 'h2';
}

