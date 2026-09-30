import { ArticlesClean } from '@/common/components/site-clean/articles';
import { listArticlesReadOnly, type CleanArticleCard } from '@/common/components/site-clean/articles-data';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { publishDueScheduled } from '@/server/content-db';
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
  // Publica os agendados que já venceram (o que getArticles fazia antes).
  void publishDueScheduled().catch(() => {});

  let articles: CleanArticleCard[] = [];
  let failed = false;
  try {
    articles = await listArticlesReadOnly(lang);
  } catch (error) {
    console.error(error);
    failed = true;
  }
  return <ArticlesClean articles={articles} failed={failed} />;
}
