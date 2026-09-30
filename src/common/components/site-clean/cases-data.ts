// Cases reais do site (páginas oficiais /cases e /cases/[slug]). Fonte de cada
// fato: ERP (projetos, atividades, contratos e oportunidades), propostas enviadas
// e textos já publicados no site.
// Regras: nada de valor, hora ou margem; nenhum resultado sem fonte. Todo case
// mostra a marca do cliente: o logo quando existe arquivo, senão o nome.
// Nome de cliente só vai para produção com o ok dele (ver `review`).
//
// Idiomas: todo texto visível vem em pt, en, es e fr (Copy). As traduções só
// traduzem o que existe em português: nenhum fato novo entra por tradução.
//
// Só importar em componente de servidor (page.tsx); no cliente, só `import type`.
// O campo `review` é nota interna para aprovação (só em português): as páginas
// o removem fora do ambiente de desenvolvimento.
import type { Copy, Lang } from './i18n';

/** Tipos de projeto: chaves estáveis. O rótulo de cada idioma fica em CASE_TYPE_LABEL. */
export const CASE_TYPES = ['bi', 'data', 'systems', 'automation', 'allocation'] as const;
export type CaseType = (typeof CASE_TYPES)[number];

/** Rótulos dos tipos. cases.tsx tem a mesma tabela, porque o cliente não pode importar este arquivo. */
export const CASE_TYPE_LABEL: Copy<Record<CaseType, string>> = {
  pt: { bi: 'BI e painéis', data: 'Engenharia de dados', systems: 'Sistemas e apps', automation: 'Automação', allocation: 'Alocação de time' },
  en: { bi: 'BI and dashboards', data: 'Data engineering', systems: 'Systems and apps', automation: 'Automation', allocation: 'Dedicated team' },
  es: { bi: 'BI y paneles', data: 'Ingeniería de datos', systems: 'Sistemas y apps', automation: 'Automatización', allocation: 'Equipo dedicado' },
  fr: { bi: 'BI et tableaux de bord', data: 'Ingénierie des données', systems: 'Systèmes et applications', automation: 'Automatisation', allocation: 'Équipe dédiée' },
};

/** Nome de ferramenta (igual em todo idioma) ou termo genérico traduzido. */
export type CaseTerm = string | Copy<string>;

export type CaseQuote = { text: Copy<string>; name: string; company: string };

export type CaseFact = { label: Copy<string>; value: Copy<string> };

export type ClientCase = {
  slug: string;
  client: string;
  /** Sem arquivo de logo, o cartão mostra o nome do cliente como marca. */
  logo?: { src: string; h: number };
  sector: Copy<string>;
  types: CaseType[];
  title: Copy<string>;
  summary: Copy<string>;
  challenge?: Copy<string>;
  work: Copy<string[]>;
  stack: CaseTerm[];
  format: Copy<string>;
  facts?: CaseFact[];
  status?: Copy<string>;
  quote?: CaseQuote;
  featured?: boolean;
  /** Nota interna, só em português. */
  review?: string;
};

export type QuickCase = {
  client: string;
  logo?: { src: string; h: number };
  sector: Copy<string>;
  what: Copy<string>;
  stack: Copy<string>;
  time: Copy<string>;
};

const L = (pt: string, en: string, es: string, fr: string): Copy<string> => ({ pt, en, es, fr });

// Textos repetidos entre cases.
const ONGOING = L('Em andamento', 'Ongoing', 'En curso', 'En cours');
const FOOD = L('Alimentos e bebidas', 'Food and beverage', 'Alimentos y bebidas', 'Aliments et boissons');
const CONSUMER = L('Bens de consumo', 'Consumer goods', 'Bienes de consumo', 'Biens de consommation');
const FIXED = L('Projeto fechado', 'Fixed-scope project', 'Proyecto de alcance cerrado', 'Projet au forfait');
const CONSULTING = L('Consultoria', 'Consulting', 'Consultoría', 'Conseil');
const ALLOCATION = L('Alocação de time', 'Dedicated team', 'Equipo dedicado', 'Équipe dédiée');
const TEAM = L('Time', 'Team', 'Equipo', 'Équipe');
const POWER_BI = L('Power BI', 'Power BI', 'Power BI', 'Power BI');
const PROS = (n: number) => L(`${n} profissionais`, `${n} professionals`, `${n} profesionales`, `${n} professionnels`);
const WEEKS = (n: number) => L(`${n} semanas`, `${n} weeks`, `${n} semanas`, `${n} semaines`);

// Mesmos textos publicados na tabela testimonial (seção de depoimentos do site),
// com tradução fiel para os outros idiomas.
const QUOTE_PEPSICO: CaseQuote = {
  text: {
    pt: 'Agilizou a apresentação dos nossos resultados, eliminando todo o trabalho manual com arquivos e apresentações. Aumentou o nível de análise, ajudando-nos a identificar oportunidades e a alinhar a estratégia ao negócio. Além disso, contamos com uma equipe extremamente dedicada.',
    en: 'It sped up how we present our results and removed all the manual work with files and presentations. It raised the level of analysis, helping us identify opportunities and align strategy with the business. We also had an extremely dedicated team.',
    es: 'Agilizó la presentación de nuestros resultados y eliminó todo el trabajo manual con archivos y presentaciones. Elevó el nivel de análisis, ayudándonos a identificar oportunidades y a alinear la estrategia con el negocio. Además, contamos con un equipo extremadamente dedicado.',
    fr: "Cela a accéléré la présentation de nos résultats en éliminant tout le travail manuel sur les fichiers et les présentations. Le niveau d'analyse a augmenté, ce qui nous aide à repérer des opportunités et à aligner la stratégie sur l'activité. Nous avons aussi pu compter sur une équipe extrêmement dévouée.",
  },
  name: 'Sandra Mendes',
  company: 'PepsiCo',
};
const QUOTE_MCCAIN: CaseQuote = {
  text: {
    pt: 'Agora conseguimos analisar dados de forma mais rápida e clara, focando na estratégia e satisfação de nossos clientes. Temos visibilidade dos indicadores e podemos ajustar o planejamento com rapidez. Gostamos muito do trabalho e do projeto desenvolvido pela DriveData.',
    en: 'We can now analyze data faster and more clearly, focusing on strategy and customer satisfaction. We have visibility into our indicators and can adjust planning quickly. We really liked the work and the project developed by DriveData.',
    es: 'Ahora logramos analizar los datos de forma más rápida y clara, enfocándonos en la estrategia y en la satisfacción de nuestros clientes. Tenemos visibilidad de los indicadores y podemos ajustar la planificación con rapidez. Nos gustó mucho el trabajo y el proyecto desarrollado por DriveData.',
    fr: 'Nous pouvons maintenant analyser les données plus rapidement et plus clairement, en nous concentrant sur la stratégie et la satisfaction de nos clients. Nous avons de la visibilité sur les indicateurs et pouvons ajuster la planification rapidement. Nous avons beaucoup apprécié le travail et le projet développé par DriveData.',
  },
  name: 'Robson Garcia',
  company: 'McCain',
};

export const CASES: ClientCase[] = [
  {
    slug: 'pepsico-operacao-logistica',
    client: 'PepsiCo',
    logo: { src: '/PepsiCo_logo.svg', h: 30 },
    sector: FOOD,
    types: ['allocation', 'bi'],
    title: L(
      'A operação logística acompanhada de ponta a ponta.',
      'Logistics operations tracked end to end.',
      'La operación logística seguida de punta a punta.',
      'Les opérations logistiques suivies de bout en bout.',
    ),
    summary: L(
      'Time alocado construindo o painel operacional de Brasil e México, com cada etapa da viagem rastreada.',
      'A dedicated team building the operations dashboard for Brazil and Mexico, with every stage of the trip tracked.',
      'Equipo dedicado construyendo el panel operativo de Brasil y México, con cada etapa del viaje rastreada.',
      'Une équipe dédiée construit le tableau de bord opérationnel du Brésil et du Mexique, avec chaque étape du trajet suivie.',
    ),
    challenge: L(
      'Acompanhar o transporte etapa por etapa, do veículo planejado até a saída, com a mesma leitura para as equipes do Brasil e do México.',
      'Track transport stage by stage, from the planned vehicle to departure, with the same view for the Brazil and Mexico teams.',
      'Seguir el transporte etapa por etapa, desde el vehículo planificado hasta la salida, con la misma lectura para los equipos de Brasil y México.',
      "Suivre le transport étape par étape, du véhicule prévu jusqu'au départ, avec la même lecture pour les équipes du Brésil et du Mexique.",
    ),
    work: {
      pt: [
        'Painel de ponta a ponta em Power BI, com eventos de rastreio de cada etapa da viagem',
        'Status de chegada, carregamento, emissão de nota e saída, no prazo ou em atraso',
        'Indicadores de meta, filtros por bloco e exportação da tabela completa',
        'Versão em espanhol, com status e rótulos traduzidos',
        'Fonte de cada dado rastreável e painel documentado',
      ],
      en: [
        'End-to-end Power BI dashboard, with tracking events for every stage of the trip',
        'Arrival, loading, invoicing and departure status, on time or late',
        'Target indicators, filters by block and export of the full table',
        'Spanish version, with translated statuses and labels',
        'Traceable source for every data point and a documented dashboard',
      ],
      es: [
        'Panel de punta a punta en Power BI, con eventos de rastreo de cada etapa del viaje',
        'Estado de llegada, carga, emisión de factura y salida, a tiempo o con retraso',
        'Indicadores de meta, filtros por bloque y exportación de la tabla completa',
        'Versión en español, con estados y etiquetas traducidos',
        'Fuente de cada dato rastreable y panel documentado',
      ],
      fr: [
        'Tableau de bord de bout en bout dans Power BI, avec les événements de suivi de chaque étape du trajet',
        "Statut d'arrivée, de chargement, d'émission de facture et de départ, à l'heure ou en retard",
        "Indicateurs d'objectif, filtres par bloc et export du tableau complet",
        'Version en espagnol, avec statuts et libellés traduits',
        'Source de chaque donnée traçable et tableau de bord documenté',
      ],
    },
    stack: ['Power BI'],
    format: ALLOCATION,
    facts: [
      {
        label: L('Países', 'Countries', 'Países', 'Pays'),
        value: L('Brasil e México', 'Brazil and Mexico', 'Brasil y México', 'Brésil et Mexique'),
      },
      {
        label: L('Rotina', 'Routine', 'Rutina', 'Routine'),
        value: L(
          'Acompanhamento diário, em português e espanhol',
          'Daily monitoring, in Portuguese and Spanish',
          'Seguimiento diario, en portugués y español',
          'Suivi quotidien, en portugais et en espagnol',
        ),
      },
    ],
    status: ONGOING,
    quote: QUOTE_PEPSICO,
    featured: true,
    review: 'Logo e depoimento já estão no site. Pedir ok da PepsiCo para descrever o painel e citar o México.',
  },
  {
    slug: 'unilever-painel-de-manutencao',
    client: 'Unilever',
    logo: { src: '/clientes/layer1.svg', h: 44 },
    sector: CONSUMER,
    types: ['bi', 'data'],
    title: L(
      'O painel de manutenção voltou a ter dados.',
      'The maintenance dashboard has data again.',
      'El panel de mantenimiento volvió a tener datos.',
      'Le tableau de bord de maintenance a retrouvé ses données.',
    ),
    summary: L(
      'Reconstrução do painel de manutenção da fábrica depois que a fonte antiga parou de alimentar os números.',
      'Rebuild of the plant maintenance dashboard after the old source stopped feeding the numbers.',
      'Reconstrucción del panel de mantenimiento de la planta después de que la fuente antigua dejó de alimentar los números.',
      "Reconstruction du tableau de bord de maintenance de l'usine après que l'ancienne source a cessé d'alimenter les chiffres.",
    ),
    challenge: L(
      'A torre corporativa que mantinha os painéis de manutenção foi desmobilizada. O painel perdeu a fonte de dados e o controle voltou a ser manual.',
      'The central corporate team that maintained the maintenance dashboards was disbanded. The dashboard lost its data source and control went back to manual work.',
      'El equipo corporativo central que mantenía los paneles de mantenimiento fue desmovilizado. El panel perdió su fuente de datos y el control volvió a ser manual.',
      'L’équipe corporative centrale qui maintenait les tableaux de bord de maintenance a été démobilisée. Le tableau de bord a perdu sa source de données et le contrôle est redevenu manuel.',
    ),
    work: {
      pt: [
        'Mapeamento das fontes: SAP PM, planilha de finanças e base de ativos',
        'Modelo estrela com 42 relacionamentos e 17 medidas de regra de negócio',
        '769 colunas catalogadas e validadas com o responsável da área',
        'MTBF, MTTR, custo de manutenção sobre produção e evolução de perdas',
        'Publicação no Power BI Service com governança e dicionário de dados atualizados',
      ],
      en: [
        'Source mapping: SAP PM, the finance spreadsheet and the asset base',
        'Star schema with 42 relationships and 17 business rule measures',
        '769 columns cataloged and validated with the area owner',
        'MTBF, MTTR, maintenance cost over production and loss trends',
        'Published to Power BI Service with updated governance and data dictionary',
      ],
      es: [
        'Mapeo de las fuentes: SAP PM, planilla de finanzas y base de activos',
        'Modelo estrella con 42 relaciones y 17 medidas de reglas de negocio',
        '769 columnas catalogadas y validadas con el responsable del área',
        'MTBF, MTTR, costo de mantenimiento sobre producción y evolución de pérdidas',
        'Publicación en Power BI Service con gobernanza y diccionario de datos actualizados',
      ],
      fr: [
        'Cartographie des sources : SAP PM, tableur des finances et base des actifs',
        'Modèle en étoile avec 42 relations et 17 mesures de règles métier',
        '769 colonnes cataloguées et validées avec le responsable du service',
        'MTBF, MTTR, coût de maintenance rapporté à la production et évolution des pertes',
        'Publication dans Power BI Service avec gouvernance et dictionnaire de données à jour',
      ],
    },
    stack: ['Power BI', 'Power Query', 'SAP PM', 'SharePoint'],
    format: CONSULTING,
    facts: [{ label: L('Unidade', 'Site', 'Unidad', 'Site'), value: L('Pouso Alegre (MG)', 'Pouso Alegre (MG)', 'Pouso Alegre (MG)', 'Pouso Alegre (MG)') }],
    status: ONGOING,
    featured: true,
    review: 'Logo já está no site. Pedir ok da Unilever para citar o painel, a unidade e o motivo da reconstrução.',
  },
  {
    slug: 'tv-tem-conciliacao-de-faturamento',
    client: 'TV TEM',
    logo: { src: '/clientes/image 28010.svg', h: 36 },
    sector: L('Mídia', 'Media', 'Medios', 'Médias'),
    types: ['bi', 'data'],
    title: L(
      'Conciliação de faturamento sem planilha.',
      'Billing reconciliation without spreadsheets.',
      'Conciliación de facturación sin planillas.',
      'Rapprochement de la facturation sans tableur.',
    ),
    summary: L(
      'Painel diário que cruza o faturamento vindo da Globo com o Protheus e aponta as divergências.',
      'A daily dashboard that matches billing from Globo against Protheus and flags the mismatches.',
      'Panel diario que cruza la facturación de Globo con Protheus y señala las diferencias.',
      'Un tableau de bord quotidien qui rapproche la facturation de Globo avec Protheus et signale les écarts.',
    ),
    challenge: L(
      'A conciliação era feita numa planilha mantida por poucas pessoas. Com a reestruturação da área, o controle ficou dependente de conhecimento concentrado e consumia tempo todos os dias.',
      'Reconciliation ran on a spreadsheet kept by a few people. After the area was restructured, control depended on concentrated knowledge and took time every day.',
      'La conciliación se hacía en una planilla mantenida por pocas personas. Con la reestructuración del área, el control dependía de conocimiento concentrado y consumía tiempo todos los días.',
      "Le rapprochement se faisait dans un tableur tenu par quelques personnes. Avec la restructuration du service, le contrôle dépendait d'un savoir concentré et prenait du temps chaque jour.",
    ),
    work: {
      pt: [
        'Cruzamento diário de NDD e Sis.com com o que foi faturado no Protheus',
        'Conferência do reflexo nos módulos financeiro e contábil',
        'Divergências sinalizadas automaticamente, com causa provável',
        'Processo documentado, dicionário de métricas e manual de uso',
        'Treinamento da equipe de faturamento',
      ],
      en: [
        'Daily match of NDD and Sis.com against what was billed in Protheus',
        'Check of the impact on the finance and accounting modules',
        'Mismatches flagged automatically, with the likely cause',
        'Documented process, metrics dictionary and user guide',
        'Training for the billing team',
      ],
      es: [
        'Cruce diario de NDD y Sis.com con lo facturado en Protheus',
        'Verificación del reflejo en los módulos financiero y contable',
        'Diferencias señaladas automáticamente, con la causa probable',
        'Proceso documentado, diccionario de métricas y manual de uso',
        'Capacitación del equipo de facturación',
      ],
      fr: [
        'Rapprochement quotidien de NDD et Sis.com avec ce qui a été facturé dans Protheus',
        "Vérification de l'impact dans les modules financier et comptable",
        'Écarts signalés automatiquement, avec la cause probable',
        "Processus documenté, dictionnaire des indicateurs et guide d'utilisation",
        "Formation de l'équipe de facturation",
      ],
    },
    stack: ['Looker Studio', 'BigQuery', 'Protheus'],
    format: FIXED,
    facts: [
      {
        label: L('Painel', 'Dashboard', 'Panel', 'Tableau de bord'),
        value: L('5 páginas validadas em protótipo', '5 pages validated in a prototype', '5 páginas validadas en prototipo', '5 pages validées sur prototype'),
      },
    ],
    featured: true,
    review: 'Logo já está no site. Confirmar com a TV TEM antes de citar NDD, Sis.com e a reestruturação da área.',
  },
  {
    slug: 'unilever-designacao-de-recursos',
    client: 'Unilever',
    logo: { src: '/clientes/layer1.svg', h: 44 },
    sector: CONSUMER,
    types: ['systems', 'automation'],
    title: L(
      'Designação de recursos direto do SAP.',
      'Resource allocation straight from SAP.',
      'Asignación de recursos directo desde SAP.',
      'Affectation des ressources directement depuis SAP.',
    ),
    summary: L(
      'Módulo que extrai realizado e compromissado do SAP e deixa a área designar recursos num só lugar.',
      'A module that extracts actuals and commitments from SAP and lets the area allocate resources in one place.',
      'Módulo que extrae lo realizado y lo comprometido de SAP y permite que el área asigne recursos en un solo lugar.',
      "Un module qui extrait le réalisé et l'engagé de SAP et permet au service d'affecter les ressources en un seul endroit.",
    ),
    challenge: L(
      'Realizado e compromissado de cada recurso ficavam em transações do SAP. A área precisava ver e designar tudo num único lugar.',
      'Actuals and commitments for each resource sat in SAP transactions. The area needed to see and allocate everything in a single place.',
      'Lo realizado y lo comprometido de cada recurso estaban en transacciones de SAP. El área necesitaba ver y asignar todo en un único lugar.',
      "Le réalisé et l'engagé de chaque ressource se trouvaient dans des transactions SAP. Le service devait tout voir et tout affecter en un seul endroit.",
    ),
    work: {
      pt: [
        'Extração automatizada das transações GR55, GRR3 e KOB1',
        'Tratamento e normalização em fluxo na nuvem, com agendamento',
        'App com grade de realizado contra compromissado, filtros e edição',
        'Perfis de acesso e permissões por usuário',
        'Entrega por marcos, da definição da fonte até a implantação em produção',
      ],
      en: [
        'Automated extraction from transactions GR55, GRR3 and KOB1',
        'Cleansing and normalization in a scheduled cloud flow',
        'App with an actuals versus commitments grid, filters and editing',
        'Access profiles and permissions per user',
        'Milestone-based delivery, from source definition to production deployment',
      ],
      es: [
        'Extracción automatizada de las transacciones GR55, GRR3 y KOB1',
        'Tratamiento y normalización en un flujo en la nube, con programación',
        'App con grilla de realizado contra comprometido, filtros y edición',
        'Perfiles de acceso y permisos por usuario',
        'Entrega por hitos, desde la definición de la fuente hasta la implementación en producción',
      ],
      fr: [
        'Extraction automatisée des transactions GR55, GRR3 et KOB1',
        'Traitement et normalisation dans un flux cloud planifié',
        "Application avec une grille réalisé contre engagé, des filtres et l'édition",
        "Profils d'accès et permissions par utilisateur",
        "Livraison par jalons, de la définition de la source jusqu'à la mise en production",
      ],
    },
    stack: ['Power Automate', 'SAP', L('App web', 'Web app', 'App web', 'Application web')],
    format: FIXED,
    status: ONGOING,
    review: 'Pedir ok da Unilever. Citar as transações do SAP é opcional.',
  },
  {
    slug: 'tambasa-patio-e-docas',
    client: 'Tambasa',
    logo: { src: '/clientes/Camada_1.svg', h: 28 },
    sector: L('Atacado e distribuição', 'Wholesale and distribution', 'Mayorista y distribución', 'Commerce de gros et distribution'),
    types: ['systems'],
    title: L(
      'Pátio e docas num sistema próprio.',
      'Yard and docks in a custom system.',
      'Patio y muelles en un sistema propio.',
      'Cour et quais dans un système sur mesure.',
    ),
    summary: L(
      'Segunda fase do sistema de gestão de pátio e docas, com aplicação web, mobile e leitura por OCR.',
      'Phase two of the yard and dock management system, with web and mobile apps and OCR reading.',
      'Segunda fase del sistema de gestión de patio y muelles, con aplicación web, móvil y lectura por OCR.',
      'Deuxième phase du système de gestion de la cour et des quais, avec application web, mobile et lecture OCR.',
    ),
    work: {
      pt: [
        'Desenvolvimento da fase 2 do sistema de gestão de pátio e docas',
        'Aplicação web e mobile',
        'Leitura por OCR e integrações por API',
        'Painel de acompanhamento',
      ],
      en: [
        'Development of phase 2 of the yard and dock management system',
        'Web and mobile application',
        'OCR reading and API integrations',
        'Monitoring dashboard',
      ],
      es: [
        'Desarrollo de la fase 2 del sistema de gestión de patio y muelles',
        'Aplicación web y móvil',
        'Lectura por OCR e integraciones por API',
        'Panel de seguimiento',
      ],
      fr: [
        'Développement de la phase 2 du système de gestion de la cour et des quais',
        'Application web et mobile',
        'Lecture OCR et intégrations par API',
        'Tableau de bord de suivi',
      ],
    },
    stack: ['.NET', 'React', L('Mobile', 'Mobile', 'Móvil', 'Mobile'), 'OCR', 'APIs'],
    format: FIXED,
    status: ONGOING,
    review: 'Logo já está no site. Falta o desafio: confirmar com o time técnico o escopo da fase 2 e pedir ok da Tambasa.',
  },
  {
    slug: 'tmg-painel-gerencial',
    client: 'TMG',
    logo: { src: '/clientes/image 28016.svg', h: 26 },
    sector: L('Agronegócio', 'Agribusiness', 'Agronegocios', 'Agro-industrie'),
    types: ['bi'],
    title: L(
      'Painel gerencial de sementes.',
      'A management dashboard for seeds.',
      'Panel gerencial de semillas.',
      'Tableau de bord de gestion des semences.',
    ),
    summary: L(
      'Nove páginas em Power BI com pedidos, estoque previsto e firmado, cultivares e safra.',
      'Nine Power BI pages with orders, forecast and confirmed stock, cultivars and crop season.',
      'Nueve páginas en Power BI con pedidos, stock previsto y confirmado, cultivares y zafra.',
      'Neuf pages Power BI avec commandes, stock prévu et confirmé, variétés et campagne.',
    ),
    challenge: L(
      'Reunir pedidos, estoque, cultivares e safra das regiões Cerrado e Sul num único painel gerencial.',
      'Bring orders, stock, cultivars and crop season for the Cerrado and South regions into a single management dashboard.',
      'Reunir pedidos, stock, cultivares y zafra de las regiones Cerrado y Sur en un único panel gerencial.',
      'Réunir commandes, stock, variétés et campagne des régions Cerrado et Sud dans un seul tableau de bord de gestion.',
    ),
    work: {
      pt: [
        'Painel gerencial em Power BI com nove páginas',
        'Pedidos, estoque previsto e firmado, cultivares e safra',
        'Visões por região: Cerrado e Sul',
        'Redesenho visual a partir de protótipo no Figma',
        'Evolução contínua por demanda, com banco de horas aprovado a cada pedido',
      ],
      en: [
        'Nine-page management dashboard in Power BI',
        'Orders, forecast and confirmed stock, cultivars and crop season',
        'Regional views: Cerrado and South',
        'Visual redesign based on a Figma prototype',
        'Ongoing improvements on demand, with a bank of hours approved for each request',
      ],
      es: [
        'Panel gerencial en Power BI con nueve páginas',
        'Pedidos, stock previsto y confirmado, cultivares y zafra',
        'Vistas por región: Cerrado y Sur',
        'Rediseño visual a partir de un prototipo en Figma',
        'Evolución continua por demanda, con bolsa de horas aprobada en cada pedido',
      ],
      fr: [
        'Tableau de bord de gestion Power BI de neuf pages',
        'Commandes, stock prévu et confirmé, variétés et campagne',
        'Vues par région : Cerrado et Sud',
        "Refonte visuelle à partir d'un prototype Figma",
        "Évolution continue à la demande, avec une banque d'heures approuvée pour chaque demande",
      ],
    },
    stack: ['Power BI', 'DAX', 'Figma'],
    format: L('Via parceiro', 'Through a partner', 'A través de un socio', 'Par un partenaire'),
    review: 'Feito via parceiro Obify. Pedir ok da Obify e da TMG antes de publicar.',
  },
  {
    slug: 'mccain-fluxo-de-dados',
    client: 'McCain',
    logo: { src: '/clientes/image 28009.svg', h: 38 },
    sector: FOOD,
    types: ['data', 'bi'],
    title: L('Fluxo de dados reestruturado.', 'A restructured data flow.', 'Flujo de datos reestructurado.', 'Un flux de données restructuré.'),
    summary: L(
      'Banco de dados transacional organizado e dashboards sincronizados com os processos.',
      'An organized transactional database and dashboards in sync with the processes.',
      'Base de datos transaccional organizada y dashboards sincronizados con los procesos.',
      'Une base de données transactionnelle organisée et des tableaux de bord synchronisés avec les processus.',
    ),
    work: {
      pt: [
        'Banco de dados transacional organizado',
        'Dashboards sincronizados com os processos da operação',
        'Indicadores visíveis em tempo real',
      ],
      en: [
        'Organized transactional database',
        'Dashboards in sync with operational processes',
        'Indicators visible in real time',
      ],
      es: [
        'Base de datos transaccional organizada',
        'Dashboards sincronizados con los procesos de la operación',
        'Indicadores visibles en tiempo real',
      ],
      fr: [
        'Base de données transactionnelle organisée',
        'Tableaux de bord synchronisés avec les processus opérationnels',
        'Indicateurs visibles en temps réel',
      ],
    },
    stack: [
      L('Banco de dados', 'Database', 'Base de datos', 'Base de données'),
      L('Dashboards', 'Dashboards', 'Dashboards', 'Tableaux de bord'),
    ],
    format: L('Projeto', 'Project', 'Proyecto', 'Projet'),
    quote: QUOTE_MCCAIN,
    review: 'Texto e depoimento já publicados no site atual. O projeto não está no ERP: completar desafio e ferramentas com quem conduziu.',
  },
  {
    slug: 'frosty-data-warehouse',
    client: 'Frosty',
    logo: { src: '/clientes/FROSTY_portal 1.svg', h: 40 },
    sector: L('Alimentos (sorvetes)', 'Food (ice cream)', 'Alimentos (helados)', 'Alimentation (crème glacée)'),
    types: ['data', 'bi', 'allocation'],
    title: L('Data warehouse com governança.', 'A governed data warehouse.', 'Data warehouse con gobernanza.', 'Un entrepôt de données gouverné.'),
    summary: L(
      'Data warehouse em Azure com governança de dados, seguido de outsourcing com datalake e IA.',
      'An Azure data warehouse with data governance, followed by outsourcing with a data lake and AI.',
      'Data warehouse en Azure con gobernanza de datos, seguido de outsourcing con data lake e IA.',
      "Entrepôt de données dans Azure avec gouvernance des données, suivi d'une externalisation avec data lake et IA.",
    ),
    work: {
      pt: [
        'Data warehouse em Azure com SQL Server',
        'Cargas e integrações com SSIS',
        'Camada de BI em Power BI',
        'Governança de dados',
        'Capacitação da equipe do cliente para dar continuidade ao processo e manter o padrão',
        'Na sequência, outsourcing de dados com datalake e IA',
        'Depois dos 6 meses de projeto, o cliente optou por manter 1 profissional alocado para dar velocidade às demandas internas',
      ],
      en: [
        'Azure data warehouse with SQL Server',
        'Loads and integrations with SSIS',
        'BI layer in Power BI',
        'Data governance',
        "Training for the client's team to carry the process forward and keep the standard",
        'Next, data outsourcing with a data lake and AI',
        'After the 6-month project, the client chose to keep 1 dedicated professional to speed up internal requests',
      ],
      es: [
        'Data warehouse en Azure con SQL Server',
        'Cargas e integraciones con SSIS',
        'Capa de BI en Power BI',
        'Gobernanza de datos',
        'Capacitación del equipo del cliente para dar continuidad al proceso y mantener el estándar',
        'A continuación, outsourcing de datos con data lake e IA',
        'Después de los 6 meses de proyecto, el cliente optó por mantener 1 profesional asignado para agilizar las demandas internas',
      ],
      fr: [
        'Entrepôt de données dans Azure avec SQL Server',
        'Chargements et intégrations avec SSIS',
        'Couche BI dans Power BI',
        'Gouvernance des données',
        "Formation de l'équipe du client pour poursuivre le processus et maintenir le standard",
        'Ensuite, externalisation des données avec data lake et IA',
        'Après les 6 mois de projet, le client a choisi de garder 1 professionnel dédié pour accélérer les demandes internes',
      ],
    },
    stack: ['Azure', 'SQL Server', 'SSIS', 'Power BI'],
    format: L(
      'Projeto fechado e alocação',
      'Fixed-scope project and dedicated team',
      'Proyecto de alcance cerrado y equipo dedicado',
      'Projet au forfait et équipe dédiée',
    ),
    facts: [
      {
        label: L('Projeto', 'Project', 'Proyecto', 'Projet'),
        value: L('6 meses, com 4 profissionais', '6 months, with 4 professionals', '6 meses, con 4 profesionales', '6 mois, avec 4 professionnels'),
      },
      {
        label: L('Hoje', 'Today', 'Hoy', "Aujourd'hui"),
        value: L(
          '1 profissional alocado no cliente, por escolha do cliente',
          "1 professional dedicated to the client, at the client's choice",
          '1 profesional asignado al cliente, por elección del cliente',
          '1 professionnel dédié chez le client, au choix du client',
        ),
      },
    ],
    status: ONGOING,
    review: 'Logo já está no site. Pedir ok da Frosty para descrever o projeto.',
  },
  {
    slug: 'coferly-automacao-e-bi',
    client: 'Coferly',
    logo: { src: '/clientes/coferly.png', h: 40 },
    sector: L('Indústria', 'Manufacturing', 'Industria', 'Industrie'),
    types: ['automation', 'bi', 'allocation'],
    title: L(
      'Automação e BI em quatro áreas da indústria.',
      'Automation and BI across four areas of a manufacturer.',
      'Automatización y BI en cuatro áreas de la industria.',
      "Automatisation et BI dans quatre services d'un industriel.",
    ),
    summary: L(
      'Time presencial e remoto com automações e painéis para PCP, comercial, controladoria e RH.',
      'An on-site and remote team delivering automations and dashboards for production planning, sales, controllership and HR.',
      'Equipo presencial y remoto con automatizaciones y paneles para planificación de la producción, comercial, contraloría y RR. HH.',
      'Une équipe sur site et à distance avec automatisations et tableaux de bord pour la planification de la production, le commercial, le contrôle de gestion et les RH.',
    ),
    work: {
      pt: [
        'Automações com Power Automate e Python',
        'Painéis de PCP, comercial, controladoria e RH',
        'Tela fixa de TV para a fábrica e dashboard com filtro livre por período',
        'Meta do mês contra faturado, com o potencial do período',
        'Ajustes contínuos a partir do uso diário das áreas',
      ],
      en: [
        'Automations with Power Automate and Python',
        'Dashboards for production planning, sales, controllership and HR',
        'A fixed TV screen for the plant and a dashboard with a free date filter',
        'Monthly target versus billed, with the potential for the period',
        'Ongoing adjustments based on daily use by each area',
      ],
      es: [
        'Automatizaciones con Power Automate y Python',
        'Paneles de planificación de la producción, comercial, contraloría y RR. HH.',
        'Pantalla fija de TV para la planta y dashboard con filtro libre por período',
        'Meta del mes contra lo facturado, con el potencial del período',
        'Ajustes continuos a partir del uso diario de las áreas',
      ],
      fr: [
        'Automatisations avec Power Automate et Python',
        'Tableaux de bord pour la planification de la production, le commercial, le contrôle de gestion et les RH',
        "Écran TV fixe pour l'usine et tableau de bord avec filtre libre par période",
        'Objectif du mois contre facturé, avec le potentiel de la période',
        "Ajustements continus à partir de l'usage quotidien des services",
      ],
    },
    stack: ['Power BI', 'Power Automate', 'Python'],
    format: ALLOCATION,
    facts: [
      {
        label: L('Modelo', 'Work model', 'Modelo', 'Modèle'),
        value: L('Presencial e remoto', 'On-site and remote', 'Presencial y remoto', 'Sur site et à distance'),
      },
    ],
    status: ONGOING,
    review: 'Logo baixado do site da Coferly. Pedir o ok da Coferly.',
  },
  {
    slug: 'ses-rs-paineis-de-saude',
    client: 'SES/RS',
    logo: { src: '/clientes/ses-rs.png', h: 40 },
    sector: L('Saúde pública', 'Public health', 'Salud pública', 'Santé publique'),
    types: ['bi', 'allocation'],
    title: L(
      'Painéis de saúde pública documentados.',
      'Public health dashboards, documented.',
      'Paneles de salud pública documentados.',
      'Des tableaux de bord de santé publique documentés.',
    ),
    summary: L(
      'Time alocado na documentação e na auditoria dos painéis da Secretaria da Saúde do Rio Grande do Sul.',
      'A dedicated team documenting and auditing the dashboards of the Rio Grande do Sul State Health Department.',
      'Equipo dedicado a la documentación y la auditoría de los paneles de la Secretaría de Salud de Rio Grande do Sul.',
      "Une équipe dédiée à la documentation et à l'audit des tableaux de bord du Secrétariat à la Santé du Rio Grande do Sul.",
    ),
    work: {
      pt: [
        'Três profissionais alocados no projeto',
        'Documentação e auditoria dos painéis em Power BI',
        'Inventário dos painéis e padronização de nomenclatura',
      ],
      en: [
        'Three professionals dedicated to the project',
        'Documentation and audit of the Power BI dashboards',
        'Dashboard inventory and naming standardization',
      ],
      es: [
        'Tres profesionales asignados al proyecto',
        'Documentación y auditoría de los paneles en Power BI',
        'Inventario de los paneles y estandarización de la nomenclatura',
      ],
      fr: [
        'Trois professionnels dédiés au projet',
        'Documentation et audit des tableaux de bord Power BI',
        'Inventaire des tableaux de bord et normalisation de la nomenclature',
      ],
    },
    stack: ['Power BI'],
    format: L(
      'Alocação via parceiro (IUNEX)',
      'Dedicated team through a partner (IUNEX)',
      'Equipo dedicado a través de un socio (IUNEX)',
      'Équipe dédiée par un partenaire (IUNEX)',
    ),
    facts: [{ label: TEAM, value: PROS(3) }],
    status: ONGOING,
    review: 'Projeto SUS Gaúcho via IUNEX. Logo do site da secretaria. Setor público: só publicar com ok da IUNEX e da secretaria.',
  },
  {
    slug: 'proton-energy-seguranca-digital',
    client: 'Proton Energy',
    logo: { src: '/clientes/proton-energy.png', h: 34 },
    sector: L('Energia', 'Energy', 'Energía', 'Énergie'),
    types: ['systems'],
    title: L(
      'Processos de segurança digitalizados.',
      'Safety processes, digitized.',
      'Procesos de seguridad digitalizados.',
      'Des processus de sécurité numérisés.',
    ),
    summary: L(
      'Aplicação em Power Apps para digitalizar os processos de segurança da empresa.',
      "A Power Apps application that digitizes the company's safety processes.",
      'Aplicación en Power Apps para digitalizar los procesos de seguridad de la empresa.',
      "Une application Power Apps pour numériser les processus de sécurité de l'entreprise.",
    ),
    work: {
      pt: ['Processos de segurança digitalizados em Power Apps', 'Dados e documentos organizados no SharePoint'],
      en: ['Safety processes digitized in Power Apps', 'Data and documents organized in SharePoint'],
      es: ['Procesos de seguridad digitalizados en Power Apps', 'Datos y documentos organizados en SharePoint'],
      fr: ['Processus de sécurité numérisés dans Power Apps', 'Données et documents organisés dans SharePoint'],
    },
    stack: ['Power Apps', 'SharePoint'],
    format: FIXED,
    facts: [
      { label: L('Duração', 'Duration', 'Duración', 'Durée'), value: WEEKS(5) },
      { label: TEAM, value: PROS(2) },
    ],
    review: 'O site da Proton só tem o logo em branco: usamos a mesma arte em azul escuro. Pedir o logo oficial e o ok da Proton Energy.',
  },
  {
    slug: 'sumitomo-sql-server-e-snowflake',
    client: 'Sumitomo',
    logo: { src: '/clientes/sumitomo.png', h: 14 },
    sector: L(
      'Indústria de máquinas e equipamentos',
      'Machinery and equipment manufacturing',
      'Industria de máquinas y equipos',
      "Fabrication de machines et d'équipements",
    ),
    types: ['data'],
    title: L(
      'Banco de dados remediado e time treinado.',
      'Database remediated and team trained.',
      'Base de datos saneada y equipo capacitado.',
      'Base de données remise en état et équipe formée.',
    ),
    summary: L(
      'Remediação e manutenção do SQL Server, treinamento em Snowflake e um projeto em Tableau.',
      'SQL Server remediation and maintenance, Snowflake training and a Tableau project.',
      'Saneamiento y mantenimiento de SQL Server, capacitación en Snowflake y un proyecto en Tableau.',
      'Remise en état et maintenance de SQL Server, formation Snowflake et un projet Tableau.',
    ),
    work: {
      pt: [
        'Remediação do SQL Server em duas fases',
        'Suporte e manutenção do banco',
        'Treinamento da equipe em Snowflake',
        'Projeto de análise em Tableau',
      ],
      en: [
        'SQL Server remediation in two phases',
        'Database support and maintenance',
        'Team training in Snowflake',
        'Analytics project in Tableau',
      ],
      es: [
        'Saneamiento de SQL Server en dos fases',
        'Soporte y mantenimiento de la base de datos',
        'Capacitación del equipo en Snowflake',
        'Proyecto de análisis en Tableau',
      ],
      fr: [
        'Remise en état de SQL Server en deux phases',
        'Support et maintenance de la base de données',
        "Formation de l'équipe à Snowflake",
        "Projet d'analyse dans Tableau",
      ],
    },
    stack: ['SQL Server', 'Snowflake', 'Tableau'],
    format: CONSULTING,
    review: 'Logo da Sumitomo Heavy Industries (site global). Confirmar se é a empresa certa do grupo e pedir o ok.',
  },
];

/** Projetos curtos de BI: uma linha cada. Logos baixados dos sites oficiais. */
export const QUICK_CASES: QuickCase[] = [
  {
    client: 'Baldan',
    logo: { src: '/clientes/baldan.webp', h: 22 },
    sector: L('Indústria de máquinas agrícolas', 'Agricultural machinery manufacturing', 'Industria de maquinaria agrícola', 'Fabrication de machines agricoles'),
    what: L('Dashboard de FP&A e forecast', 'FP&A and forecast dashboard', 'Dashboard de FP&A y forecast', 'Tableau de bord FP&A et prévisions'),
    stack: L('Power BI e SQL Server', 'Power BI and SQL Server', 'Power BI y SQL Server', 'Power BI et SQL Server'),
    time: L('10 dias úteis', '10 business days', '10 días hábiles', '10 jours ouvrables'),
  },
  {
    client: 'Rede Marajó',
    logo: { src: '/clientes/rede-marajo.svg', h: 30 },
    sector: L('Rede de varejo', 'Retail chain', 'Cadena minorista', 'Chaîne de commerce de détail'),
    what: L('Dashboard de orçamento', 'Budget dashboard', 'Dashboard de presupuesto', 'Tableau de bord budgétaire'),
    stack: POWER_BI,
    time: WEEKS(4),
  },
  {
    client: 'Santana Ferro & Aço',
    logo: { src: '/clientes/santana-ferro-e-aco.png', h: 44 },
    sector: L('Siderurgia e distribuição de aço', 'Steel production and distribution', 'Siderurgia y distribución de acero', "Sidérurgie et distribution d'acier"),
    what: L(
      'Metas comerciais por empresa, vendedor e marca',
      'Sales targets by company, sales rep and brand',
      'Metas comerciales por empresa, vendedor y marca',
      'Objectifs commerciaux par entreprise, vendeur et marque',
    ),
    stack: POWER_BI,
    time: WEEKS(4),
  },
  {
    client: 'Contassem',
    logo: { src: '/clientes/contassem.svg', h: 34 },
    sector: L('Escritório de contabilidade', 'Accounting firm', 'Estudio contable', 'Cabinet comptable'),
    what: L('Dashboard de folha de pagamento', 'Payroll dashboard', 'Dashboard de nómina', 'Tableau de bord de la paie'),
    stack: POWER_BI,
    time: WEEKS(4),
  },
  {
    client: 'Enagic',
    logo: { src: '/clientes/enagic.svg', h: 38 },
    sector: L('Venda direta de bens de consumo', 'Direct sales of consumer goods', 'Venta directa de bienes de consumo', 'Vente directe de biens de consommation'),
    what: L('Control tower de logística', 'Logistics control tower', 'Control tower de logística', 'Tour de contrôle logistique'),
    stack: L('Power BI e Google Sheets', 'Power BI and Google Sheets', 'Power BI y Google Sheets', 'Power BI et Google Sheets'),
    time: WEEKS(2),
  },
  {
    client: 'Eureca',
    logo: { src: '/clientes/eureca.png', h: 22 },
    sector: L('Educação e estágios', 'Education and internships', 'Educación y pasantías', 'Éducation et stages'),
    what: L('Plataforma de formulários com BI', 'Forms platform with BI', 'Plataforma de formularios con BI', 'Plateforme de formulaires avec BI'),
    stack: L('App web e Power BI', 'Web app and Power BI', 'App web y Power BI', 'Application web et Power BI'),
    time: L('', '', '', ''),
  },
];

export const findCase = (slug: string) => CASES.find((c) => c.slug === slug);

/** Tira as notas internas fora do desenvolvimento local. */
export const publicCase = (c: ClientCase): ClientCase =>
  process.env.NODE_ENV === 'development' ? c : { ...c, review: undefined };

/** Textos do case num idioma, para a metadata da página de servidor (title e description). */
export const caseMeta = (c: ClientCase, lang: Lang) => ({
  client: c.client,
  title: c.title[lang],
  summary: c.summary[lang],
  sector: c.sector[lang],
});

/** Termo da stack no idioma: nome de ferramenta fica igual, termo genérico é traduzido. */
export const caseTerm = (t: CaseTerm, lang: Lang) => (typeof t === 'string' ? t : t[lang]);
