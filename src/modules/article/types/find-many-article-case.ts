import { ArticleCategoryModel } from '@/common/model/article-category.model';
import { ArticleModel } from '@/common/model/article.model';

export type FindManyArticleParams = {
  search?: string;
  limit?: number;
};

export type FindManyArticleResult = (ArticleModel & {
  category: ArticleCategoryModel;
})[];

