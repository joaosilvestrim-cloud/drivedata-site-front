import { ArticleContentSection, Header, MainArticleSection, RelatedArticlesSection } from '@/common/components';
import { Footer } from '@/common/components/footer';
import { TrackView } from '@/common/components/track-view';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { ArticleCategoryModel } from '@/common/model/article-category.model';
import { ArticleModel } from '@/common/model/article.model';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';
import { getArticleById, getArticles } from '@/server/content-db';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const lang = await getLanguageSafeAsync();
    const a = (await getArticleById(id, lang)) as ArticleModel | null;
    if (!a) return { title: 'Artigo · DriveData' };
    const title = a.seoTitle || a.title;
    const description = a.seoDescription || a.description || undefined;
    return {
      title,
      description,
      openGraph: { title, description, images: a.imageUrl ? [a.imageUrl] : [], type: 'article' },
      twitter: { card: 'summary_large_image', title, description },
    };
  } catch {
    return {};
  }
}

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
    relatedArticles = allArticles.filter((a) => a.id !== article!.id).slice(0, 3);
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <TrackView articleId={article.id} lang={lang} />
      <Header />
      <MainArticleSection article={article} />
      <ArticleContentSection content={article.content} />
      <RelatedArticlesSection articles={relatedArticles} />
      <Footer />
    </>
  );
}
