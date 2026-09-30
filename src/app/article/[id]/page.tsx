import { ArticleClean } from '@/common/components/site-clean/article';
import {
  findArticleReadOnly,
  jsonLd,
  listArticlesReadOnly,
  pickRelated,
  type CleanArticleCard,
} from '@/common/components/site-clean/articles-data';
import { TrackView } from '@/common/components/track-view';
import { getLanguageSafeAsync } from '@/common/helpers/get-language-server';
import { SITE_BASE_URL } from '@/common/config/site';
import { hreflang } from '@/common/seo';
import { publishDueScheduled } from '@/server/content-db';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const lang = await getLanguageSafeAsync();
    const found = await findArticleReadOnly(id, lang);
    if (found.kind !== 'found') return { title: 'Artigo · DriveData' };
    const a = found.raw;
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

  // Publica os agendados que já venceram (o que getArticles fazia antes).
  void publishDueScheduled().catch(() => {});

  // banco fora: deixa o erro subir (500) em vez de responder 404, que o Google
  // entenderia como página removida
  const found = await findArticleReadOnly(id, lang);
  // slug antigo (trocado no admin ou corrigido): 301 para o endereço atual
  if (found.kind === 'redirect') permanentRedirect(found.to);
  if (found.kind === 'missing') notFound();

  const { article, raw } = found;

  let related: CleanArticleCard[] = [];
  try {
    related = pickRelated(await listArticlesReadOnly(lang), article);
  } catch (error) {
    console.error(error);
  }

  const canonical = `${SITE_BASE_URL}/article/${raw.slug || raw.id}`;
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonical}#article`,
    headline: raw.seoTitle || raw.title,
    description: raw.seoDescription || raw.description || undefined,
    image: raw.imageUrl ? [raw.imageUrl] : undefined,
    datePublished: raw.publishedAt || raw.createdAt,
    dateModified: raw.updatedAt || raw.publishedAt || raw.createdAt,
    author: { '@type': 'Organization', name: raw.author || 'DriveData' },
    publisher: { '@id': `${SITE_BASE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    articleSection: raw.category?.name || undefined,
    inLanguage: lang === 'pt' ? 'pt-BR' : lang,
  };

  // FAQ do artigo vira schema FAQPage.
  const faqLd = article.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: article.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd) }} />}
      <TrackView articleId={article.id} lang={lang} />
      <ArticleClean article={article} related={related} />
    </>
  );
}
