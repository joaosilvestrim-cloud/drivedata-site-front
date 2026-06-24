import { ArticleCategoryModel } from '@/common/model/article-category.model';
import { ArticleModel } from '@/common/model/article.model';

export interface MainArticleSectionProps {
  article: ArticleModel & { category: ArticleCategoryModel };
  className?: string;
}

