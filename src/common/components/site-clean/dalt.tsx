'use client';

// Página oficial da DALT (rota /dalt), no visual "clean", em pt, en, es e fr.
// Textos vêm da antiga landing DALT (chave "dalt" do i18n), só enxugados; as
// traduções reaproveitam as de src/common/i18n/locales sempre que cabem.
import { ROUTES } from './content';
import { useCopy, type Copy } from './i18n';
import { CleanShell, ContactButton } from './shell';
import { Icon } from './ui';
import s from './clean.module.css';
import d from './dalt.module.css';
import { SmartLink } from './link';

type Service = { title: string; items: string[] };
type Case = { title: string; text: string };

const PT = {
  headline: ['Desafios', 'complexos,', 'resultados', 'tangíveis.'],
  lead: 'A DALT é a consultoria da DriveData em dados, BI, engenharia e IA. Transformamos os desafios de grandes operações em eficiência e resultado.',
  talkToExpert: 'Fale com um especialista',
  seeServices: 'Ver serviços',
  tagsLabel: 'Frentes de atuação',
  tags: ['Inteligência de Negócios', 'Inovação', 'Engenharia de Dados', 'Desenvolvimento', 'IA'],
  clientsTitle: 'Expertise validada em operações globais',
  servicesTitle: 'Alta complexidade e missão crítica.',
  servicesLead: 'Construímos a sua base de dados ou alocamos squads seniores no seu time.',
  services: [
    {
      title: 'Engenharia de Dados',
      items: [
        'Data Lakes e Data Warehouses, da arquitetura à implementação.',
        'Pipelines de dados robustos e escaláveis.',
        'Performance e custo da infraestrutura otimizados.',
        'Governança e qualidade de dados para conformidade e confiança.',
      ],
    },
    {
      title: 'Outsourcing de Engenharia de Dados',
      items: [
        'Squads de engenheiros de dados seniores.',
        'Gestão completa dos projetos de dados.',
        'Uma equipe de dados flexível, que escala com você.',
        'Menos custo operacional, com expertise de ponta.',
      ],
    },
  ] as Service[],
  casesTitle: 'Inovação e resultado.',
  casesLead: 'Processos inteligentes e infraestrutura robusta para quem quer liderar o mercado. Com padrões globais de governança e segurança de dados.',
  cases: [
    { title: 'Logística operacional', text: 'Fluxo logístico otimizado com engenharia de dados.' },
    { title: 'Cockpit de gestão logística', text: 'Controle operacional em tempo real para grandes frotas.' },
    { title: 'Mineração e agronegócio', text: 'Inteligência de dados aplicada à mineração e ao agronegócio.' },
  ] as Case[],
  caseVideo: (title: string) => `Vídeo do case ${title}`,
  fitTitle: 'Tecnologia para quem decide o futuro de grandes operações.',
  isForTitle: 'É para você se',
  notForTitle: 'Não é para você se',
  isFor: [
    'Sua operação fatura acima de R$ 50M/ano e o caos de dados trava o crescimento.',
    'Você busca governança, segurança e escala de nível global.',
    'Sua equipe gasta mais tempo limpando planilhas do que gerando estratégia.',
    'Você precisa de um parceiro estratégico, não só de mão de obra técnica.',
  ],
  notFor: [
    'Você quer só um dashboard bonito, sem profundidade estratégica.',
    'Seu orçamento para inteligência de dados é inferior a R$ 50k/ano.',
    'Você acha que a solução para o caos de dados é mais uma planilha.',
    'Você não quer investir numa infraestrutura de dados robusta.',
  ],
  ctaTitle: 'Pronto para transformar gargalos em eficiência e ROI?',
  ctaText: 'Converse com nossos especialistas e descubra como escalar a sua operação de dados.',
  ctaButton: 'Agendar reunião de viabilidade',
  aboutLink: 'Conhecer a DriveData',
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    headline: ['Complex', 'challenges,', 'tangible', 'results.'],
    lead: 'DALT is the DriveData consultancy for data, BI, engineering and AI. We turn the challenges of large operations into efficiency and results.',
    talkToExpert: 'Talk to a specialist',
    seeServices: 'See services',
    tagsLabel: 'Areas of expertise',
    tags: ['Business Intelligence', 'Innovation', 'Data Engineering', 'Development', 'AI'],
    clientsTitle: 'Expertise proven in global operations',
    servicesTitle: 'High complexity and mission critical.',
    servicesLead: 'We build your data foundation or embed senior squads in your team.',
    services: [
      {
        title: 'Data Engineering',
        items: [
          'Data Lakes and Data Warehouses, from architecture to implementation.',
          'Robust, scalable data pipelines.',
          'Optimized infrastructure performance and cost.',
          'Data governance and quality for compliance and trust.',
        ],
      },
      {
        title: 'Data Engineering Outsourcing',
        items: [
          'Squads of senior data engineers.',
          'End-to-end management of data projects.',
          'A flexible data team that scales with you.',
          'Lower operating costs with leading-edge expertise.',
        ],
      },
    ],
    casesTitle: 'Innovation and results.',
    casesLead: 'Intelligent processes and robust infrastructure for those who want to lead their market. Built on global standards of data governance and security.',
    cases: [
      { title: 'Operational logistics', text: 'Logistics flow optimized with data engineering.' },
      { title: 'Logistics management cockpit', text: 'Real-time operational control for large fleets.' },
      { title: 'Mining and agribusiness', text: 'Data intelligence applied to mining and agribusiness.' },
    ],
    caseVideo: (title: string) => `Case study video: ${title}`,
    fitTitle: 'Technology for those who decide the future of large operations.',
    isForTitle: 'It is for you if',
    notForTitle: 'It is not for you if',
    isFor: [
      'Your operation bills over US$10M a year and data chaos is blocking growth.',
      'You want governance, security and world-class scale.',
      'Your team spends more time cleaning spreadsheets than building strategy.',
      'You need a strategic partner, not just technical hands.',
    ],
    notFor: [
      'You only want a good-looking dashboard with no strategic depth.',
      'Your budget for data intelligence is under US$10k a year.',
      'You believe the answer to data chaos is one more spreadsheet.',
      'You are not willing to invest in solid data infrastructure.',
    ],
    ctaTitle: 'Ready to turn bottlenecks into efficiency and ROI?',
    ctaText: 'Talk to our specialists and find out how to scale your data operation.',
    ctaButton: 'Book a feasibility meeting',
    aboutLink: 'Discover DriveData',
  },
  es: {
    headline: ['Desafíos', 'complejos,', 'resultados', 'tangibles.'],
    lead: 'DALT es la consultoría de DriveData en datos, BI, ingeniería e IA. Transformamos los desafíos de grandes operaciones en eficiencia y resultados.',
    talkToExpert: 'Hable con un especialista',
    seeServices: 'Ver servicios',
    tagsLabel: 'Áreas de actuación',
    tags: ['Inteligencia de Negocios', 'Innovación', 'Ingeniería de Datos', 'Desarrollo', 'IA'],
    clientsTitle: 'Experiencia validada en operaciones globales',
    servicesTitle: 'Alta complejidad y misión crítica.',
    servicesLead: 'Construimos su base de datos o asignamos squads senior a su equipo.',
    services: [
      {
        title: 'Ingeniería de Datos',
        items: [
          'Data Lakes y Data Warehouses, de la arquitectura a la implementación.',
          'Pipelines de datos robustos y escalables.',
          'Rendimiento y costo de la infraestructura optimizados.',
          'Gobernanza y calidad de datos para cumplimiento y confianza.',
        ],
      },
      {
        title: 'Outsourcing de Ingeniería de Datos',
        items: [
          'Squads de ingenieros de datos senior.',
          'Gestión completa de los proyectos de datos.',
          'Un equipo de datos flexible, que escala con usted.',
          'Menos costo operativo, con experiencia de punta.',
        ],
      },
    ],
    casesTitle: 'Innovación y resultado.',
    casesLead: 'Procesos inteligentes e infraestructura robusta para quien quiere liderar el mercado. Con estándares globales de gobernanza y seguridad de datos.',
    cases: [
      { title: 'Logística operativa', text: 'Flujo logístico optimizado con ingeniería de datos.' },
      { title: 'Cockpit de gestión logística', text: 'Control operativo en tiempo real para grandes flotas.' },
      { title: 'Minería y agronegocio', text: 'Inteligencia de datos aplicada a la minería y al agronegocio.' },
    ],
    caseVideo: (title: string) => `Video del caso ${title}`,
    fitTitle: 'Tecnología para quien decide el futuro de grandes operaciones.',
    isForTitle: 'Es para usted si',
    notForTitle: 'No es para usted si',
    isFor: [
      'Su operación factura más de US$10M al año y el caos de datos frena el crecimiento.',
      'Busca gobernanza, seguridad y escala de nivel global.',
      'Su equipo pasa más tiempo limpiando planillas que generando estrategia.',
      'Necesita un socio estratégico, no solo mano de obra técnica.',
    ],
    notFor: [
      'Solo busca un panel bonito sin profundidad estratégica.',
      'Su presupuesto para inteligencia de datos es inferior a US$10k al año.',
      'Cree que la solución al caos de datos es otra planilla.',
      'No está dispuesto a invertir en una infraestructura de datos sólida.',
    ],
    ctaTitle: '¿Listo para transformar cuellos de botella en eficiencia y ROI?',
    ctaText: 'Hable con nuestros especialistas y descubra cómo escalar su operación de datos.',
    ctaButton: 'Agendar reunión de viabilidad',
    aboutLink: 'Conocer DriveData',
  },
  fr: {
    headline: ['Défis', 'complexes,', 'résultats', 'tangibles.'],
    lead: 'DALT est le cabinet-conseil de DriveData en données, BI, ingénierie et IA. Nous transformons les défis des grandes opérations en efficacité et en résultats.',
    talkToExpert: 'Parlez à un spécialiste',
    seeServices: 'Voir les services',
    tagsLabel: "Domaines d'expertise",
    tags: ["Intelligence d'affaires", 'Innovation', 'Ingénierie de données', 'Développement', 'IA'],
    clientsTitle: 'Expertise éprouvée dans des opérations mondiales',
    servicesTitle: 'Haute complexité et mission critique.',
    servicesLead: 'Nous bâtissons votre socle de données ou intégrons des équipes seniors à la vôtre.',
    services: [
      {
        title: 'Ingénierie de données',
        items: [
          "Data Lakes et Data Warehouses, de l'architecture à la mise en œuvre.",
          'Pipelines de données robustes et évolutifs.',
          "Performance et coût de l'infrastructure optimisés.",
          'Gouvernance et qualité des données pour la conformité et la confiance.',
        ],
      },
      {
        title: 'Impartition en ingénierie de données',
        items: [
          "Équipes d'ingénieurs de données seniors.",
          'Gestion complète des projets de données.',
          'Une équipe de données souple, qui évolue avec vous.',
          "Moins de coûts d'exploitation, avec une expertise de pointe.",
        ],
      },
    ],
    casesTitle: 'Innovation et résultat.',
    casesLead: 'Des processus intelligents et une infrastructure robuste pour ceux qui veulent mener leur marché. Selon les normes mondiales de gouvernance et de sécurité des données.',
    cases: [
      { title: 'Logistique opérationnelle', text: "Flux logistique optimisé grâce à l'ingénierie de données." },
      { title: 'Cockpit de gestion logistique', text: 'Contrôle opérationnel en temps réel pour de grandes flottes.' },
      { title: 'Mines et agro-industrie', text: "Intelligence de données appliquée aux mines et à l'agro-industrie." },
    ],
    caseVideo: (title: string) => `Vidéo de l'étude de cas ${title}`,
    fitTitle: "La technologie pour ceux qui décident de l'avenir des grandes opérations.",
    isForTitle: "C'est pour vous si",
    notForTitle: "Ce n'est pas pour vous si",
    isFor: [
      "Votre exploitation dépasse 10 M$ de chiffre d'affaires par an et le chaos des données freine la croissance.",
      'Vous recherchez gouvernance, sécurité et envergure mondiale.',
      "Votre équipe passe plus de temps à nettoyer des feuilles de calcul qu'à bâtir la stratégie.",
      "Vous cherchez un partenaire stratégique, pas seulement de la main-d'œuvre technique.",
    ],
    notFor: [
      'Vous voulez seulement un tableau de bord joli, sans profondeur stratégique.',
      'Votre budget en intelligence de données est inférieur à 10 k$ par an.',
      'Vous croyez que la réponse au chaos des données est une feuille de calcul de plus.',
      "Vous n'êtes pas prêt à investir dans une infrastructure de données solide.",
    ],
    ctaTitle: "Prêt à transformer les goulots d'étranglement en efficacité et ROI?",
    ctaText: 'Parlez à nos spécialistes et découvrez comment faire croître votre exploitation de données.',
    ctaButton: 'Planifier une rencontre de faisabilité',
    aboutLink: 'Découvrir DriveData',
  },
};

// Mesmos clientes e arquivos da landing antiga. `h` equilibra o peso visual.
const CLIENTS = [
  { name: 'Unilever', src: '/dalt/unilever.png', h: 44 },
  { name: 'Visa', src: '/dalt/visa_logo.png', h: 24 },
  { name: 'PepsiCo', src: '/dalt/pepsico_logo.png', h: 28 },
  { name: "McDonald's", src: '/dalt/mcdonalds_logo.png', h: 36 },
  { name: 'Tambasa', src: '/dalt/tambasa_logo.png', h: 26 },
  { name: 'McCain', src: '/dalt/mcclain_logo.png', h: 40 },
];

// Só 6 logos não enchem a tela: a faixa leva 4 cópias (a animação anda meia
// faixa, então o laço continua sem pulo). Cópias ficam fora do leitor de tela.
const TRACK = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];

// Ícones na mesma ordem de COPY.services.
const SERVICE_ICONS = [
  'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
];

// Vídeos na mesma ordem de COPY.cases.
const VIDEO_BASE = 'https://eu2.contabostorage.com/2eab22ce78334cb3b7e265047071b10d:site/dalt';
const CASE_VIDEOS = [`${VIDEO_BASE}/Docas.mp4`, `${VIDEO_BASE}/LogiAI.mp4`, `${VIDEO_BASE}/AthoBIM.mp4`];

const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });

export function DaltClean() {
  const t = useCopy(COPY);
  const headline = t.headline;
  return (
    <CleanShell current="solutions">
      <section className={`${s.pageHero} ${d.hero}`} aria-labelledby="dalt-titulo">
        <div className={s.wrap}>
          <h1 id="dalt-titulo" className={`${s.display} ${s.displayLeft} ${s.words} ${d.title}`} aria-label={headline.join(' ')}>
            {headline.map((w, i) => (
              <span key={i} aria-hidden="true" style={{ ['--i' as string]: i }}>{w}{i < headline.length - 1 ? ' ' : ''}</span>
            ))}
          </h1>
          <div className={`${s.pageHeroFoot} ${s.fadeIn}`}>
            <p className={s.lead}>{t.lead}</p>
            <div className={`${s.actions} ${d.heroActions}`}>
              <ContactButton>{t.talkToExpert}</ContactButton>
              <a href="#servicos" className={s.link}>{t.seeServices}</a>
            </div>
          </div>
          <ul className={`${d.tags} ${s.fadeIn} ${s.fadeInLate}`} aria-label={t.tagsLabel}>
            {t.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </div>
      </section>

      <section className={s.proofBand} aria-labelledby="clientes-titulo">
        <div className={s.wrap}>
          <div className={`${s.proof} ${d.proof}`}>
            <h2 id="clientes-titulo" className={s.proofTitle}>{t.clientsTitle}</h2>
            <div className={`${s.marquee} ${d.logos}`}>
              <ul className={s.marqueeTrack}>
                {TRACK.map((c, i) => (
                  <li key={`${c.name}-${i}`} aria-hidden={i >= CLIENTS.length ? true : undefined}>
                    <img src={c.src} alt={i >= CLIENTS.length ? '' : c.name} loading="lazy" style={{ height: c.h }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className={s.band} aria-labelledby="servicos-titulo">
        <div className={s.wrap}>
          <div className={s.sectionHead} data-reveal>
            <h2 id="servicos-titulo" className={`${s.h2} ${d.h2Narrow}`}>{t.servicesTitle}</h2>
            <p className={s.muted}>{t.servicesLead}</p>
          </div>
          <ul className={d.services}>
            {t.services.map((sv, i) => (
              <li key={i} className={d.service} data-reveal style={delay(i * 100)}>
                <span className={`${s.icon} ${d.serviceIcon}`}><Icon d={SERVICE_ICONS[i]} /></span>
                <h3 className={d.serviceTitle}>{sv.title}</h3>
                <ul className={d.serviceList}>
                  {sv.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="cases" className={`${s.band} ${s.bandInk}`} aria-labelledby="cases-titulo">
        <div className={s.wrap}>
          <div className={`${s.split} ${d.inkHead}`} data-reveal>
            <h2 id="cases-titulo" className={s.h2}>{t.casesTitle}</h2>
            <p className={s.lead}>{t.casesLead}</p>
          </div>
          <ul className={d.cases}>
            {t.cases.map((c, i) => (
              <li key={i} className={d.case} data-reveal style={delay(i * 100)}>
                <video controls playsInline preload="metadata" aria-label={t.caseVideo(c.title)}>
                  <source src={`${CASE_VIDEOS[i]}#t=2`} type="video/mp4" />
                </video>
                <div className={d.caseBody}>
                  <h3 className={s.h3}>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="perfil" className={s.band} aria-labelledby="perfil-titulo">
        <div className={s.wrap}>
          <h2 id="perfil-titulo" className={`${s.h2} ${d.h2Wide}`} data-reveal>{t.fitTitle}</h2>
          <div className={s.fitGrid}>
            <div data-reveal>
              <h3 className={s.fitTitle}>{t.isForTitle}</h3>
              <ul className={s.fitList}>
                {t.isFor.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
            <div data-reveal style={delay(100)}>
              <h3 className={s.fitTitle}>{t.notForTitle}</h3>
              <ul className={`${s.fitList} ${s.fitNot}`}>
                {t.notFor.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className={`${s.band} ${s.bandTight}`} aria-labelledby="cta-titulo">
        <div className={s.wrap}>
          <div className={s.cta} data-reveal>
            <h2 id="cta-titulo" className={s.h2}>{t.ctaTitle}</h2>
            <div className={s.ctaActions}>
              <p>{t.ctaText}</p>
              <div className={s.ctaButtons}>
                <ContactButton>{t.ctaButton}</ContactButton>
                <SmartLink href={ROUTES.about} className={s.link}>{t.aboutLink}</SmartLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CleanShell>
  );
}
