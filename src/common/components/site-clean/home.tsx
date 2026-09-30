'use client';

// Home do site (rota /).
import type { TargetAudienceProfileModel } from '@/common/model/target-audience-profile.model';
import { ACADEMY, ROUTES, ext, stripHtml } from './content';
import { useCopy, type Copy } from './i18n';
import { CleanShell, ContactButton } from './shell';
import { DataScene } from './data-scene';
import { Hero4D } from './hero-4d';
import { CasesTeaser } from './cases';
import type { ClientCase } from './cases-data';
import { Icon, LogoWall, SectionHead, type WallLogo } from './ui';
import s from './clean.module.css';
import { SmartLink } from './link';

const PT = {
  headline: ['Decida', 'com', 'dados,', 'não', 'com', 'achismo.'],
  lead: 'Conectamos seus sistemas, automatizamos os relatórios e colocamos os números certos na mão de quem decide. Dados, BI, engenharia e IA para empresas que jogam para ganhar.',
  demo: 'Agende uma demonstração',
  heroVisual: 'Escultura de dados em movimento: uma esfera de pontos vira o D da DriveData, um gráfico de barras, uma rosca, uma linha de tendência, um banco de dados e uma superfície de dados.',
  seeSolutions: 'Ver soluções',
  clients: 'Clientes',
  marquee: 'Empresas que já trocaram o achismo por dados',
  chaosTitle: 'Seu maior inimigo é o caos dos seus dados.',
  chaosText: 'Planilhas que nunca batem, sistemas que não conversam e horas de trabalho manual. É daí que nasce o achismo. Nós unificamos vendas, marketing, finanças e operações numa única fonte da verdade.',
  gains: [
    { title: 'Aumentar a receita', text: 'Padrões de consumo, cross-sell e previsão de demanda para agir antes do mercado.' },
    { title: 'Reduzir custos', text: 'Relatórios manuais automatizados, sem retrabalho e sem erro de planilha.' },
    { title: 'Ganhar agilidade', text: 'Informação atualizada para responder ao mercado antes da concorrência.' },
    { title: 'Liberar seu tempo', text: 'Horas de coleta viram minutos de análise. A equipe foca no que decide.' },
  ],
  solutionsTitle: 'Por onde começar',
  solutionsText: 'Três caminhos para o mesmo objetivo: menos planilha e mais decisão.',
  solutions: [
    { tag: 'Consultoria', text: 'Dados, BI, engenharia e IA sob medida para a sua operação. Do diagnóstico ao painel em uso.' },
    { tag: 'Produto', text: 'Acesso e governança sobre o Microsoft Fabric, com cada usuário vendo só o que deve ver.' },
    { tag: 'Treinamento', text: 'Cursos e trilhas práticas de dados, BI e analytics para você e a sua equipe.' },
  ],
  learnMore: 'Conhecer',
  horizonTitle: 'Do caos à decisão.',
  horizonText: 'Veja o que acontece com os seus dados quando a DriveData entra. Primeiro tudo vira uma fonte única. Depois, a fonte única vira previsão.',
  horizonHint: 'Escolha uma etapa, arraste para girar e mova o horizonte. Cenário ilustrativo.',
  stepsTitle: 'Como trabalhamos, em 3 passos.',
  steps: [
    { title: 'Diagnóstico e conexão', text: 'Entendemos o seu objetivo e conectamos as fontes: ERP, CRM, planilhas e o que mais existir.' },
    { title: 'Automação e inteligência', text: 'Estruturamos e automatizamos o fluxo. O trabalho manual some e a informação passa a chegar confiável.' },
    { title: 'Visualização e estratégia', text: 'Painéis claros e indicadores acionáveis na mão de quem decide. E seguimos juntos depois da entrega.' },
  ],
  fitTitle: 'Somos para líderes que jogam para ganhar.',
  isFor: 'É para',
  notFor: 'Não é para',
  ctaTitle: 'Pronto para decidir com dados?',
  ctaText: 'Agende uma demonstração e veja como tiramos o caos do caminho do seu crescimento.',
  ctaButton: 'Agendar demonstração',
  ctaAbout: 'Conhecer a DriveData',
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    headline: ['Decide', 'with', 'data,', 'not', 'gut', 'feeling.'],
    lead: 'We connect your systems, automate your reports and put the right numbers in the hands of decision makers. Data, BI, engineering and AI for companies that play to win.',
    demo: 'Schedule a demo',
    heroVisual: 'Moving data sculpture: a sphere of points becomes the DriveData D, a bar chart, a donut chart, a trend line, a database and a data surface.',
    seeSolutions: 'See solutions',
    clients: 'Clients',
    marquee: 'Companies that traded gut feeling for data',
    chaosTitle: 'Your biggest enemy is the chaos in your data.',
    chaosText: 'Spreadsheets that never match, systems that do not talk to each other and hours of manual work. That is where gut feeling comes from. We unify sales, marketing, finance and operations into a single source of truth.',
    gains: [
      { title: 'Increase revenue', text: 'Consumption patterns, cross-selling and demand forecasting to act before the market does.' },
      { title: 'Reduce costs', text: 'Manual reports automated, with no rework and no spreadsheet errors.' },
      { title: 'Gain agility', text: 'Up-to-date information to respond to the market before your competitors.' },
      { title: 'Free up your time', text: 'Hours of data gathering become minutes of analysis. Your team focuses on decisions.' },
    ],
    solutionsTitle: 'Where to start',
    solutionsText: 'Three paths to the same goal: fewer spreadsheets and more decisions.',
    solutions: [
      { tag: 'Consulting', text: 'Data, BI, engineering and AI tailored to your operation. From diagnosis to a dashboard in use.' },
      { tag: 'Product', text: 'Access and governance on top of Microsoft Fabric, with each user seeing only what they should.' },
      { tag: 'Training', text: 'Hands-on data, BI and analytics courses and learning paths for you and your team.' },
    ],
    learnMore: 'Learn more',
    horizonTitle: 'From chaos to decision.',
    horizonText: 'See what happens to your data when DriveData steps in. First everything becomes a single source. Then that single source becomes a forecast.',
    horizonHint: 'Pick a stage, drag to rotate and move the horizon. Illustrative scenario.',
    stepsTitle: 'How we work, in 3 steps.',
    steps: [
      { title: 'Diagnosis and connection', text: 'We understand your goal and connect your sources: ERP, CRM, spreadsheets and anything else you use.' },
      { title: 'Automation and intelligence', text: 'We structure and automate the flow. Manual work disappears and information arrives reliably.' },
      { title: 'Visualization and strategy', text: 'Clear dashboards and actionable metrics in the hands of decision makers. And we stay with you after delivery.' },
    ],
    fitTitle: 'We are for leaders who play to win.',
    isFor: 'It is for',
    notFor: 'It is not for',
    ctaTitle: 'Ready to decide with data?',
    ctaText: 'Schedule a demo and see how we clear the chaos out of your growth path.',
    ctaButton: 'Schedule a demo',
    ctaAbout: 'Get to know DriveData',
  },
  es: {
    headline: ['Decida', 'con', 'datos,', 'no', 'por', 'intuición.'],
    lead: 'Conectamos sus sistemas, automatizamos los informes y ponemos los números correctos en manos de quien decide. Datos, BI, ingeniería e IA para empresas que juegan para ganar.',
    demo: 'Agende una demostración',
    heroVisual: 'Escultura de datos en movimiento: una esfera de puntos se convierte en la D de DriveData, un gráfico de barras, una dona, una línea de tendencia, una base de datos y una superficie de datos.',
    seeSolutions: 'Ver soluciones',
    clients: 'Clientes',
    marquee: 'Empresas que ya cambiaron la intuición por datos',
    chaosTitle: 'Su mayor enemigo es el caos de sus datos.',
    chaosText: 'Hojas de cálculo que nunca cuadran, sistemas que no se comunican y horas de trabajo manual. De ahí nacen las decisiones por intuición. Unificamos ventas, marketing, finanzas y operaciones en una única fuente de verdad.',
    gains: [
      { title: 'Aumentar los ingresos', text: 'Patrones de consumo, venta cruzada y previsión de demanda para actuar antes que el mercado.' },
      { title: 'Reducir costos', text: 'Informes manuales automatizados, sin retrabajo y sin errores de hoja de cálculo.' },
      { title: 'Ganar agilidad', text: 'Información actualizada para responder al mercado antes que la competencia.' },
      { title: 'Liberar su tiempo', text: 'Horas de recopilación se vuelven minutos de análisis. El equipo se enfoca en decidir.' },
    ],
    solutionsTitle: 'Por dónde empezar',
    solutionsText: 'Tres caminos para el mismo objetivo: menos hojas de cálculo y más decisiones.',
    solutions: [
      { tag: 'Consultoría', text: 'Datos, BI, ingeniería e IA a la medida de su operación. Del diagnóstico al panel en uso.' },
      { tag: 'Producto', text: 'Acceso y gobernanza sobre Microsoft Fabric, con cada usuario viendo solo lo que debe ver.' },
      { tag: 'Capacitación', text: 'Cursos y rutas prácticas de datos, BI y analytics para usted y su equipo.' },
    ],
    learnMore: 'Conocer',
    horizonTitle: 'Del caos a la decisión.',
    horizonText: 'Vea lo que pasa con sus datos cuando DriveData entra. Primero todo se vuelve una fuente única. Después, esa fuente única se vuelve previsión.',
    horizonHint: 'Elija una etapa, arrastre para girar y mueva el horizonte. Escenario ilustrativo.',
    stepsTitle: 'Cómo trabajamos, en 3 pasos.',
    steps: [
      { title: 'Diagnóstico y conexión', text: 'Entendemos su objetivo y conectamos las fuentes: ERP, CRM, hojas de cálculo y todo lo que exista.' },
      { title: 'Automatización e inteligencia', text: 'Estructuramos y automatizamos el flujo. El trabajo manual desaparece y la información llega confiable.' },
      { title: 'Visualización y estrategia', text: 'Paneles claros e indicadores accionables en manos de quien decide. Y seguimos juntos después de la entrega.' },
    ],
    fitTitle: 'Somos para líderes que juegan para ganar.',
    isFor: 'Es para',
    notFor: 'No es para',
    ctaTitle: '¿Listo para decidir con datos?',
    ctaText: 'Agende una demostración y vea cómo sacamos el caos del camino de su crecimiento.',
    ctaButton: 'Agendar demostración',
    ctaAbout: 'Conocer DriveData',
  },
  fr: {
    headline: ['Décidez', 'avec', 'des', 'données,', 'pas', 'à', 'l’intuition.'],
    lead: 'Nous connectons vos systèmes, automatisons vos rapports et mettons les bons chiffres entre les mains de ceux qui décident. Données, BI, ingénierie et IA pour les entreprises qui jouent pour gagner.',
    demo: 'Planifier une démo',
    heroVisual: 'Sculpture de données en mouvement : une sphère de points devient le D de DriveData, un histogramme, un anneau, une courbe de tendance, une base de données et une surface de données.',
    seeSolutions: 'Voir les solutions',
    clients: 'Clients',
    marquee: 'Des entreprises qui ont remplacé l’intuition par les données',
    chaosTitle: 'Votre pire ennemi, c’est le chaos de vos données.',
    chaosText: 'Des tableurs qui ne concordent jamais, des systèmes qui ne se parlent pas et des heures de travail manuel. C’est de là que naît l’intuition. Nous unifions ventes, marketing, finances et opérations en une seule source de vérité.',
    gains: [
      { title: 'Augmenter les revenus', text: 'Habitudes de consommation, ventes croisées et prévision de la demande pour agir avant le marché.' },
      { title: 'Réduire les coûts', text: 'Rapports manuels automatisés, sans reprises ni erreurs de tableur.' },
      { title: 'Gagner en agilité', text: 'Une information à jour pour répondre au marché avant vos concurrents.' },
      { title: 'Libérer votre temps', text: 'Des heures de collecte deviennent des minutes d’analyse. L’équipe se concentre sur la décision.' },
    ],
    solutionsTitle: 'Par où commencer',
    solutionsText: 'Trois chemins vers le même objectif : moins de tableurs et plus de décisions.',
    solutions: [
      { tag: 'Conseil', text: 'Données, BI, ingénierie et IA sur mesure pour votre activité. Du diagnostic au tableau de bord en service.' },
      { tag: 'Produit', text: 'Accès et gouvernance sur Microsoft Fabric, chaque utilisateur ne voyant que ce qu’il doit voir.' },
      { tag: 'Formation', text: 'Cours et parcours pratiques en données, BI et analytique pour vous et votre équipe.' },
    ],
    learnMore: 'Découvrir',
    horizonTitle: 'Du chaos à la décision.',
    horizonText: 'Voyez ce qui arrive à vos données quand DriveData intervient. D’abord tout devient une source unique. Ensuite, cette source unique devient une prévision.',
    horizonHint: 'Choisissez une étape, faites glisser pour pivoter et déplacez l’horizon. Scénario illustratif.',
    stepsTitle: 'Notre méthode, en 3 étapes.',
    steps: [
      { title: 'Diagnostic et connexion', text: 'Nous comprenons votre objectif et connectons vos sources : ERP, CRM, tableurs et tout le reste.' },
      { title: 'Automatisation et intelligence', text: 'Nous structurons et automatisons le flux. Le travail manuel disparaît et l’information arrive fiable.' },
      { title: 'Visualisation et stratégie', text: 'Des tableaux de bord clairs et des indicateurs exploitables pour ceux qui décident. Et nous restons à vos côtés après la livraison.' },
    ],
    fitTitle: 'Nous sommes là pour les leaders qui jouent pour gagner.',
    isFor: 'C’est pour',
    notFor: 'Ce n’est pas pour',
    ctaTitle: 'Prêt à décider avec des données ?',
    ctaText: 'Planifiez une démo et voyez comment nous dégageons le chaos du chemin de votre croissance.',
    ctaButton: 'Planifier une démo',
    ctaAbout: 'Découvrir DriveData',
  },
};

const GAIN_ICONS = [
  'M3 17l6-6 4 4 8-8M14 7h7v7',
  'M3 7l6 6 4-4 8 8M14 17h7v-7',
  'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
];

const SOLUTION_LINKS = [
  { title: 'DALT', href: ROUTES.dalt },
  { title: 'Portal Fabric', href: ROUTES.fabric },
  { title: 'Academy', href: ACADEMY },
];

const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

export function HomeClean({ profiles, cases, logos }: { profiles: TargetAudienceProfileModel[]; cases: ClientCase[]; logos: WallLogo[] }) {
  const t = useCopy(COPY);
  const isFor = profiles.filter((p) => p.type === 'CUSTOMER');
  const notFor = profiles.filter((p) => p.type === 'NON_CUSTOMER');

  return (
    <CleanShell>
      <section className={s.hero} aria-labelledby="hero-titulo">
        <div className={`${s.wrap} ${s.heroText}`}>
          <h1 id="hero-titulo" className={`${s.display} ${s.words}`} aria-label={t.headline.join(' ')}>
            {t.headline.map((w, i) => (
              <span key={`${w}-${i}`} aria-hidden="true" style={{ ['--i' as string]: i }}>{w}{i < t.headline.length - 1 ? ' ' : ''}</span>
            ))}
          </h1>
          <p className={`${s.lead} ${s.fadeIn}`}>{t.lead}</p>
          <div className={`${s.actions} ${s.fadeIn} ${s.fadeInLate}`}>
            <ContactButton>{t.demo}</ContactButton>
            <a href="#solucoes" className={s.link}>{t.seeSolutions}</a>
          </div>
        </div>
        <div className={s.stage}>
          <Hero4D label={t.heroVisual} />
        </div>
      </section>

      <section id="clientes" className={s.proofBand} aria-label={t.clients}>
        <div className={s.wrap}><LogoWall title={t.marquee} logos={logos} /></div>
      </section>

      <section className={s.band} aria-labelledby="caos-titulo">
        <div className={s.wrap}>
          <div className={s.split} data-reveal>
            <h2 id="caos-titulo" className={s.h2}>{t.chaosTitle}</h2>
            <p className={s.lead}>{t.chaosText}</p>
          </div>
          <ul className={s.gains}>
            {t.gains.map((g, i) => (
              <li key={i} className={s.gain} data-reveal style={delay(i * 80)}>
                <span className={s.icon}><Icon d={GAIN_ICONS[i]} /></span>
                <h3 className={s.h3}>{g.title}</h3>
                <p className={s.muted}>{g.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="solucoes" className={`${s.band} ${s.bandFog}`} aria-labelledby="solucoes-titulo">
        <div className={s.wrap}>
          <SectionHead id="solucoes-titulo" title={t.solutionsTitle}>{t.solutionsText}</SectionHead>
          <ul className={s.cards}>
            {t.solutions.map((c, i) => (
              <li key={SOLUTION_LINKS[i].title} data-reveal style={delay(i * 90)}>
                <SmartLink href={SOLUTION_LINKS[i].href} className={s.card} {...ext(SOLUTION_LINKS[i].href)}>
                  <span className={s.cardTag}>{c.tag}</span>
                  <h3 className={s.cardTitle}>{SOLUTION_LINKS[i].title}</h3>
                  <p className={s.muted}>{c.text}</p>
                  <span className={s.cardMore}>{t.learnMore} <span className={s.arrow} aria-hidden="true">→</span></span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CasesTeaser cases={cases} />

      <section className={`${s.band} ${s.bandFog}`} aria-labelledby="horizonte-titulo">
        <div className={`${s.wrap} ${s.horizon}`}>
          <div className={s.horizonText} data-reveal>
            <h2 id="horizonte-titulo" className={s.h2}>{t.horizonTitle}</h2>
            <p className={s.lead}>{t.horizonText}</p>
            <p className={s.muted}>{t.horizonHint}</p>
          </div>
          <div data-reveal style={delay(120)}><DataScene /></div>
        </div>
      </section>

      <section className={`${s.band} ${s.bandInk}`} aria-labelledby="passos-titulo">
        <div className={s.wrap}>
          <h2 id="passos-titulo" className={s.h2} data-reveal>{t.stepsTitle}</h2>
          <ol className={s.steps}>
            {t.steps.map((st, i) => (
              <li key={i} className={s.step} data-reveal style={delay(i * 120)}>
                <span className={s.stepNum} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.h3}>{st.title}</h3>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {(isFor.length > 0 || notFor.length > 0) && (
        <section className={s.band} aria-labelledby="perfil-titulo">
          <div className={s.wrap}>
            <h2 id="perfil-titulo" className={s.h2} data-reveal>{t.fitTitle}</h2>
            <div className={s.fitGrid}>
              <div data-reveal>
                <h3 className={s.fitTitle}>{t.isFor}</h3>
                <ul className={s.fitList}>
                  {isFor.map((p) => <li key={p.id}><strong>{p.title}</strong>{stripHtml(p.description)}</li>)}
                </ul>
              </div>
              <div data-reveal style={delay(100)}>
                <h3 className={s.fitTitle}>{t.notFor}</h3>
                <ul className={`${s.fitList} ${s.fitNot}`}>
                  {notFor.map((p) => <li key={p.id}>{stripHtml(p.description)}</li>)}
                </ul>
              </div>
            </div>
          </div>
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
                <SmartLink href={ROUTES.about} className={s.link}>{t.ctaAbout}</SmartLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CleanShell>
  );
}
