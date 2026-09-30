import { ArticlesClean } from '@/common/components/site-clean/articles';
import { listArticlesReadOnly, type CleanArticleCard } from '@/common/components/site-clean/articles-data';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { publishDueScheduled } from '@/server/content-db';
import { localizedMetadata } from '@/common/seo/localized';

export const generateMetadata = () =>
  localizedMetadata('/article', {
    pt: {
      title: 'Blog DriveData · Dados, BI e IA na prática',
      description:
        'Artigos sobre Business Intelligence, Microsoft Fabric, engenharia de dados e IA aplicada a logística, varejo, finanças e operações.',
    },
    en: {
      title: 'DriveData Blog · Data, BI and AI in practice',
      description:
        'Articles on Business Intelligence, Microsoft Fabric, data engineering and applied AI for logistics, retail, finance and operations.',
    },
    es: {
      title: 'Blog DriveData · Datos, BI e IA en la práctica',
      description:
        'Artículos sobre Business Intelligence, Microsoft Fabric, ingeniería de datos e IA aplicada a logística, retail, finanzas y operaciones.',
    },
    fr: {
      title: 'Blog DriveData · Données, BI et IA en pratique',
      description:
        'Articles sur la Business Intelligence, Microsoft Fabric, l’ingénierie des données et l’IA appliquée à la logistique, au commerce de détail, à la finance et aux opérations.',
    },
  });

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
