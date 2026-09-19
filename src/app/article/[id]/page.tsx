import { ArticleContentSection, Header, MainArticleSection, RelatedArticlesSection } from '@/common/components';
import { ArticleFaqSection } from '@/common/components/article-faq-section';
import { Footer } from '@/common/components/footer';
import { TrackView } from '@/common/components/track-view';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { ArticleCategoryModel } from '@/common/model/article-category.model';
import { ArticleModel } from '@/common/model/article.model';
import { FindManyArticleResult } from '@/modules/article/types/find-many-article-case';
import { getArticleById, getArticleRedirect, getArticles } from '@/server/content-db';
import { SITE_BASE_URL } from '@/common/config/site';
import { hreflang } from '@/common/seo';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const lang = await getLanguageSafeAsync();
    const a = (await getArticleById(id, lang)) as ArticleModel | null;
    if (!a) return { title: 'Artigo · DriveData' };
    const title = a.seoTitle || a.title;
    const description = a.seoDescription || a.description || undefined;
    const path = `/article/${a.slug || a.id}`;
    const canonical = `${SITE_BASE_URL}${path}`;
    return {
      title,
      description,
      // hreflang só quando o artigo tem inglês de verdade; senão o .ca serviria
      // o texto em português e o Google veria duas cópias.
      alternates: { canonical, ...(a.hasEn ? { languages: hreflang(path) } : {}) },
      openGraph: { title, description, url: canonical, images: a.imageUrl ? [a.imageUrl] : [], type: 'article' },
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
    // banco fora: deixa o erro subir (500) em vez de responder 404, que o Google
    // entenderia como página removida
    console.error(error);
    throw error;
  }

  if (!article) {
    // slug antigo (trocado no admin ou corrigido): 301 para o endereço atual
    const target = await getArticleRedirect(decodeURIComponent(id));
    if (target) permanentRedirect(`/article/${target}`);
    notFound();
  }

  try {
    const allArticles = (await getArticles({}, lang)) as FindManyArticleResult;
    relatedArticles = allArticles.filter((a) => a.id !== article!.id).slice(0, 3);
  } catch (error) {
    console.error(error);
  }

  const canonical = `${SITE_BASE_URL}/article/${article.slug || article.id}`;
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonical}#article`,
    headline: article.seoTitle || article.title,
    description: article.seoDescription || article.description || undefined,
    image: article.imageUrl ? [article.imageUrl] : undefined,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: { '@type': 'Organization', name: article.author || 'DriveData' },
    publisher: { '@id': `${SITE_BASE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    articleSection: article.category?.name || undefined,
    inLanguage: lang === 'pt' ? 'pt-BR' : lang,
  };

  // FAQ do artigo → schema FAQPage (o crítico "FAQ com Schema" da auditoria).
  const faqs = (article.faqs || []).filter((f) => f?.q?.trim() && f?.a?.trim());
  const faqLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <TrackView articleId={article.id} lang={lang} />
      <Header />
      <main>
        <MainArticleSection article={article} />
        <ArticleContentSection content={article.content} />
        <ArticleFaqSection faqs={article.faqs} />
      </main>
      <RelatedArticlesSection articles={relatedArticles} />
      <Footer />
    </>
  );
}
