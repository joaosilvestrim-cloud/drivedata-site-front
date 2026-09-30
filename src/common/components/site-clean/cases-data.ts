// Cases do site (página /cases e vitrine da home). Regra do João (30/09/2026):
// o site institucional não expõe o cliente. Cada case diz só O QUE FIZEMOS, em
// uma frase, com as ferramentas. Nada de status (em andamento), desafio interno,
// prazos, tamanho de time, unidade, país, valor, hora ou margem.
//
// Só importar em componente de servidor (page.tsx); no cliente, só `import type`.
// O campo `review` é nota interna e sai fora do ambiente de desenvolvimento.
import type { Copy, Lang } from './i18n';

export const CASE_TYPES = ['bi', 'data', 'systems', 'automation', 'allocation'] as const;
export type CaseType = (typeof CASE_TYPES)[number];

export type CaseQuote = { text: Copy<string>; name: string; company: string };

export type ClientCase = {
  slug: string;
  client: string;
  /** Sem arquivo de logo, o cartão mostra o nome do cliente como marca. */
  logo?: { src: string; h: number };
  types: CaseType[];
  title: Copy<string>;
  /** O que fizemos, em uma frase. */
  summary: Copy<string>;
  stack: string[];
  quote?: CaseQuote;
  featured?: boolean;
  review?: string;
};

export type QuickCase = { client: string; logo?: { src: string; h: number }; what: Copy<string> };

const L = (pt: string, en: string, es: string, fr: string): Copy<string> => ({ pt, en, es, fr });

// Mesmos textos publicados na tabela testimonial (seção de depoimentos do site).
const QUOTE_PEPSICO: CaseQuote = {
  text: L(
    'Agilizou a apresentação dos nossos resultados, eliminando todo o trabalho manual com arquivos e apresentações. Aumentou o nível de análise, ajudando-nos a identificar oportunidades e a alinhar a estratégia ao negócio. Além disso, contamos com uma equipe extremamente dedicada.',
    'It sped up how we present our results and removed all the manual work with files and presentations. It raised the level of analysis, helping us identify opportunities and align strategy with the business. We also had an extremely dedicated team.',
    'Agilizó la presentación de nuestros resultados y eliminó todo el trabajo manual con archivos y presentaciones. Elevó el nivel de análisis, ayudándonos a identificar oportunidades y a alinear la estrategia con el negocio. Además, contamos con un equipo extremadamente dedicado.',
    "Cela a accéléré la présentation de nos résultats en éliminant tout le travail manuel sur les fichiers et les présentations. Le niveau d'analyse a augmenté, ce qui nous aide à repérer des opportunités et à aligner la stratégie sur l'activité. Nous avons aussi pu compter sur une équipe extrêmement dévouée.",
  ),
  name: 'Sandra Mendes',
  company: 'PepsiCo',
};
const QUOTE_MCCAIN: CaseQuote = {
  text: L(
    'Agora conseguimos analisar dados de forma mais rápida e clara, focando na estratégia e satisfação de nossos clientes. Temos visibilidade dos indicadores e podemos ajustar o planejamento com rapidez. Gostamos muito do trabalho e do projeto desenvolvido pela DriveData.',
    'We can now analyze data faster and more clearly, focusing on strategy and customer satisfaction. We have visibility into our indicators and can adjust planning quickly. We really liked the work and the project developed by DriveData.',
    'Ahora logramos analizar los datos de forma más rápida y clara, enfocándonos en la estrategia y en la satisfacción de nuestros clientes. Tenemos visibilidad de los indicadores y podemos ajustar la planificación con rapidez. Nos gustó mucho el trabajo y el proyecto desarrollado por DriveData.',
    'Nous pouvons maintenant analyser les données plus rapidement et plus clairement, en nous concentrant sur la stratégie et la satisfaction de nos clients. Nous avons de la visibilité sur les indicateurs et pouvons ajuster la planification rapidement. Nous avons beaucoup apprécié le travail et le projet développé par DriveData.',
  ),
  name: 'Robson Garcia',
  company: 'McCain',
};

export const CASES: ClientCase[] = [
  {
    slug: 'pepsico',
    client: 'PepsiCo',
    logo: { src: '/PepsiCo_logo.svg', h: 30 },
    types: ['bi', 'allocation'],
    title: L('Painéis de operação logística.', 'Logistics operations dashboards.', 'Paneles de operación logística.', 'Tableaux de bord des opérations logistiques.'),
    summary: L(
      'Construímos painéis em Power BI para acompanhar a operação logística.',
      'We built Power BI dashboards to track the logistics operation.',
      'Construimos paneles en Power BI para seguir la operación logística.',
      'Nous avons construit des tableaux de bord Power BI pour suivre les opérations logistiques.',
    ),
    stack: ['Power BI'],
    quote: QUOTE_PEPSICO,
    featured: true,
  },
  {
    slug: 'unilever-manutencao',
    client: 'Unilever',
    logo: { src: '/clientes/layer1.svg', h: 44 },
    types: ['bi', 'data'],
    title: L('BI de manutenção.', 'Maintenance BI.', 'BI de mantenimiento.', 'BI de maintenance.'),
    summary: L(
      'Estruturamos os dados e construímos o painel de indicadores de manutenção.',
      'We structured the data and built the maintenance KPI dashboard.',
      'Estructuramos los datos y construimos el panel de indicadores de mantenimiento.',
      'Nous avons structuré les données et construit le tableau de bord des indicateurs de maintenance.',
    ),
    stack: ['Power BI', 'SAP', 'SharePoint'],
    featured: true,
  },
  {
    slug: 'tv-tem',
    client: 'TV TEM',
    logo: { src: '/clientes/image 28010.svg', h: 36 },
    types: ['bi', 'data'],
    title: L('Conciliação de faturamento.', 'Billing reconciliation.', 'Conciliación de facturación.', 'Rapprochement de la facturation.'),
    summary: L(
      'Criamos um painel que concilia o faturamento automaticamente e aponta divergências.',
      'We created a dashboard that reconciles billing automatically and flags discrepancies.',
      'Creamos un panel que concilia la facturación automáticamente y señala las diferencias.',
      'Nous avons créé un tableau de bord qui rapproche la facturation automatiquement et signale les écarts.',
    ),
    stack: ['Looker Studio', 'BigQuery'],
    featured: true,
  },
  {
    slug: 'unilever-recursos',
    client: 'Unilever',
    logo: { src: '/clientes/layer1.svg', h: 44 },
    types: ['systems', 'automation'],
    title: L('Designação de recursos.', 'Resource allocation.', 'Asignación de recursos.', 'Affectation des ressources.'),
    summary: L(
      'Desenvolvemos um módulo que integra dados do SAP e organiza a designação de recursos num só lugar.',
      'We developed a module that brings in SAP data and organizes resource allocation in one place.',
      'Desarrollamos un módulo que integra datos de SAP y organiza la asignación de recursos en un solo lugar.',
      "Nous avons développé un module qui intègre les données SAP et organise l'affectation des ressources en un seul endroit.",
    ),
    stack: ['Power Automate', 'SAP'],
  },
  {
    slug: 'tambasa',
    client: 'Tambasa',
    logo: { src: '/clientes/Camada_1.svg', h: 28 },
    types: ['systems'],
    title: L('Gestão de pátio e docas.', 'Yard and dock management.', 'Gestión de patio y muelles.', 'Gestion de la cour et des quais.'),
    summary: L(
      'Desenvolvemos um sistema web e mobile para a gestão de pátio e docas.',
      'We developed a web and mobile system for yard and dock management.',
      'Desarrollamos un sistema web y móvil para la gestión de patio y muelles.',
      'Nous avons développé un système web et mobile pour la gestion de la cour et des quais.',
    ),
    stack: ['.NET', 'React', 'Mobile'],
  },
  {
    slug: 'tmg',
    client: 'TMG',
    logo: { src: '/clientes/image 28016.svg', h: 26 },
    types: ['bi'],
    title: L('Painel gerencial.', 'Management dashboard.', 'Panel gerencial.', 'Tableau de bord de direction.'),
    summary: L(
      'Desenhamos e construímos o painel gerencial em Power BI.',
      'We designed and built the management dashboard in Power BI.',
      'Diseñamos y construimos el panel gerencial en Power BI.',
      'Nous avons conçu et construit le tableau de bord de direction dans Power BI.',
    ),
    stack: ['Power BI', 'Figma'],
  },
  {
    slug: 'mccain',
    client: 'McCain',
    logo: { src: '/clientes/image 28009.svg', h: 38 },
    types: ['data', 'bi'],
    title: L('Fluxo de dados reestruturado.', 'Restructured data flow.', 'Flujo de datos reestructurado.', 'Flux de données restructuré.'),
    summary: L(
      'Organizamos o banco de dados e criamos dashboards sincronizados com os processos.',
      'We organized the database and created dashboards in sync with the processes.',
      'Organizamos la base de datos y creamos dashboards sincronizados con los procesos.',
      'Nous avons organisé la base de données et créé des tableaux de bord synchronisés avec les processus.',
    ),
    stack: [],
    quote: QUOTE_MCCAIN,
  },
  {
    slug: 'frosty',
    client: 'Frosty',
    logo: { src: '/clientes/FROSTY_portal 1.svg', h: 40 },
    types: ['data', 'bi', 'allocation'],
    title: L('Data warehouse e BI.', 'Data warehouse and BI.', 'Data warehouse y BI.', 'Entrepôt de données et BI.'),
    summary: L(
      'Estruturamos o data warehouse com governança de dados e a camada de BI.',
      'We structured the data warehouse with data governance and the BI layer.',
      'Estructuramos el data warehouse con gobernanza de datos y la capa de BI.',
      "Nous avons structuré l'entrepôt de données avec la gouvernance des données et la couche BI.",
    ),
    stack: ['Azure', 'SQL Server', 'Power BI'],
  },
  {
    slug: 'coferly',
    client: 'Coferly',
    logo: { src: '/clientes/coferly.png', h: 40 },
    types: ['automation', 'bi'],
    title: L('Automação e BI.', 'Automation and BI.', 'Automatización y BI.', 'Automatisation et BI.'),
    summary: L(
      'Automatizamos processos e construímos painéis para diferentes áreas da empresa.',
      'We automated processes and built dashboards for different areas of the company.',
      'Automatizamos procesos y construimos paneles para distintas áreas de la empresa.',
      "Nous avons automatisé des processus et construit des tableaux de bord pour différents services de l'entreprise.",
    ),
    stack: ['Power BI', 'Power Automate', 'Python'],
  },
  {
    slug: 'ses-rs',
    client: 'SES/RS',
    logo: { src: '/clientes/ses-rs.png', h: 40 },
    types: ['bi'],
    title: L('Painéis de saúde pública.', 'Public health dashboards.', 'Paneles de salud pública.', 'Tableaux de bord de santé publique.'),
    summary: L(
      'Apoiamos a documentação e a padronização dos painéis de BI.',
      'We supported the documentation and standardization of the BI dashboards.',
      'Apoyamos la documentación y la estandarización de los paneles de BI.',
      'Nous avons contribué à la documentation et à la standardisation des tableaux de bord BI.',
    ),
    stack: ['Power BI'],
  },
  {
    slug: 'proton-energy',
    client: 'Proton Energy',
    logo: { src: '/clientes/proton-energy.png', h: 34 },
    types: ['systems'],
    title: L('Processos digitais.', 'Digital processes.', 'Procesos digitales.', 'Processus numériques.'),
    summary: L(
      'Digitalizamos processos internos com Power Apps.',
      'We digitized internal processes with Power Apps.',
      'Digitalizamos procesos internos con Power Apps.',
      'Nous avons numérisé des processus internes avec Power Apps.',
    ),
    stack: ['Power Apps', 'SharePoint'],
  },
  {
    slug: 'sumitomo',
    client: 'Sumitomo',
    logo: { src: '/clientes/sumitomo.png', h: 14 },
    types: ['data'],
    title: L('Banco de dados e treinamento.', 'Database and training.', 'Base de datos y capacitación.', 'Base de données et formation.'),
    summary: L(
      'Cuidamos do SQL Server e treinamos a equipe em Snowflake.',
      'We looked after SQL Server and trained the team in Snowflake.',
      'Nos ocupamos de SQL Server y capacitamos al equipo en Snowflake.',
      "Nous avons pris en charge SQL Server et formé l'équipe à Snowflake.",
    ),
    stack: ['SQL Server', 'Snowflake', 'Tableau'],
  },
];

/** Projetos curtos de BI: cliente e o que fizemos, uma linha cada. */
export const QUICK_CASES: QuickCase[] = [
  { client: 'Baldan', logo: { src: '/clientes/baldan.webp', h: 22 }, what: L('Dashboard de FP&A e forecast', 'FP&A and forecast dashboard', 'Dashboard de FP&A y forecast', 'Tableau de bord FP&A et prévisions') },
  { client: 'Rede Marajó', logo: { src: '/clientes/rede-marajo.svg', h: 30 }, what: L('Dashboard de orçamento', 'Budget dashboard', 'Dashboard de presupuesto', 'Tableau de bord budgétaire') },
  { client: 'Santana Ferro & Aço', logo: { src: '/clientes/santana-ferro-e-aco.png', h: 44 }, what: L('Painel de metas comerciais', 'Sales targets dashboard', 'Panel de metas comerciales', 'Tableau de bord des objectifs commerciaux') },
  { client: 'Contassem', logo: { src: '/clientes/contassem.svg', h: 34 }, what: L('Dashboard de folha de pagamento', 'Payroll dashboard', 'Dashboard de nómina', 'Tableau de bord de la paie') },
  { client: 'Enagic', logo: { src: '/clientes/enagic.svg', h: 38 }, what: L('Painel de análise logística', 'Logistics analysis dashboard', 'Panel de análisis logístico', "Tableau de bord d'analyse logistique") },
  { client: 'Eureca', logo: { src: '/clientes/eureca.png', h: 22 }, what: L('Plataforma de formulários com BI', 'Forms platform with BI', 'Plataforma de formularios con BI', 'Plateforme de formulaires avec BI') },
];

/** Tira as notas internas fora do desenvolvimento local. */
export const publicCase = (c: ClientCase): ClientCase =>
  process.env.NODE_ENV === 'development' ? c : { ...c, review: undefined };

export const caseText = (v: Copy<string>, lang: Lang) => v[lang] ?? v.pt;
