import { ArticleCategoryModel } from '@/common/model/article-category.model';
import { ArticleModel } from '@/common/model/article.model';

export type FindOneArticleByIdParams = {
  id: string;
};

export type FindOneArticleByIdResult = ArticleModel & {
  category: ArticleCategoryModel;
};

