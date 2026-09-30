'use client';

// Lista oficial de artigos do blog (/article), no visual do site "clean".
// Só apresenta o que vem do banco: título, resumo, categoria, capa e data.
// Os textos da interface seguem o idioma do site (pt, en, es, fr) e trocam na hora;
// o conteúdo dos artigos vem do banco e não é traduzido aqui.
import { useMemo, useState } from 'react';
import type { CleanArticleCard } from './articles-data';
import { ROUTES } from './content';
import { useCopy, useLang, INTL_LOCALE, type Copy } from './i18n';
import { CleanShell, ContactButton } from './shell';
import { PageHero } from './ui';
import s from './clean.module.css';
import a from './articles.module.css';
import { SmartLink } from './link';

const PT = {
  heroTitle: 'Dados, BI e IA na prática.',
  heroLead:
    'Artigos sobre Business Intelligence, Microsoft Fabric, engenharia de dados e IA aplicada a logística, varejo, finanças e operações.',
  listTitle: 'Todos os artigos',
  loadError: 'Não foi possível carregar os artigos agora. Tente de novo em instantes.',
  empty: 'Nenhum artigo publicado ainda.',
  filterLabel: 'Filtrar por categoria',
  all: 'Todos',
  count: (n: number) => (n === 1 ? '1 artigo' : `${n} artigos`),
  readArticle: 'Ler artigo',
  showMore: 'Mostrar mais artigos',
  ctaTitle: 'Quer decidir com dados?',
  ctaText: 'Converse com um especialista e veja por onde começar na sua operação.',
  ctaLink: 'Conhecer a DriveData',
  talk: 'Fale com um especialista',
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    heroTitle: 'Data, BI and AI in practice.',
    heroLead:
      'Articles on Business Intelligence, Microsoft Fabric, data engineering and AI applied to logistics, retail, finance and operations.',
    listTitle: 'All articles',
    loadError: 'We could not load the articles right now. Please try again in a moment.',
    empty: 'No articles published yet.',
    filterLabel: 'Filter by category',
    all: 'All',
    count: (n: number) => (n === 1 ? '1 article' : `${n} articles`),
    readArticle: 'Read article',
    showMore: 'Show more articles',
    ctaTitle: 'Ready to decide with data?',
    ctaText: 'Talk to an expert and see where to start in your operation.',
    ctaLink: 'Discover DriveData',
    talk: 'Talk to an expert',
  },
  es: {
    heroTitle: 'Datos, BI e IA en la práctica.',
    heroLead:
      'Artículos sobre Business Intelligence, Microsoft Fabric, ingeniería de datos e IA aplicada a logística, retail, finanzas y operaciones.',
    listTitle: 'Todos los artículos',
    loadError: 'No fue posible cargar los artículos ahora. Inténtelo de nuevo en unos instantes.',
    empty: 'Todavía no hay artículos publicados.',
    filterLabel: 'Filtrar por categoría',
    all: 'Todos',
    count: (n: number) => (n === 1 ? '1 artículo' : `${n} artículos`),
    readArticle: 'Leer artículo',
    showMore: 'Mostrar más artículos',
    ctaTitle: '¿Quiere decidir con datos?',
    ctaText: 'Hable con un especialista y vea por dónde empezar en su operación.',
    ctaLink: 'Conocer DriveData',
    talk: 'Hable con un especialista',
  },
  fr: {
    heroTitle: 'Données, BI et IA en pratique.',
    heroLead:
      "Articles sur la Business Intelligence, Microsoft Fabric, l'ingénierie des données et l'IA appliquée à la logistique, au commerce de détail, à la finance et aux opérations.",
    listTitle: 'Tous les articles',
    loadError: 'Impossible de charger les articles pour le moment. Réessayez dans quelques instants.',
    empty: 'Aucun article publié pour le moment.',
    filterLabel: 'Filtrer par catégorie',
    all: 'Tous',
    count: (n: number) => (n <= 1 ? `${n} article` : `${n} articles`),
    readArticle: "Lire l'article",
    showMore: "Afficher plus d'articles",
    ctaTitle: 'Envie de décider avec les données ?',
    ctaText: 'Parlez à un expert et voyez par où commencer dans votre activité.',
    ctaLink: 'Découvrir DriveData',
    talk: 'Parler à un expert',
  },
};

const PAGE = 9;

/**
 * Data do artigo no idioma atual. Formata no cliente a partir de dateIso para
 * acompanhar a troca de idioma; sem dateIso, usa a data já formatada do servidor.
 */
export function ArticleDate({ date, dateIso }: { date: string | null; dateIso: string | null }) {
  const lang = useLang();
  let label = date;
  if (dateIso) {
    const d = new Date(dateIso);
    if (!Number.isNaN(d.getTime())) {
      label = new Intl.DateTimeFormat(INTL_LOCALE[lang], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo',
      }).format(d);
    }
  }
  if (!label) return null;
  return <time dateTime={dateIso ?? undefined}>{label}</time>;
}

/** Capa do artigo. Some sem deixar ícone quebrado se a imagem falhar. */
export function ArticleCover({ src, alt, eager, className }: { src: string | null; alt: string; eager?: boolean; className?: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`${a.cover} ${className ?? ''}`}>
      {src && ok && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
          onError={() => setOk(false)}
        />
      )}
    </div>
  );
}

/** Cartão de artigo: o cartão inteiro é o link. */
export function ArticleCard({ article, headingLevel = 3 }: { article: CleanArticleCard; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const hasDate = Boolean(article.date || article.dateIso);
  return (
    <SmartLink href={article.href} className={a.card}>
      <ArticleCover src={article.imageUrl} alt={article.title} />
      <div className={a.cardBody}>
        {(article.categoryName || hasDate) && (
          <div className={a.cardMeta}>
            {article.categoryName && <span className={`${s.cardTag} ${a.tag}`}>{article.categoryName}</span>}
            {hasDate && <ArticleDate date={article.date} dateIso={article.dateIso} />}
          </div>
        )}
        <H className={a.cardTitle}>{article.title}</H>
        {article.excerpt && <p className={a.cardExcerpt}>{article.excerpt}</p>}
      </div>
    </SmartLink>
  );
}

/** Chamado final das páginas de artigos. */
export function ArticlesCta({ title, text, link }: { title: string; text: string; link?: { href: string; label: string } }) {
  const t = useCopy(COPY);
  return (
    // Sem bandTight: nas páginas de artigos o chamado vem logo após uma faixa cinza.
    <section className={s.band} aria-labelledby="cta-titulo">
      <div className={s.wrap}>
        <div className={s.cta} data-reveal>
          <h2 id="cta-titulo" className={s.h2}>{title}</h2>
          <div className={s.ctaActions}>
            <p>{text}</p>
            <div className={s.ctaButtons}>
              <ContactButton>{t.talk}</ContactButton>
              {link && <SmartLink href={link.href} className={s.link}>{link.label}</SmartLink>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ArticlesClean({ articles, failed = false }: { articles: CleanArticleCard[]; failed?: boolean }) {
  const t = useCopy(COPY);
  const lang = useLang();
  const [category, setCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE + 1);

  // Categorias que existem nos artigos publicados, na ordem de quantidade.
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    articles.forEach((x) => {
      if (!x.categoryId || !x.categoryName) return;
      const c = map.get(x.categoryId) ?? { id: x.categoryId, name: x.categoryName, count: 0 };
      c.count += 1;
      map.set(x.categoryId, c);
    });
    return [...map.values()].sort((p, q) => q.count - p.count || p.name.localeCompare(q.name, INTL_LOCALE[lang]));
  }, [articles, lang]);

  const list = category ? articles.filter((x) => x.categoryId === category) : articles;
  const [featured, ...rest] = list;
  const shown = rest.slice(0, Math.max(0, visible - 1));
  const total = list.length;

  const pick = (id: string | null) => {
    setCategory(id);
    setVisible(PAGE + 1);
  };

  return (
    <CleanShell current="articles">
      <PageHero title={t.heroTitle} lead={t.heroLead} />

      <section className={`${s.band} ${s.bandFog} ${a.listBand}`} aria-labelledby="lista-titulo">
        <div className={s.wrap}>
          <h2 id="lista-titulo" className={a.srOnly}>{t.listTitle}</h2>

          {articles.length === 0 ? (
            <p className={a.empty}>{failed ? t.loadError : t.empty}</p>
          ) : (
            // A revelação ao rolar fica no bloco inteiro: itens que entram depois
            // (filtro, "mostrar mais") não passam pelo observador do CleanShell.
            <div data-reveal>
              <div className={a.toolbar}>
                {categories.length > 1 && (
                  <div className={a.filters} role="group" aria-label={t.filterLabel}>
                    <button type="button" className={a.filter} aria-pressed={category === null} onClick={() => pick(null)}>
                      {t.all}
                    </button>
                    {categories.map((c) => (
                      <button key={c.id} type="button" className={a.filter} aria-pressed={category === c.id} onClick={() => pick(c.id)}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
                <p className={a.count} aria-live="polite">
                  {t.count(total)}
                </p>
              </div>

              {featured && (
                <SmartLink href={featured.href} className={a.featured}>
                  <ArticleCover src={featured.imageUrl} alt={featured.title} eager className={a.featuredCover} />
                  <div className={a.featuredBody}>
                    {(featured.categoryName || featured.date || featured.dateIso) && (
                      <div className={a.cardMeta}>
                        {featured.categoryName && <span className={`${s.cardTag} ${a.tag}`}>{featured.categoryName}</span>}
                        <ArticleDate date={featured.date} dateIso={featured.dateIso} />
                      </div>
                    )}
                    <h3 className={a.featuredTitle}>{featured.title}</h3>
                    {featured.excerpt && <p className={a.featuredExcerpt}>{featured.excerpt}</p>}
                    <span className={`${s.cardMore} ${a.featuredMore}`}>
                      {t.readArticle} <span className={a.arrow} aria-hidden="true">→</span>
                    </span>
                  </div>
                </SmartLink>
              )}

              {shown.length > 0 && (
                <ul className={a.grid}>
                  {shown.map((x) => (
                    <li key={x.id}>
                      <ArticleCard article={x} />
                    </li>
                  ))}
                </ul>
              )}

              {visible < total && (
                <div className={a.more}>
                  <button type="button" className={`${s.btn} ${s.btnOutline}`} onClick={() => setVisible((v) => v + PAGE)}>
                    {t.showMore}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <ArticlesCta title={t.ctaTitle} text={t.ctaText} link={{ href: ROUTES.home, label: t.ctaLink }} />
    </CleanShell>
  );
}
