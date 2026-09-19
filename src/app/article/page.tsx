import { Header } from '@/common/components';
import { ThemeScope } from '@/common/components/theme-scope';
import { ArticlesSection } from '@/common/components/articles-section';
import { Footer } from '@/common/components/footer';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';
import { getArticles } from '@/server/content-db';
import { SITE_COUNTRY } from '@/common/config/site';
import { pageMetadata } from '@/common/seo';

export const metadata = pageMetadata(
  SITE_COUNTRY === 'CA'
    ? {
        path: '/article',
        title: 'DriveData Blog · Data, BI and AI in practice',
        description:
          'Articles on Business Intelligence, Microsoft Fabric, data engineering and applied AI for logistics, retail, finance and operations.',
      }
    : {
        path: '/article',
        title: 'Blog DriveData · Dados, BI e IA na prática',
        description:
          'Artigos sobre Business Intelligence, Microsoft Fabric, engenharia de dados e IA aplicada a logística, varejo, finanças e operações.',
      },
);


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
      <ThemeScope />
      <Header />
      {/* Aqui a seção é a página inteira, então o título vira o H1. */}
      <ArticlesSection articles={articles} titleAs="h1" />
      <Footer />
    </>
  );
}
