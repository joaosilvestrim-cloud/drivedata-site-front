'use client';

// Cases do site: cartão (também usado na home), lista com filtro por tipo de
// projeto (página oficial /cases) e página de detalhe (/cases/[slug]). Os dados
// chegam por props da página de servidor, que já removeu as notas internas fora
// do ambiente local. Textos da interface em pt, en, es e fr (COPY); os textos de
// cada case vêm localizados em cases-data.ts e são lidos com `campo[lang]`.
import { useMemo, useState } from 'react';
import { ROUTES } from './content';
import type { CaseQuote, CaseTerm, CaseType, ClientCase, QuickCase } from './cases-data';
import { useCopy, useLang, type Copy, type Lang } from './i18n';
import { CleanShell, ContactButton } from './shell';
import { PageHero, SectionHead } from './ui';
import s from './clean.module.css';
import c from './cases.module.css';

const PT = {
  heroTitle: 'Projetos reais, do dado à decisão.',
  heroLead:
    'O que fizemos em empresas como PepsiCo, Unilever e TV TEM. Cada case conta o problema, o trabalho feito e as ferramentas usadas. Sem número inventado.',
  heroCta: 'Conte o seu desafio',
  count: (n: number) => `${n} ${n === 1 ? 'case' : 'cases'}`,
  filterLabel: 'Filtrar por tipo de projeto',
  all: 'Todos',
  quickTitle: 'Painéis entregues em semanas.',
  quickLead: 'Projetos curtos de BI, com escopo fechado e prazo curto.',
  quoteLabel: 'Depoimento',
  listCtaTitle: 'O próximo case pode ser o seu.',
  listCtaText: 'Conte o problema. Em uma conversa dizemos por onde começar e o que dá para entregar primeiro.',
  detailCtaTitle: 'Tem um desafio parecido?',
  detailCtaText: 'Conte como está hoje. Mostramos o caminho e o que dá para entregar primeiro.',
  ctaButton: 'Agendar uma conversa',
  seeAllCases: 'Ver todos os cases',
  readCase: 'Ler o case',
  typeLabel: 'Tipo de projeto',
  review: 'Antes de publicar',
  back: 'Todos os cases',
  challenge: 'O desafio',
  work: 'O que fizemos',
  tools: 'Ferramentas',
  sector: 'Setor',
  format: 'Formato',
  status: 'Status',
  detailsLabel: 'Detalhes do case',
  asideLabel: 'Resumo do projeto',
  related: 'Outros cases',
  teaserTitle: 'Cases reais',
  teaserLead: 'Problemas de verdade, resolvidos com dados.',
  seeAll: 'Ver todos',
  quoteOpen: '“',
  quoteClose: '”',
  // Mesma tabela de CASE_TYPE_LABEL (cases-data.ts), que o cliente não pode importar.
  types: { bi: 'BI e painéis', data: 'Engenharia de dados', systems: 'Sistemas e apps', automation: 'Automação', allocation: 'Alocação de time' } as Record<CaseType, string>,
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    heroTitle: 'Real projects, from data to decision.',
    heroLead:
      'What we did for companies like PepsiCo, Unilever and TV TEM. Each case study covers the problem, the work done and the tools used. No made-up numbers.',
    heroCta: 'Tell us your challenge',
    count: (n: number) => `${n} ${n === 1 ? 'case study' : 'case studies'}`,
    filterLabel: 'Filter by project type',
    all: 'All',
    quickTitle: 'Dashboards delivered in weeks.',
    quickLead: 'Short BI projects, with a fixed scope and a short timeline.',
    quoteLabel: 'Testimonial',
    listCtaTitle: 'The next case study could be yours.',
    listCtaText: 'Tell us the problem. In one conversation we show you where to start and what we can deliver first.',
    detailCtaTitle: 'Facing a similar challenge?',
    detailCtaText: 'Tell us where things stand today. We show you the path and what we can deliver first.',
    ctaButton: 'Schedule a call',
    seeAllCases: 'See all case studies',
    readCase: 'Read the case study',
    typeLabel: 'Project type',
    review: 'Before publishing',
    back: 'All case studies',
    challenge: 'The challenge',
    work: 'What we did',
    tools: 'Tools',
    sector: 'Industry',
    format: 'Engagement',
    status: 'Status',
    detailsLabel: 'Case study details',
    asideLabel: 'Project summary',
    related: 'More case studies',
    teaserTitle: 'Real case studies',
    teaserLead: 'Real problems, solved with data.',
    seeAll: 'See all',
    quoteOpen: '“',
    quoteClose: '”',
    types: { bi: 'BI and dashboards', data: 'Data engineering', systems: 'Systems and apps', automation: 'Automation', allocation: 'Dedicated team' },
  },
  es: {
    heroTitle: 'Proyectos reales, del dato a la decisión.',
    heroLead:
      'Lo que hicimos en empresas como PepsiCo, Unilever y TV TEM. Cada caso cuenta el problema, el trabajo realizado y las herramientas usadas. Sin números inventados.',
    heroCta: 'Cuéntenos su desafío',
    count: (n: number) => `${n} ${n === 1 ? 'caso' : 'casos'}`,
    filterLabel: 'Filtrar por tipo de proyecto',
    all: 'Todos',
    quickTitle: 'Paneles entregados en semanas.',
    quickLead: 'Proyectos cortos de BI, con alcance cerrado y plazo corto.',
    quoteLabel: 'Testimonio',
    listCtaTitle: 'El próximo caso puede ser el suyo.',
    listCtaText: 'Cuéntenos el problema. En una conversación le decimos por dónde empezar y qué se puede entregar primero.',
    detailCtaTitle: '¿Tiene un desafío parecido?',
    detailCtaText: 'Cuéntenos cómo está hoy. Le mostramos el camino y qué se puede entregar primero.',
    ctaButton: 'Agende una conversación',
    seeAllCases: 'Ver todos los casos',
    readCase: 'Leer el caso',
    typeLabel: 'Tipo de proyecto',
    review: 'Antes de publicar',
    back: 'Todos los casos',
    challenge: 'El desafío',
    work: 'Lo que hicimos',
    tools: 'Herramientas',
    sector: 'Sector',
    format: 'Formato',
    status: 'Estado',
    detailsLabel: 'Detalles del caso',
    asideLabel: 'Resumen del proyecto',
    related: 'Otros casos',
    teaserTitle: 'Casos reales',
    teaserLead: 'Problemas reales, resueltos con datos.',
    seeAll: 'Ver todos',
    quoteOpen: '“',
    quoteClose: '”',
    types: { bi: 'BI y paneles', data: 'Ingeniería de datos', systems: 'Sistemas y apps', automation: 'Automatización', allocation: 'Equipo dedicado' },
  },
  fr: {
    heroTitle: 'Des projets réels, de la donnée à la décision.',
    heroLead:
      'Ce que nous avons fait pour des entreprises comme PepsiCo, Unilever et TV TEM. Chaque étude de cas présente le problème, le travail réalisé et les outils utilisés. Aucun chiffre inventé.',
    heroCta: 'Parlez-nous de votre défi',
    count: (n: number) => `${n} ${n === 1 ? 'étude de cas' : 'études de cas'}`,
    filterLabel: 'Filtrer par type de projet',
    all: 'Tous',
    quickTitle: 'Des tableaux de bord livrés en quelques semaines.',
    quickLead: 'Des projets BI courts, au périmètre fixe et au délai court.',
    quoteLabel: 'Témoignage',
    listCtaTitle: 'La prochaine étude de cas pourrait être la vôtre.',
    listCtaText: 'Parlez-nous du problème. En une conversation, nous vous disons par où commencer et ce que nous pouvons livrer en premier.',
    detailCtaTitle: 'Vous avez un défi similaire ?',
    detailCtaText: 'Dites-nous où vous en êtes. Nous vous montrons le chemin et ce que nous pouvons livrer en premier.',
    ctaButton: 'Planifiez un échange',
    seeAllCases: 'Voir toutes les études de cas',
    readCase: "Lire l'étude de cas",
    typeLabel: 'Type de projet',
    review: 'Avant publication',
    back: 'Toutes les études de cas',
    challenge: 'Le défi',
    work: 'Ce que nous avons fait',
    tools: 'Outils',
    sector: 'Secteur',
    format: 'Formule',
    status: 'Statut',
    detailsLabel: "Détails de l'étude de cas",
    asideLabel: 'Résumé du projet',
    related: 'Autres études de cas',
    teaserTitle: 'Études de cas réelles',
    teaserLead: 'De vrais problèmes, résolus avec les données.',
    seeAll: 'Tout voir',
    quoteOpen: '« ',
    quoteClose: ' »',
    types: { bi: 'BI et tableaux de bord', data: 'Ingénierie des données', systems: 'Systèmes et applications', automation: 'Automatisation', allocation: 'Équipe dédiée' },
  },
};

const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });
export const caseHref = (x: ClientCase) => `${ROUTES.cases}/${x.slug}`;
const term = (t: CaseTerm, lang: Lang) => (typeof t === 'string' ? t : t[lang]);

function Brand({ item, big }: { item: ClientCase; big?: boolean }) {
  if (item.logo) {
    return (
      <div className={`${c.brand} ${big ? c.detailBrand : ''}`}>
        <img src={encodeURI(item.logo.src)} alt={item.client} style={{ height: Math.min(big ? 76 : 56, item.logo.h * (big ? 1.9 : 1.35)) }} loading="lazy" />
      </div>
    );
  }
  // Sem arquivo de logo: o nome do cliente faz o papel da marca.
  return (
    <div className={`${c.brand} ${big ? c.detailBrand : ''}`}>
      <span className={`${c.wordmark} ${big ? c.wordmarkBig : ''}`}>{item.client}</span>
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

/** Cartão de case: marca (ou setor), título, resumo e tipos. */
export function CaseCard({ item }: { item: ClientCase }) {
  const lang = useLang();
  const t = COPY[lang];
  return (
    <a href={caseHref(item)} className={c.caseCard}>
      <Brand item={item} />
      <h3 className={c.caseTitle}>{item.title[lang]}</h3>
      <p className={s.muted}>{item.summary[lang]}</p>
      <Review text={item.review} />
      <div className={c.caseFoot}>
        <ul className={c.tags} aria-label={t.typeLabel}>
          {item.types.slice(0, 2).map((k) => <li key={k} className={c.tag}>{t.types[k]}</li>)}
        </ul>
        <span className={c.more}>{t.readCase} <span className={s.arrow} aria-hidden="true">→</span></span>
      </div>
    </a>
  );
}

function BigQuote({ quote }: { quote: CaseQuote }) {
  const lang = useLang();
  const t = COPY[lang];
  return (
    <figure className={c.bigQuote} data-reveal>
      <blockquote>{t.quoteOpen}{quote.text[lang]}{t.quoteClose}</blockquote>
      <figcaption><strong>{quote.name}</strong>{quote.company}</figcaption>
    </figure>
  );
}

function Cta({ title, text }: { title: string; text: string }) {
  const t = useCopy(COPY);
  return (
    <section className={`${s.band} ${s.bandTight}`} aria-labelledby="cta-titulo">
      <div className={s.wrap}>
        <div className={s.cta} data-reveal>
          <h2 id="cta-titulo" className={s.h2}>{title}</h2>
          <div className={s.ctaActions}>
            <p>{text}</p>
            <div className={s.ctaButtons}>
              <ContactButton>{t.ctaButton}</ContactButton>
              <a href={ROUTES.cases} className={s.link}>{t.seeAllCases}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CasesClean({ cases, quick, types }: { cases: ClientCase[]; quick: QuickCase[]; types: readonly CaseType[] }) {
  const lang = useLang();
  const t = COPY[lang];
  const [type, setType] = useState<CaseType | null>(null);
  const available = useMemo(() => types.filter((k) => cases.some((x) => x.types.includes(k))), [cases, types]);
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
            <h2 id="lista-titulo" className={c.count} aria-live="polite">
              {t.count(shown.length)}
            </h2>
            <div className={c.chips} role="group" aria-label={t.filterLabel}>
              <button type="button" className={c.chip} aria-pressed={type === null} onClick={() => setType(null)}>{t.all}</button>
              {available.map((k) => (
                <button key={k} type="button" className={c.chip} aria-pressed={type === k} onClick={() => setType(type === k ? null : k)}>{t.types[k]}</button>
              ))}
            </div>
          </div>
          <ul className={c.grid}>
            {shown.map((x) => (
              <li key={x.slug}><CaseCard item={x} /></li>
            ))}
          </ul>
        </div>
      </section>

      {quick.length > 0 && (
        <section className={s.band} aria-labelledby="rapidas-titulo">
          <div className={s.wrap}>
            <SectionHead id="rapidas-titulo" title={t.quickTitle}>
              {t.quickLead}
            </SectionHead>
            <ul className={c.quick} data-reveal>
              {quick.map((q) => (
                <li key={q.client}>
                  <span className={c.quickBrand}>
                    {q.logo
                      ? <img src={encodeURI(q.logo.src)} alt={q.client} style={{ height: q.logo.h }} loading="lazy" />
                      : <span className={c.wordmark}>{q.client}</span>}
                    <span className={c.quickSector}>{q.sector[lang]}</span>
                  </span>
                  <span className={c.quickWhat}>{q.what[lang]}</span>
                  <span className={c.quickStack}>{q.stack[lang]}</span>
                  <span className={c.quickTime}>{q.time[lang]}</span>
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

      <Cta title={t.listCtaTitle} text={t.listCtaText} />
    </CleanShell>
  );
}

export function CaseDetailClean({ item, related }: { item: ClientCase; related: ClientCase[] }) {
  const lang = useLang();
  const t = COPY[lang];
  const facts = [
    { label: t.sector, value: item.sector[lang] },
    { label: t.format, value: item.format[lang] },
    ...(item.status ? [{ label: t.status, value: item.status[lang] }] : []),
    ...(item.facts ?? []).map((f) => ({ label: f.label[lang], value: f.value[lang] })),
  ];

  return (
    <CleanShell current="cases">
      <section className={c.detailHero} aria-labelledby="page-titulo">
        <div className={s.wrap}>
          <a href={ROUTES.cases} className={c.back}><span aria-hidden="true">←</span> {t.back}</a>
          <div className={c.detailHead}>
            <div>
              <h1 id="page-titulo" className={c.detailTitle}>{item.title[lang]}</h1>
              <p className={c.detailLead}>{item.summary[lang]}</p>
            </div>
            <Brand item={item} big />
          </div>
          <ul className={c.tags} aria-label={t.typeLabel}>
            {item.types.map((k) => <li key={k} className={c.tag}>{t.types[k]}</li>)}
          </ul>
        </div>
      </section>

      <section className={`${s.band} ${s.bandTight}`} aria-label={t.detailsLabel}>
        <div className={`${s.wrap} ${c.body}`}>
          <div className={c.article}>
            <Review text={item.review} />
            {item.challenge && (
              <div className={c.block} data-reveal>
                <h2>{t.challenge}</h2>
                <p>{item.challenge[lang]}</p>
              </div>
            )}
            <div className={c.block} data-reveal>
              <h2>{t.work}</h2>
              <ul className={c.workList}>
                {item.work[lang].map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>
            {item.quote && (
              <figure className={c.quoteCard} data-reveal>
                <blockquote>{t.quoteOpen}{item.quote.text[lang]}{t.quoteClose}</blockquote>
                <figcaption><strong>{item.quote.name}</strong>, {item.quote.company}</figcaption>
              </figure>
            )}
          </div>

          <aside className={c.aside} aria-label={t.asideLabel}>
            <dl className={c.facts}>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className={c.asideTitle}>{t.tools}</p>
              <ul className={c.tags}>
                {item.stack.map((x) => {
                  const label = term(x, lang);
                  return <li key={label} className={c.tag}>{label}</li>;
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`${s.band} ${s.bandFog}`} aria-labelledby="outros-titulo">
          <div className={s.wrap}>
            <SectionHead id="outros-titulo" title={t.related} />
            <ul className={`${c.grid} ${c.grid3}`}>
              {related.map((x, i) => (
                <li key={x.slug} data-reveal style={delay(i * 80)}><CaseCard item={x} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Cta title={t.detailCtaTitle} text={t.detailCtaText} />
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
          {t.teaserLead} <a href={ROUTES.cases} className={s.link}>{t.seeAll}</a>
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
