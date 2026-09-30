'use client';

// Página oficial de leitura de um artigo do blog (/article/[id]), no visual do site "clean".
// O corpo é o HTML do CMS já normalizado no servidor (normalizeArticleHtml), renderizado
// do mesmo jeito que a página antiga. Nenhum registro de visualização aqui.
// Os textos da interface seguem o idioma do site (pt, en, es, fr) e trocam na hora;
// título, corpo, categoria, autor e FAQ vêm do banco e não são traduzidos aqui.
import type { CleanArticleCard, CleanArticleFull } from './articles-data';
import { ROUTES } from './content';
import { useCopy, type Copy } from './i18n';
import { CleanShell } from './shell';
import { ArticleCard, ArticleCover, ArticleDate, ArticlesCta } from './articles';
import s from './clean.module.css';
import a from './articles.module.css';
import r from './article.module.css';
import { SmartLink } from './link';

const PT = {
  back: 'Todos os artigos',
  minutes: (n: number) => `${n} min de leitura`,
  by: (name: string) => `Por ${name}`,
  faqTitle: 'Perguntas frequentes',
  relatedTitle: 'Continue lendo',
  seeAll: 'Ver todos os artigos',
  ctaTitle: 'Quer levar isso para a sua operação?',
  ctaText: 'Converse com um especialista e veja por onde começar com os seus dados.',
  ctaLink: 'Ver outros artigos',
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    back: 'All articles',
    minutes: (n: number) => `${n} min read`,
    by: (name: string) => `By ${name}`,
    faqTitle: 'Frequently asked questions',
    relatedTitle: 'Keep reading',
    seeAll: 'See all articles',
    ctaTitle: 'Want to bring this to your operation?',
    ctaText: 'Talk to an expert and see where to start with your data.',
    ctaLink: 'See other articles',
  },
  es: {
    back: 'Todos los artículos',
    minutes: (n: number) => `${n} min de lectura`,
    by: (name: string) => `Por ${name}`,
    faqTitle: 'Preguntas frecuentes',
    relatedTitle: 'Siga leyendo',
    seeAll: 'Ver todos los artículos',
    ctaTitle: '¿Quiere llevar esto a su operación?',
    ctaText: 'Hable con un especialista y vea por dónde empezar con sus datos.',
    ctaLink: 'Ver otros artículos',
  },
  fr: {
    back: 'Tous les articles',
    minutes: (n: number) => `${n} min de lecture`,
    by: (name: string) => `Par ${name}`,
    faqTitle: 'Questions fréquentes',
    relatedTitle: 'Poursuivre la lecture',
    seeAll: 'Voir tous les articles',
    ctaTitle: "Envie d'appliquer cela à votre activité ?",
    ctaText: 'Parlez à un expert et voyez par où commencer avec vos données.',
    ctaLink: "Voir d'autres articles",
  },
};

export function ArticleClean({ article, related }: { article: CleanArticleFull; related: CleanArticleCard[] }) {
  const t = useCopy(COPY);
  const meta = [
    (article.date || article.dateIso) && <ArticleDate key="d" date={article.date} dateIso={article.dateIso} />,
    article.readingMinutes > 0 && <span key="t">{t.minutes(article.readingMinutes)}</span>,
    article.author && <span key="a">{t.by(article.author)}</span>,
  ].filter(Boolean);

  return (
    <CleanShell current="articles">
      <article aria-labelledby="artigo-titulo">
        <header className={r.head}>
          <div className={r.column}>
            <SmartLink href={ROUTES.articles} className={r.back}>
              <span aria-hidden="true">←</span> {t.back}
            </SmartLink>
            {article.categoryName && <span className={`${s.cardTag} ${r.tag}`}>{article.categoryName}</span>}
            <h1 id="artigo-titulo" className={r.title}>{article.title}</h1>
            {article.subTitle && <p className={r.sub}>{article.subTitle}</p>}
            {meta.length > 0 && (
              <p className={r.meta}>
                <span className={r.metaInner}>
                  {meta.map((m, i) => (
                    <span key={i} className={r.metaItem}>{m}</span>
                  ))}
                </span>
              </p>
            )}
          </div>
          {article.imageUrl && (
            <div className={r.coverWrap}>
              <ArticleCover src={article.imageUrl} alt={article.title} eager className={r.cover} />
            </div>
          )}
        </header>

        <div className={r.column}>
          <div className={r.prose} dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {article.faqs.length > 0 && (
          <section className={r.faq} aria-labelledby="faq-titulo">
            <div className={r.column}>
              <h2 id="faq-titulo" className={r.faqTitle}>{t.faqTitle}</h2>
              <div className={r.faqList}>
                {article.faqs.map((f, i) => (
                  <details key={i} className={r.faqItem}>
                    <summary className={r.faqQ}>
                      <span>{f.q}</span>
                      <svg className={r.faqIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </summary>
                    <p className={r.faqA}>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {related.length > 0 && (
        <section className={`${s.band} ${s.bandFog}`} aria-labelledby="relacionados-titulo">
          <div className={s.wrap}>
            <div className={s.sectionHead} data-reveal>
              <h2 id="relacionados-titulo" className={s.h2}>{t.relatedTitle}</h2>
              <SmartLink href={ROUTES.articles} className={s.link}>{t.seeAll}</SmartLink>
            </div>
            <ul className={a.grid} data-reveal>
              {related.map((x) => (
                <li key={x.id}><ArticleCard article={x} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ArticlesCta title={t.ctaTitle} text={t.ctaText} link={{ href: ROUTES.articles, label: t.ctaLink }} />
    </CleanShell>
  );
}
