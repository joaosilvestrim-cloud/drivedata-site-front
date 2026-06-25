import { Header } from '@/common/components';
import { ArticlesSection } from '@/common/components/articles-section';
import { Footer } from '@/common/components/footer';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';
import { getArticles } from '@/server/content-db';


export default async function Page() {
  const lang = await getLanguageSafeAsync();
  let articles: FindManyArticleResult = [];

  try {
    articles = (await getArticles({}, lang)) as FindManyArticleResult;
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <Header />
      <ArticlesSection articles={articles} />
      <Footer />
    </>
  );
}
