import { ArticleContentSection, Header, MainArticleSection, RelatedArticlesSection } from '@/common/components';
import { Footer } from '@/common/components/footer';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { ArticleCategoryModel } from '@/common/model/article-category.model';
import { ArticleModel } from '@/common/model/article.model';
import { httpFindManyArticle } from '@/modules/article/api/find-many-article/http-find-many-article';
import { httpFindOneArticleById } from '@/modules/article/api/find-one-article-by-id/http-find-one-article-by-id';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';

  
export default async function Article({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLanguageSafeAsync();
  
  let article: ArticleModel & { category: ArticleCategoryModel } | null = null;
  let relatedArticles: FindManyArticleResult = [];
  
  try {
    article = await httpFindOneArticleById({ id }, lang);
  } catch (error) {
    console.error(error);
  }

  if (!article) {
    return null;
  }

  try {
    const allArticles = await httpFindManyArticle({}, lang);
    relatedArticles = allArticles.filter(a => a.id !== id).slice(0, 3);
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <Header />
      <MainArticleSection article={article} />
      <ArticleContentSection content={article.content} />
      <RelatedArticlesSection articles={relatedArticles} />
      <Footer />
    </>
  );
}
