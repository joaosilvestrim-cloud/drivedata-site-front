'use client';

// Cases do site: cartão (também usado na home), lista com filtro por tipo de
// projeto (página /cases) e vitrine da home. Cada case diz só o que fizemos, em
// uma frase, com as ferramentas: o site institucional não expõe o cliente (sem
// status, desafio, prazos ou detalhes do projeto). Os dados chegam por props da
// página de servidor, que já removeu as notas internas fora do ambiente local.
import { useMemo, useState } from 'react';
import { ROUTES, optLogo } from './content';
import type { CaseQuote, CaseType, ClientCase, QuickCase } from './cases-data';
import { useCopy, useLang, type Copy } from './i18n';
import { SmartLink } from './link';
import { CleanShell, ContactButton } from './shell';
import { PageHero, SectionHead } from './ui';
import s from './clean.module.css';
import c from './cases.module.css';

const PT = {
  heroTitle: 'Projetos reais, do dado à decisão.',
  heroLead: 'Um pouco do que fizemos com empresas como PepsiCo, Unilever e TV TEM.',
  heroCta: 'Conte o seu desafio',
  count: (n: number) => `${n} ${n === 1 ? 'case' : 'cases'}`,
  filterLabel: 'Filtrar por tipo de projeto',
  all: 'Todos',
  quickTitle: 'Mais projetos de BI.',
  quickLead: 'Painéis e dashboards entregues para empresas de vários setores.',
  quoteLabel: 'Depoimento',
  ctaTitle: 'O próximo case pode ser o seu.',
  ctaText: 'Conte o problema. Em uma conversa dizemos por onde começar e o que dá para entregar primeiro.',
  ctaButton: 'Agendar uma conversa',
  typeLabel: 'Tipo de projeto',
  review: 'Antes de publicar',
  teaserTitle: 'Cases reais',
  teaserLead: 'Problemas de verdade, resolvidos com dados.',
  seeAll: 'Ver todos',
  quoteOpen: '“',
  quoteClose: '”',
  types: { bi: 'BI e painéis', data: 'Engenharia de dados', systems: 'Sistemas e apps', automation: 'Automação', allocation: 'Alocação de time' } as Record<CaseType, string>,
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    heroTitle: 'Real projects, from data to decision.',
    heroLead: 'A glimpse of what we did with companies like PepsiCo, Unilever and TV TEM.',
    heroCta: 'Tell us your challenge',
    count: (n: number) => `${n} ${n === 1 ? 'case study' : 'case studies'}`,
    filterLabel: 'Filter by project type',
    all: 'All',
    quickTitle: 'More BI projects.',
    quickLead: 'Dashboards delivered for companies across many industries.',
    quoteLabel: 'Testimonial',
    ctaTitle: 'The next case study could be yours.',
    ctaText: 'Tell us the problem. In one conversation we show you where to start and what we can deliver first.',
    ctaButton: 'Schedule a call',
    typeLabel: 'Project type',
    review: 'Before publishing',
    teaserTitle: 'Real case studies',
    teaserLead: 'Real problems, solved with data.',
    seeAll: 'See all',
    quoteOpen: '“',
    quoteClose: '”',
    types: { bi: 'BI and dashboards', data: 'Data engineering', systems: 'Systems and apps', automation: 'Automation', allocation: 'Dedicated team' },
  },
  es: {
    heroTitle: 'Proyectos reales, del dato a la decisión.',
    heroLead: 'Un poco de lo que hicimos con empresas como PepsiCo, Unilever y TV TEM.',
    heroCta: 'Cuéntenos su desafío',
    count: (n: number) => `${n} ${n === 1 ? 'caso' : 'casos'}`,
    filterLabel: 'Filtrar por tipo de proyecto',
    all: 'Todos',
    quickTitle: 'Más proyectos de BI.',
    quickLead: 'Paneles y dashboards entregados a empresas de varios sectores.',
    quoteLabel: 'Testimonio',
    ctaTitle: 'El próximo caso puede ser el suyo.',
    ctaText: 'Cuéntenos el problema. En una conversación le decimos por dónde empezar y qué se puede entregar primero.',
    ctaButton: 'Agende una conversación',
    typeLabel: 'Tipo de proyecto',
    review: 'Antes de publicar',
    teaserTitle: 'Casos reales',
    teaserLead: 'Problemas reales, resueltos con datos.',
    seeAll: 'Ver todos',
    quoteOpen: '“',
    quoteClose: '”',
    types: { bi: 'BI y paneles', data: 'Ingeniería de datos', systems: 'Sistemas y apps', automation: 'Automatización', allocation: 'Equipo dedicado' },
  },
  fr: {
    heroTitle: 'Des projets réels, de la donnée à la décision.',
    heroLead: 'Un aperçu de ce que nous avons fait avec des entreprises comme PepsiCo, Unilever et TV TEM.',
    heroCta: 'Parlez-nous de votre défi',
    count: (n: number) => `${n} ${n === 1 ? 'étude de cas' : 'études de cas'}`,
    filterLabel: 'Filtrer par type de projet',
    all: 'Tous',
    quickTitle: 'Plus de projets BI.',
    quickLead: 'Des tableaux de bord livrés à des entreprises de nombreux secteurs.',
    quoteLabel: 'Témoignage',
    ctaTitle: 'La prochaine étude de cas pourrait être la vôtre.',
    ctaText: 'Parlez-nous du problème. En une conversation, nous vous disons par où commencer et ce que nous pouvons livrer en premier.',
    ctaButton: 'Planifiez un échange',
    typeLabel: 'Type de projet',
    review: 'Avant publication',
    teaserTitle: 'Études de cas réelles',
    teaserLead: 'De vrais problèmes, résolus avec les données.',
    seeAll: 'Tout voir',
    quoteOpen: '« ',
    quoteClose: ' »',
    types: { bi: 'BI et tableaux de bord', data: 'Ingénierie des données', systems: 'Systèmes et applications', automation: 'Automatisation', allocation: 'Équipe dédiée' },
  },
};

const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

function Brand({ client, logo }: { client: string; logo?: { src: string; h: number } }) {
  return (
    <div className={c.brand}>
      {logo
        ? <img src={encodeURI(optLogo(logo.src))} alt={client} style={{ height: Math.min(56, logo.h * 1.35) }} loading="lazy" />
        : <span className={c.wordmark}>{client}</span>}
    </div>
  );
}

function Review({ text }: { text?: string }) {
  const t = useCopy(COPY);
  if (!text) return null;
  return (
    <p className={c.review}>
      <strong>{t.review}</strong>
      {text}
    </p>
  );
}

/** Cartão de case: marca, título, o que fizemos e as ferramentas. */
export function CaseCard({ item }: { item: ClientCase }) {
  const t = useCopy(COPY);
  const lang = useLang();
  return (
    <article className={c.caseCard}>
      <Brand client={item.client} logo={item.logo} />
      <h3 className={c.caseTitle}>{item.title[lang]}</h3>
      <p className={s.muted}>{item.summary[lang]}</p>
      <Review text={item.review} />
      <div className={c.caseFoot}>
        <ul className={c.tags} aria-label={t.typeLabel}>
          {item.types.slice(0, 2).map((x) => <li key={x} className={c.tag}>{t.types[x]}</li>)}
        </ul>
        {item.stack.length > 0 && <span className={c.stack}>{item.stack.join(' · ')}</span>}
      </div>
    </article>
  );
}

function BigQuote({ quote }: { quote: CaseQuote }) {
  const t = useCopy(COPY);
  const lang = useLang();
  return (
    <figure className={c.bigQuote} data-reveal>
      <blockquote>{t.quoteOpen}{quote.text[lang]}{t.quoteClose}</blockquote>
      <figcaption><strong>{quote.name}</strong>{quote.company}</figcaption>
    </figure>
  );
}

export function CasesClean({ cases, quick, types }: { cases: ClientCase[]; quick: QuickCase[]; types: readonly CaseType[] }) {
  const t = useCopy(COPY);
  const lang = useLang();
  const [type, setType] = useState<CaseType | null>(null);
  const available = useMemo(() => types.filter((x) => cases.some((k) => k.types.includes(x))), [cases, types]);
  const shown = type ? cases.filter((x) => x.types.includes(type)) : cases;
  const quote = cases.find((x) => x.featured && x.quote)?.quote;

  return (
    <CleanShell current="cases">
      <PageHero title={t.heroTitle} lead={t.heroLead}>
        <ContactButton>{t.heroCta}</ContactButton>
      </PageHero>

      <section className={`${s.band} ${s.bandFog}`} aria-labelledby="lista-titulo">
        <div className={s.wrap}>
          <div className={c.toolbar}>
            <h2 id="lista-titulo" className={c.count} aria-live="polite">{t.count(shown.length)}</h2>
            <div className={c.chips} role="group" aria-label={t.filterLabel}>
              <button type="button" className={c.chip} aria-pressed={type === null} onClick={() => setType(null)}>{t.all}</button>
              {available.map((x) => (
                <button key={x} type="button" className={c.chip} aria-pressed={type === x} onClick={() => setType(type === x ? null : x)}>{t.types[x]}</button>
              ))}
            </div>
          </div>
          <ul className={c.grid}>
            {shown.map((x) => <li key={x.slug}><CaseCard item={x} /></li>)}
          </ul>
        </div>
      </section>

      {quick.length > 0 && (
        <section className={s.band} aria-labelledby="rapidas-titulo">
          <div className={s.wrap}>
            <SectionHead id="rapidas-titulo" title={t.quickTitle}>{t.quickLead}</SectionHead>
            <ul className={c.quick} data-reveal>
              {quick.map((q) => (
                <li key={q.client}>
                  <span className={c.quickBrand}>
                    {q.logo
                      ? <img src={encodeURI(optLogo(q.logo.src))} alt={q.client} style={{ height: q.logo.h }} loading="lazy" />
                      : <span className={c.wordmark}>{q.client}</span>}
                  </span>
                  <span className={c.quickWhat}>{q.what[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {quote && (
        <section className={`${s.band} ${s.bandInk}`} aria-label={t.quoteLabel}>
          <div className={s.wrap}><BigQuote quote={quote} /></div>
        </section>
      )}

      <section className={`${s.band} ${s.bandTight}`} aria-labelledby="cta-titulo">
        <div className={s.wrap}>
          <div className={s.cta} data-reveal>
            <h2 id="cta-titulo" className={s.h2}>{t.ctaTitle}</h2>
            <div className={s.ctaActions}>
              <p>{t.ctaText}</p>
              <div className={s.ctaButtons}>
                <ContactButton>{t.ctaButton}</ContactButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CleanShell>
  );
}

/** Vitrine da home: três cases em destaque e o link para a lista. */
export function CasesTeaser({ cases }: { cases: ClientCase[] }) {
  const t = useCopy(COPY);
  if (!cases.length) return null;
  return (
    <section id="cases" className={s.band} aria-labelledby="cases-titulo">
      <div className={`${s.wrap} ${c.onPaper}`}>
        <SectionHead id="cases-titulo" title={t.teaserTitle}>
          {t.teaserLead} <SmartLink href={ROUTES.cases} className={s.link}>{t.seeAll}</SmartLink>
        </SectionHead>
        <ul className={`${c.grid} ${c.grid3}`}>
          {cases.map((x, i) => (
            <li key={x.slug} data-reveal style={delay(i * 90)}><CaseCard item={x} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
