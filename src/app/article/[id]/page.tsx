import { ArticleContentSection, Header, MainArticleSection, RelatedArticlesSection } from '@/common/components';
import { Footer } from '@/common/components/footer';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { ArticleCategoryModel } from '@/common/model/article-category.model';
import { ArticleModel } from '@/common/model/article.model';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';
import { getArticleById, getArticles } from '@/server/content-db';


export default async function Article({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLanguageSafeAsync();

  let article: (ArticleModel & { category: ArticleCategoryModel }) | null = null;
  let relatedArticles: FindManyArticleResult = [];

  try {
    article = (await getArticleById(id, lang)) as (ArticleModel & { category: ArticleCategoryModel }) | null;
  } catch (error) {
    console.error(error);
  }

  if (!article) {
    return null;
  }

  try {
    const allArticles = (await getArticles({}, lang)) as FindManyArticleResult;
    relatedArticles = allArticles.filter((a) => a.id !== id).slice(0, 3);
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
