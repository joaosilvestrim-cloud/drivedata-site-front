import { Header } from '@/common/components';
import { ArticlesSection } from '@/common/components/articles-section';
import { Footer } from '@/common/components/footer';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { httpFindManyArticle } from '@/modules/article/api/find-many-article/http-find-many-article';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';


export default async function Page() {
  const lang = await getLanguageSafeAsync();
  let articles: FindManyArticleResult = [];

  try {
    articles = await httpFindManyArticle({}, lang);
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
