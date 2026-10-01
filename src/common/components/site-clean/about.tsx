'use client';

// Página "Sobre" oficial do site (rota /about), em pt, en, es e fr com troca ao vivo.
// Textos fixos no COPY abaixo. Soluções, depoimentos, artigos, FAQ e logos vêm do
// banco já no idioma certo (o servidor localiza).
import Link from 'next/link';
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { SITE_CONTACT } from '@/common/config/site';
import { trackLeadConversion } from '@/common/helpers/track-conversion';
import type { FaqModel } from '@/common/model/faq.model';
import type { SolutionModel } from '@/common/model/solution.model';
import type { TestimonialModel } from '@/common/model/testimonial.model';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { httpCreateContactRequest } from '@/modules/contact/api/create-contact-request/http-create-contact-request';
import type { CleanArticleCard } from './articles-data';
import { logoName, ROUTES, stripHtml } from './content';
import { useCopy, type Copy } from './i18n';
import { CleanShell } from './shell';
import { Icon, LogoWall, SectionHead } from './ui';
import s from './clean.module.css';
import a from './about.module.css';

export type AboutPartner = { imageUrl: string; name: string | null; featured: boolean };

type Props = {
  solutions: SolutionModel[];
  testimonials: TestimonialModel[];
  articles: CleanArticleCard[];
  faqs: FaqModel[];
  partners: AboutPartner[];
};

// Arquivos locais têm espaço no nome (/clientes/image 28009.svg).
const src = (u: string) => (u.includes(' ') ? encodeURI(u) : u);
const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

// Mesmas plataformas da seção de integrações atual (logos em /public/integrations).
const PLATFORMS = [
  { name: 'Meta', slug: 'meta' },
  { name: 'Google Analytics', slug: 'google-analytics' },
  { name: 'Oracle', slug: 'oracle' },
  { name: 'SAP', slug: 'sap' },
  { name: 'TOTVS', slug: 'totvs' },
  { name: 'Sankhya', slug: 'sankhya' },
  { name: 'Conta Azul', slug: 'conta-azul' },
  { name: 'Senior', slug: 'senior' },
  { name: 'Omie', slug: 'omie' },
  { name: 'Salesforce', slug: 'salesforce' },
];

type Tile = { tag: string; title: string; text: string };

/* ─────────── Textos (pt, en, es, fr) ─────────── */
// Onde a /about antiga já tinha tradução (src/common/i18n/locales), ela foi reaproveitada.
const PT = {
  // Logos
  proofTitle: 'Veja quem confia em nossos serviços',
  logoAlt: 'Logo de cliente',
  proofAria: 'Clientes que confiam na DriveData',
  // Hero
  heroTitle: 'Consultoria e soluções em dados e IA para negócios.',
  heroLead: 'Impulsionamos sua empresa com dados, BI, analytics e IA. Para prever resultados, reduzir custos e escalar com eficiência.',
  heroCta: 'Agende uma reunião',
  heroSecondary: 'Ver soluções',
  // Resultados
  resultsTitle: 'Transformando dados em resultados tangíveis.',
  resultsText: 'Revelamos oportunidades estratégicas com inteligência de dados, BI, analytics e IA. É assim que direcionamos o futuro do seu negócio.',
  statClients: 'Clientes impactados',
  statSolutions: 'Soluções entregues',
  // Soluções
  solutionsTitle: 'Nossas soluções',
  solutionsText: 'BI e IA para decisões assertivas e estratégicas. Mais eficiência e mais sucesso para a sua empresa.',
  solutionsEmpty: 'As soluções não puderam ser carregadas agora.',
  // Integrações
  integrationsTitle: 'Integramos seus dados numa visão 360°.',
  integrationsText: 'Integramos as fontes que a sua empresa já usa. Você tem controle total sobre as informações e cresce com inteligência.',
  platformsAria: 'Plataformas que integramos',
  hub: 'Todos os seus dados, num só lugar',
  // Entregas
  deliveriesTitle: 'O que já entregamos',
  deliveriesText: 'Projetos com IA e cases de clientes, do banco de dados ao painel.',
  aiGroup: 'Projetos com IA',
  aiCta: 'Conheça a nossa IA',
  casesGroup: 'Cases de clientes',
  // devicesShowcaseSection, enxugado.
  aiProjects: [
    {
      tag: 'Área comercial',
      title: 'IA integrada em dashboards e WhatsApp',
      text: 'Recomendações de ação, alertas personalizados e sugestões de produtos e vendas casadas. Mais assertividade e um ciclo de vendas mais rápido.',
    },
    {
      tag: 'Logística',
      title: 'Picking List Inteligente',
      text: 'IA aplicada à separação no estoque. Identifica gargalos, gera alertas em tempo real e localiza com precisão cada produto.',
    },
    {
      tag: 'Assistente',
      title: 'DriveDex, seu assistente de IA',
      text: 'Pergunte sobre seus dados pelo WhatsApp. Peça relatórios, dashboards e gestão de documentos com uma simples solicitação.',
    },
  ] as Tile[],
  // previewSolutionsSection, enxugado.
  cases: [
    {
      tag: 'McCain',
      title: 'Fluxo de dados reestruturado',
      text: 'Organizamos o banco de dados transacional e criamos dashboards sincronizados com os processos. Visibilidade clara, em tempo real.',
    },
    {
      tag: 'Solução end to end',
      title: 'Do ERP ao dashboard',
      text: 'Aplicativos e ERP sob medida, banco de dados seguro com gestão de DBA e relatórios atualizados em tempo real para decidir.',
    },
    {
      tag: 'PepsiCo',
      title: 'Dados centralizados',
      text: 'Criamos o banco transacional e eliminamos relatórios e apresentações manuais. Decisão e apresentação de resultados ficaram mais simples.',
    },
    {
      tag: 'Darwin',
      title: 'Relatório 100% personalizado',
      text: 'Um relatório feito em HTML e CSS para dar ao produto um visual próprio e um diferencial de mercado.',
    },
  ] as Tile[],
  // Depoimentos
  testimonialsTitle: 'Depoimentos de nossos clientes',
  testimonialsText: 'Junte-se às empresas que confiam em nós para impulsionar seus negócios.',
  testimonialsEmpty: 'Os depoimentos não puderam ser carregados agora.',
  photoOf: (name: string) => `Foto de ${name}`,
  // Sobre
  slogan: 'Tecnologia que move pessoas. Inteligência que move resultados.',
  about1: 'Na DriveData, transformamos tecnologia em crescimento real. Atuamos com inteligência artificial, desenvolvimento de sistemas, automação e engenharia de dados.',
  about2: 'Nossa equipe multidisciplinar mergulha na sua operação. Desenvolvedores, engenheiros e especialistas em IA criam sistemas, integrações, automações e dashboards sob medida. Menos retrabalho, mais previsibilidade.',
  about3: 'Nosso propósito é engajar pessoas por meio da tecnologia. Acreditamos que o maior obstáculo ao crescimento não é o mercado. É a falta de organização e de insights internos.',
  founderAlt: 'Tamires Cavani, fundadora da DriveData',
  founderRole: 'Fundadora',
  founderBio: 'Mais de 15 anos em gestão de projetos e análise de dados. Especialista em Business Intelligence, consultoria de TI e soluções de dados para negócios.',
  // Artigos
  articlesTitle: 'Nossos artigos',
  articlesAll: 'Ver todos os artigos',
  articlesEmpty: 'Os artigos não puderam ser carregados agora.',
  readArticle: 'Ler artigo',
  // FAQ
  faqTitle: 'Respondemos suas principais dúvidas.',
  // Contato
  contactTitle: 'Fale com quem domina dados e IA.',
  contactText: 'Transforme estratégia em performance real.',
  formAria: 'Formulário de contato',
  name: 'Nome',
  email: 'Email',
  company: 'Empresa',
  message: 'Mensagem',
  submit: 'Envie sua solicitação de diagnóstico',
  submitting: 'Enviando...',
  nameRequired: 'Nome é obrigatório',
  emailRequired: 'Email é obrigatório',
  emailInvalid: 'Email inválido',
  companyRequired: 'Empresa é obrigatória',
  messageRequired: 'Mensagem é obrigatória',
  success: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
  error: 'Algo de errado aconteceu. Tente novamente mais tarde',
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    proofTitle: 'See who trusts our services',
    logoAlt: 'Client logo',
    proofAria: 'Clients who trust DriveData',
    heroTitle: 'Data and AI consulting and solutions for business.',
    heroLead: 'We drive your company with data, BI, analytics and AI. To predict results, reduce costs and scale with efficiency.',
    heroCta: 'Schedule a meeting',
    heroSecondary: 'See solutions',
    resultsTitle: 'Transforming data into tangible results.',
    resultsText: 'We reveal strategic opportunities with data intelligence, BI, analytics and AI. That is how we guide the future of your business.',
    statClients: 'Clients impacted',
    statSolutions: 'Solutions delivered',
    solutionsTitle: 'Our solutions',
    solutionsText: 'BI and AI for sound, strategic decisions. More efficiency and more success for your company.',
    solutionsEmpty: 'Solutions could not be loaded right now.',
    integrationsTitle: 'We integrate your data into a 360° view.',
    integrationsText: 'We connect the sources your company already uses. You get full control over your information and grow with intelligence.',
    platformsAria: 'Platforms we integrate',
    hub: 'All your data, in one place',
    deliveriesTitle: 'What we have delivered',
    deliveriesText: 'AI projects and client case studies, from the database to the dashboard.',
    aiGroup: 'AI projects',
    aiCta: 'Learn about our AI',
    casesGroup: 'Client case studies',
    aiProjects: [
      {
        tag: 'Sales',
        title: 'AI integrated into dashboards and WhatsApp',
        text: 'Action recommendations, personalized alerts and product and cross-selling suggestions. More accuracy and a faster sales cycle.',
      },
      {
        tag: 'Logistics',
        title: 'Intelligent Picking List',
        text: 'AI applied to warehouse picking. It spots bottlenecks, sends real-time alerts and pinpoints every product.',
      },
      {
        tag: 'Assistant',
        title: 'DriveDex, your AI assistant',
        text: 'Ask about your data on WhatsApp. Request reports, dashboards and document management with a simple message.',
      },
    ],
    cases: [
      {
        tag: 'McCain',
        title: 'Restructured data flow',
        text: 'We organized the transactional database and built dashboards synchronized with the processes. Clear visibility, in real time.',
      },
      {
        tag: 'End-to-end solution',
        title: 'From ERP to dashboard',
        text: 'Custom apps and ERP, a secure database with DBA management and real-time reports to support decisions.',
      },
      {
        tag: 'PepsiCo',
        title: 'Centralized data',
        text: 'We built the transactional database and eliminated manual reports and presentations. Decisions and results reporting became simpler.',
      },
      {
        tag: 'Darwin',
        title: '100% custom report',
        text: 'A report built in HTML and CSS to give the product its own look and a market edge.',
      },
    ],
    testimonialsTitle: 'Testimonials from our clients',
    testimonialsText: 'Join the companies that trust us to boost their business.',
    testimonialsEmpty: 'Testimonials could not be loaded right now.',
    photoOf: (name: string) => `Photo of ${name}`,
    slogan: 'Technology that moves people. Intelligence that drives results.',
    about1: 'At DriveData, we transform technology into real growth. We work with artificial intelligence, system development, automation and data engineering.',
    about2: 'Our multidisciplinary team dives deep into your operations. Developers, engineers and AI specialists build tailored systems, integrations, automations and dashboards. Less rework, more predictability.',
    about3: 'Our purpose is to empower people through technology. We believe the biggest barrier to growth is not the market. It is the lack of internal organization and insights.',
    founderAlt: 'Tamires Cavani, founder of DriveData',
    founderRole: 'Founder',
    founderBio: 'More than 15 years in project management and data analysis. Specialist in Business Intelligence, IT consulting and data solutions for business.',
    articlesTitle: 'Our articles',
    articlesAll: 'See all articles',
    articlesEmpty: 'Articles could not be loaded right now.',
    readArticle: 'Read article',
    faqTitle: 'Answers to your main questions.',
    contactTitle: 'Talk to those who master data and AI.',
    contactText: 'Turn strategy into real performance.',
    formAria: 'Contact form',
    name: 'Name',
    email: 'Email',
    company: 'Company',
    message: 'Message',
    submit: 'Send your diagnostic request',
    submitting: 'Sending...',
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email',
    companyRequired: 'Company is required',
    messageRequired: 'Message is required',
    success: 'Message sent successfully! We will contact you soon.',
    error: 'Something went wrong. Please try again later',
  },
  es: {
    proofTitle: 'Vea quién confía en nuestros servicios',
    logoAlt: 'Logo de cliente',
    proofAria: 'Clientes que confían en DriveData',
    heroTitle: 'Consultoría y soluciones en datos e IA para negocios.',
    heroLead: 'Impulsamos su empresa con datos, BI, analytics e IA. Para predecir resultados, reducir costos y escalar con eficiencia.',
    heroCta: 'Programe una reunión',
    heroSecondary: 'Ver soluciones',
    resultsTitle: 'Transformando datos en resultados tangibles.',
    resultsText: 'Revelamos oportunidades estratégicas con inteligencia de datos, BI, analytics e IA. Así dirigimos el futuro de su negocio.',
    statClients: 'Clientes impactados',
    statSolutions: 'Soluciones entregadas',
    solutionsTitle: 'Nuestras soluciones',
    solutionsText: 'BI e IA para decisiones asertivas y estratégicas. Más eficiencia y más éxito para su empresa.',
    solutionsEmpty: 'No fue posible cargar las soluciones en este momento.',
    integrationsTitle: 'Integramos sus datos en una visión 360°.',
    integrationsText: 'Integramos las fuentes que su empresa ya utiliza. Usted tiene control total sobre la información y crece con inteligencia.',
    platformsAria: 'Plataformas que integramos',
    hub: 'Todos tus datos, en un solo lugar',
    deliveriesTitle: 'Lo que ya entregamos',
    deliveriesText: 'Proyectos con IA y casos de clientes, de la base de datos al panel.',
    aiGroup: 'Proyectos con IA',
    aiCta: 'Conoce nuestra IA',
    casesGroup: 'Casos de clientes',
    aiProjects: [
      {
        tag: 'Área comercial',
        title: 'IA integrada en dashboards y WhatsApp',
        text: 'Recomendaciones de acción, alertas personalizadas y sugerencias de productos y ventas cruzadas. Más asertividad y un ciclo de ventas más rápido.',
      },
      {
        tag: 'Logística',
        title: 'Lista de Picking Inteligente',
        text: 'IA aplicada a la preparación de pedidos en el inventario. Identifica cuellos de botella, genera alertas en tiempo real y localiza con precisión cada producto.',
      },
      {
        tag: 'Asistente',
        title: 'DriveDex, tu asistente de IA',
        text: 'Pregunta sobre tus datos por WhatsApp. Pide informes, dashboards y gestión de documentos con una simple solicitud.',
      },
    ],
    cases: [
      {
        tag: 'McCain',
        title: 'Flujo de datos reestructurado',
        text: 'Organizamos la base de datos transaccional y creamos dashboards sincronizados con los procesos. Visibilidad clara, en tiempo real.',
      },
      {
        tag: 'Solución end to end',
        title: 'Del ERP al dashboard',
        text: 'Aplicaciones y ERP a medida, base de datos segura con gestión de DBA e informes actualizados en tiempo real para decidir.',
      },
      {
        tag: 'PepsiCo',
        title: 'Datos centralizados',
        text: 'Creamos la base transaccional y eliminamos informes y presentaciones manuales. La toma de decisiones y la presentación de resultados se volvieron más simples.',
      },
      {
        tag: 'Darwin',
        title: 'Informe 100% personalizado',
        text: 'Un informe hecho en HTML y CSS para dar al producto un aspecto propio y un diferencial de mercado.',
      },
    ],
    testimonialsTitle: 'Testimonios de nuestros clientes',
    testimonialsText: 'Únete a las empresas que confían en nosotros para impulsar sus negocios.',
    testimonialsEmpty: 'No fue posible cargar los testimonios en este momento.',
    photoOf: (name: string) => `Foto de ${name}`,
    slogan: 'Tecnología que mueve personas. Inteligencia que impulsa resultados.',
    about1: 'En DriveData, transformamos la tecnología en crecimiento real. Trabajamos con inteligencia artificial, desarrollo de sistemas, automatización e ingeniería de datos.',
    about2: 'Nuestro equipo multidisciplinar se sumerge en tu operación. Desarrolladores, ingenieros y especialistas en IA crean sistemas, integraciones, automatizaciones y dashboards a medida. Menos retrabajo, más previsibilidad.',
    about3: 'Nuestro propósito es involucrar a las personas a través de la tecnología. Creemos que el mayor obstáculo para el crecimiento no es el mercado. Es la falta de organización e insights internos.',
    founderAlt: 'Tamires Cavani, fundadora de DriveData',
    founderRole: 'Fundadora',
    founderBio: 'Más de 15 años en gestión de proyectos y análisis de datos. Especialista en Business Intelligence, consultoría de TI y soluciones de datos para negocios.',
    articlesTitle: 'Nuestros artículos',
    articlesAll: 'Ver todos los artículos',
    articlesEmpty: 'No fue posible cargar los artículos en este momento.',
    readArticle: 'Leer artículo',
    faqTitle: 'Respondemos sus principales preguntas.',
    contactTitle: 'Hable con quienes dominan datos e IA.',
    contactText: 'Transforme estrategia en rendimiento real.',
    formAria: 'Formulario de contacto',
    name: 'Nombre',
    email: 'Email',
    company: 'Empresa',
    message: 'Mensaje',
    submit: 'Envíe su solicitud de diagnóstico',
    submitting: 'Enviando...',
    nameRequired: 'El nombre es obligatorio',
    emailRequired: 'El email es obligatorio',
    emailInvalid: 'Email inválido',
    companyRequired: 'La empresa es obligatoria',
    messageRequired: 'El mensaje es obligatorio',
    success: '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.',
    error: 'Algo salió mal. Por favor, intente de nuevo más tarde',
  },
  fr: {
    proofTitle: 'Découvrez qui fait confiance à nos services',
    logoAlt: 'Logo client',
    proofAria: 'Clients qui font confiance à DriveData',
    heroTitle: 'Conseil et solutions en données et IA pour les entreprises.',
    heroLead: "Nous propulsons votre entreprise avec les données, le BI, l'analytics et l'IA. Pour prédire les résultats, réduire les coûts et évoluer efficacement.",
    heroCta: 'Planifiez une réunion',
    heroSecondary: 'Voir les solutions',
    resultsTitle: 'Transformer les données en résultats tangibles.',
    resultsText: "Nous révélons des opportunités stratégiques grâce à l'intelligence des données, au BI, à l'analytics et à l'IA. C'est ainsi que nous orientons l'avenir de votre entreprise.",
    statClients: 'Clients impactés',
    statSolutions: 'Solutions livrées',
    solutionsTitle: 'Nos solutions',
    solutionsText: "Le BI et l'IA pour des décisions justes et stratégiques. Plus d'efficacité et plus de succès pour votre entreprise.",
    solutionsEmpty: "Les solutions n'ont pas pu être chargées pour le moment.",
    integrationsTitle: 'Nous intégrons vos données dans une vision à 360°.',
    integrationsText: 'Nous intégrons les sources que votre entreprise utilise déjà. Vous gardez un contrôle total sur vos informations et croissez intelligemment.',
    platformsAria: 'Plateformes que nous intégrons',
    hub: 'Toutes vos données, au même endroit',
    deliveriesTitle: 'Ce que nous avons livré',
    deliveriesText: "Projets d'IA et études de cas clients, de la base de données au tableau de bord.",
    aiGroup: "Projets d'IA",
    aiCta: 'Découvrez notre IA',
    casesGroup: 'Études de cas clients',
    aiProjects: [
      {
        tag: 'Ventes',
        title: 'IA intégrée aux tableaux de bord et WhatsApp',
        text: "Recommandations d'actions, alertes personnalisées et suggestions de produits et de ventes croisées. Plus de précision et un cycle de vente plus rapide.",
      },
      {
        tag: 'Logistique',
        title: 'Liste de picking intelligente',
        text: "L'IA appliquée au prélèvement en entrepôt. Elle repère les goulots d'étranglement, génère des alertes en temps réel et localise précisément chaque produit.",
      },
      {
        tag: 'Assistant',
        title: 'DriveDex, votre assistant IA',
        text: 'Posez des questions sur vos données via WhatsApp. Demandez des rapports, des tableaux de bord et la gestion de documents par une simple demande.',
      },
    ],
    cases: [
      {
        tag: 'McCain',
        title: 'Flux de données restructuré',
        text: 'Nous avons organisé la base de données transactionnelle et créé des tableaux de bord synchronisés avec les processus. Une visibilité claire, en temps réel.',
      },
      {
        tag: 'Solution de bout en bout',
        title: "De l'ERP au tableau de bord",
        text: 'Applications et ERP sur mesure, base de données sécurisée avec gestion DBA et rapports mis à jour en temps réel pour décider.',
      },
      {
        tag: 'PepsiCo',
        title: 'Données centralisées',
        text: 'Nous avons créé la base transactionnelle et éliminé les rapports et présentations manuels. Décider et présenter les résultats est devenu plus simple.',
      },
      {
        tag: 'Darwin',
        title: 'Rapport 100 % personnalisé',
        text: 'Un rapport conçu en HTML et CSS pour donner au produit une identité visuelle propre et un avantage sur le marché.',
      },
    ],
    testimonialsTitle: 'Témoignages de nos clients',
    testimonialsText: 'Rejoignez les entreprises qui nous font confiance pour dynamiser leur activité.',
    testimonialsEmpty: "Les témoignages n'ont pas pu être chargés pour le moment.",
    photoOf: (name: string) => `Photo de ${name}`,
    slogan: "La technologie qui mobilise les personnes. L'intelligence qui propulse les résultats.",
    about1: "Chez DriveData, nous transformons la technologie en croissance réelle. Nous travaillons avec l'intelligence artificielle, le développement de systèmes, l'automatisation et l'ingénierie des données.",
    about2: "Notre équipe multidisciplinaire s'immerge dans vos opérations. Développeurs, ingénieurs et spécialistes IA créent des systèmes, intégrations, automatisations et tableaux de bord sur mesure. Moins de retravail, plus de prévisibilité.",
    about3: "Notre objectif est d'engager les personnes grâce à la technologie. Nous croyons que le plus grand obstacle à la croissance n'est pas le marché. C'est le manque d'organisation et d'insights internes.",
    founderAlt: 'Tamires Cavani, fondatrice de DriveData',
    founderRole: 'Fondatrice',
    founderBio: "Plus de 15 ans en gestion de projet et analyse de données. Spécialiste en Business Intelligence, conseil IT et solutions data pour les entreprises.",
    articlesTitle: 'Nos articles',
    articlesAll: 'Voir tous les articles',
    articlesEmpty: "Les articles n'ont pas pu être chargés pour le moment.",
    readArticle: "Lire l'article",
    faqTitle: 'Réponses à vos principales questions.',
    contactTitle: 'Échangez avec des experts en données et IA.',
    contactText: 'Transformez la stratégie en performance réelle.',
    formAria: 'Formulaire de contact',
    name: 'Nom',
    email: 'E-mail',
    company: 'Entreprise',
    message: 'Message',
    submit: 'Envoyez votre demande de diagnostic',
    submitting: 'Envoi en cours...',
    nameRequired: 'Le nom est obligatoire',
    emailRequired: "L'e-mail est obligatoire",
    emailInvalid: 'E-mail invalide',
    companyRequired: "L'entreprise est obligatoire",
    messageRequired: 'Le message est obligatoire',
    success: 'Message envoyé avec succès ! Nous vous contacterons bientôt.',
    error: 'Une erreur est survenue. Veuillez réessayer plus tard',
  },
};

const ICON_PHONE =
  'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';
const ICON_PIN = 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';

/* ─────────── Logos de clientes (tabela partner) ─────────── */
// Todos os logos do cadastro na parede de clientes (sem "Ver mais").
function PartnerLogos({ partners }: { partners: AboutPartner[] }) {
  const t = useCopy(COPY);
  if (!partners.length) return null;
  // destaques primeiro (mesma regra da home), depois a ordem do cadastro
  const logos = [...partners]
    .sort((x, y) => Number(y.featured) - Number(x.featured))
    .map((p) => ({ src: p.imageUrl, name: p.name || logoName(p.imageUrl) || t.logoAlt, featured: p.featured }));
  return <LogoWall title={t.proofTitle} logos={logos} />;
}

/* ─────────── Acordeão acessível ─────────── */
type AccItem = { id: string; title: string; html: string; icon?: string };

function Accordion({ items, prefix, initialOpen, compact, onFog }: {
  items: AccItem[]; prefix: string; initialOpen?: string; compact?: boolean; onFog?: boolean;
}) {
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);
  return (
    <ul className={cx(a.acc, onFog && a.bandFogAcc)}>
      {items.map((it, i) => {
        const isOpen = open === it.id;
        const btnId = `${prefix}-btn-${i}`;
        const panelId = `${prefix}-painel-${i}`;
        return (
          <li key={it.id} className={a.accItem}>
            <h3>
              <button type="button" id={btnId} className={a.accButton} aria-expanded={isOpen} aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : it.id)}>
                {it.icon ? <span className={a.accIcon}><img src={it.icon} alt="" /></span> : null}
                <span className={cx(a.accTitle, compact && a.accTitleSm)}>{it.title}</span>
                <span className={a.accToggle} aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen}
              className={cx(a.accPanel, !it.icon && a.accPanelFlush)}>
              <div className={a.rich} dangerouslySetInnerHTML={{ __html: it.html }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────── Depoimento ─────────── */
function Quote({ t }: { t: TestimonialModel }) {
  const c = useCopy(COPY);
  const initials = t.clientName.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <figure className={a.quote}>
      <blockquote>{stripHtml(t.testimonial)}</blockquote>
      <figcaption>
        <span className={a.avatar} aria-hidden={t.clientAvatar ? undefined : true}>
          {t.clientAvatar ? <img src={t.clientAvatar} alt={c.photoOf(t.clientName)} loading="lazy" /> : initials}
        </span>
        <span>
          <span className={a.quoteName}>{t.clientName}</span>
          {t.clientCompany && <span className={a.quoteRole}>{t.clientCompany}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

/* ─────────── Artigo ─────────── */
function ArticleCard({ article }: { article: CleanArticleCard }) {
  const t = useCopy(COPY);
  const [imgOk, setImgOk] = useState(true);
  return (
    <Link href={article.href} className={a.article}>
      <div className={a.thumb}>
        {article.imageUrl && imgOk && (
          <img src={article.imageUrl} alt="" loading="lazy" onError={() => setImgOk(false)} />
        )}
      </div>
      <div className={a.articleBody}>
        {article.categoryName && <span className={a.articleTag}>{article.categoryName}</span>}
        <h3 className={a.articleTitle}>{article.title}</h3>
        {article.excerpt && <p className={cx(s.muted, a.clamp)}>{article.excerpt}</p>}
        <span className={a.articleMore}>{t.readArticle}<span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}

/* ─────────── Formulário de contato ───────────
   Mesmo envio da contact-section: httpCreateContactRequest (POST /api/lead),
   mesmos campos, validações e mensagens. Só a aparência muda. */
type ContactFormData = { name: string; email: string; company: string; message: string };
const EMPTY: ContactFormData = { name: '', email: '', company: '', message: '' };

function ContactForm() {
  const MSG = useCopy(COPY);
  const [formData, setFormData] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    if (!formData.name.trim()) newErrors.name = MSG.nameRequired;
    if (!formData.email.trim()) newErrors.email = MSG.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = MSG.emailInvalid;
    if (!formData.company.trim()) newErrors.company = MSG.companyRequired;
    if (!formData.message.trim()) newErrors.message = MSG.messageRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setServerError(null);
    setIsSuccess(false);
    setIsSubmitting(true);
    try {
      await httpCreateContactRequest(formData);
      // Conversão só após o envio dar certo (evita contar tentativa/erro).
      trackLeadConversion({ source: 'contact_form' });
      setIsSuccess(true);
      setFormData(EMPTY);
      setErrors({});
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setServerError(error instanceof Error ? error.message : MSG.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const field = (name: keyof ContactFormData, label: string, type: 'text' | 'email' | 'textarea', autoComplete?: string) => {
    const id = `contato-${name}`;
    const err = errors[name];
    const common = {
      id,
      name,
      value: formData[name],
      onChange: handleChange,
      className: a.input,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${id}-erro` : undefined,
    };
    return (
      <div className={a.field}>
        <label htmlFor={id}>{label}</label>
        {type === 'textarea' ? <textarea {...common} rows={5} /> : <input {...common} type={type} autoComplete={autoComplete} />}
        {err && <span id={`${id}-erro`} className={a.error}>{err}</span>}
      </div>
    );
  };

  return (
    <form className={a.form} onSubmit={handleSubmit} aria-label={MSG.formAria}>
      <div aria-live="polite">
        {serverError && <p className={cx(a.alert, a.alertError)} role="alert">{serverError}</p>}
        {isSuccess && <p className={cx(a.alert, a.alertOk)}>{MSG.success}</p>}
      </div>
      {field('name', MSG.name, 'text', 'name')}
      {field('email', MSG.email, 'email', 'email')}
      {field('company', MSG.company, 'text', 'organization')}
      {field('message', MSG.message, 'textarea')}
      <button type="submit" className={cx(s.btn, a.submit)} disabled={isSubmitting}>
        {isSubmitting ? MSG.submitting : MSG.submit}
      </button>
    </form>
  );
}

function ContactLine({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <li>
      <span className={a.contactIcon}><Icon d={icon} /></span>
      <span>{children}</span>
    </li>
  );
}

/* ─────────── Página ─────────── */
export function AboutClean({ solutions, testimonials, articles, faqs, partners }: Props) {
  const t = useCopy(COPY);
  const { openTypebot } = useTypebot();
  const phoneHref = `tel:${SITE_CONTACT.phone.replace(/[^\d+]/g, '')}`;

  return (
    <CleanShell current="about">
      <section className={s.pageHero} aria-labelledby="page-titulo">
        <div className={s.wrap}>
          <h1 id="page-titulo" className={cx(s.display, s.displayLeft, a.heroTitle)}>{t.heroTitle}</h1>
          <div className={s.pageHeroFoot}>
            <p className={s.lead}>{t.heroLead}</p>
            <div className={cx(s.actions, a.heroActions)}>
              <a href="#contato" className={s.btn}>{t.heroCta}</a>
              <a href="#solucoes" className={s.link}>{t.heroSecondary}</a>
            </div>
          </div>
        </div>
      </section>

      <section className={s.proofBand} aria-label={t.proofAria}>
        <div className={s.wrap}><PartnerLogos partners={partners} /></div>
      </section>

      <section className={cx(s.band, s.bandInk)} aria-labelledby="resultados-titulo">
        <div className={cx(s.wrap, a.results)}>
          <h2 id="resultados-titulo" className={cx(s.h2, a.h2Wide)} data-reveal>{t.resultsTitle}</h2>
          <div className={a.resultsRow}>
            <p data-reveal>{t.resultsText}</p>
            <dl className={a.stats} data-reveal style={delay(120)}>
              <div className={a.stat}><dt className={a.statLabel}>{t.statClients}</dt><dd className={a.statNum} style={{ order: -1, margin: 0 }}>+100</dd></div>
              <div className={a.stat}><dt className={a.statLabel}>{t.statSolutions}</dt><dd className={a.statNum} style={{ order: -1, margin: 0 }}>+500</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section id="solucoes" className={cx(s.band, a.anchor)} aria-labelledby="solucoes-titulo">
        <div className={s.wrap}>
          <SectionHead id="solucoes-titulo" title={t.solutionsTitle}>{t.solutionsText}</SectionHead>
          {solutions.length > 0 ? (
            <div data-reveal>
              <Accordion
                prefix="solucao"
                initialOpen={solutions[0]?.id}
                items={solutions.map((x) => ({ id: x.id, title: x.title, html: x.content, icon: x.icon || undefined }))}
              />
            </div>
          ) : (
            <p className={a.empty}>{t.solutionsEmpty}</p>
          )}
        </div>
      </section>

      <section className={cx(s.band, s.bandFog)} aria-labelledby="integracoes-titulo">
        <div className={cx(s.wrap, a.split)}>
          <div className={a.splitText} data-reveal>
            <h2 id="integracoes-titulo" className={s.h2}>{t.integrationsTitle}</h2>
            <p className={s.lead}>{t.integrationsText}</p>
          </div>
          <ul className={a.platforms} data-reveal style={delay(120)} aria-label={t.platformsAria}>
            {PLATFORMS.map((p) => (
              <li key={p.slug} className={a.platform}>
                <img src={`/integrations/${p.slug}.svg`} alt={p.name} loading="lazy" />
              </li>
            ))}
            <li className={cx(a.platform, a.platformHub)}>{t.hub}</li>
          </ul>
        </div>
      </section>

      <section className={s.band} aria-labelledby="entregas-titulo">
        <div className={s.wrap}>
          <SectionHead id="entregas-titulo" title={t.deliveriesTitle}>{t.deliveriesText}</SectionHead>
          <div className={a.group}>
            <h3 className={a.groupTitle} data-reveal>{t.aiGroup}</h3>
            <ul className={a.tiles}>
              {t.aiProjects.map((p, i) => (
                <li key={p.title} data-reveal style={delay(i * 90)}>
                  <article className={a.tile}>
                    <span className={s.cardTag} style={{ background: 'var(--paper)' }}>{p.tag}</span>
                    <h4 className={a.tileTitle}>{p.title}</h4>
                    <p className={s.muted}>{p.text}</p>
                  </article>
                </li>
              ))}
            </ul>
            <p className={a.groupFoot} data-reveal>
              <button type="button" className={cx(s.link, a.linkBtn)} onClick={() => openTypebot()}>{t.aiCta}</button>
            </p>
          </div>
          <div className={a.group}>
            <h3 className={a.groupTitle} data-reveal>{t.casesGroup}</h3>
            <ul className={cx(a.tiles, a.tiles2)}>
              {t.cases.map((c, i) => (
                <li key={c.title} data-reveal style={delay((i % 2) * 90)}>
                  <article className={a.tile}>
                    <span className={s.cardTag} style={{ background: 'var(--paper)' }}>{c.tag}</span>
                    <h4 className={a.tileTitle}>{c.title}</h4>
                    <p className={s.muted}>{c.text}</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="clientes" className={cx(s.band, s.bandFog, a.anchor)} aria-labelledby="clientes-titulo">
        <div className={s.wrap}>
          <SectionHead id="clientes-titulo" title={t.testimonialsTitle}>{t.testimonialsText}</SectionHead>
          {testimonials.length > 0 ? (
            <div className={a.quotes}>
              {testimonials.map((q, i) => (
                <div key={q.id} data-reveal style={delay((i % 3) * 90)}>
                  <Quote t={q} />
                </div>
              ))}
            </div>
          ) : (
            <p className={a.empty}>{t.testimonialsEmpty}</p>
          )}
        </div>
      </section>

      <section className={cx(s.band, s.bandInk)} aria-labelledby="sobre-titulo">
        <div className={cx(s.wrap, a.about)}>
          <div className={a.aboutText} data-reveal>
            <h2 id="sobre-titulo" className={a.slogan}>{t.slogan}</h2>
            <p>{t.about1}</p>
            <p>{t.about2}</p>
            <p>{t.about3}</p>
          </div>
          <div className={a.founder} data-reveal style={delay(120)}>
            <img src="/tamires-avatar.png" alt={t.founderAlt} width={256} height={384} loading="lazy" />
            <div className={a.founderBody}>
              <h3 className={a.founderName}>Tamires Cavani</h3>
              <span className={a.founderRole}>{t.founderRole}</span>
              <p>{t.founderBio}</p>
            </div>
            <span className={a.seal}><img src="/microsoftPartner.png" alt="Microsoft Partner" width={104} height={30} loading="lazy" /></span>
          </div>
        </div>
      </section>

      <section id="articles" className={cx(s.band, a.anchor)} aria-labelledby="artigos-titulo">
        <div className={s.wrap}>
          <div className={a.headRow} data-reveal>
            <h2 id="artigos-titulo" className={s.h2}>{t.articlesTitle}</h2>
            <Link href={ROUTES.articles} className={s.link}>{t.articlesAll}</Link>
          </div>
          {articles.length > 0 ? (
            <ul className={a.articles}>
              {articles.map((art, i) => (
                <li key={art.id} data-reveal style={delay(i * 90)}><ArticleCard article={art} /></li>
              ))}
            </ul>
          ) : (
            <p className={a.empty}>{t.articlesEmpty}</p>
          )}
        </div>
      </section>

      {faqs.length > 0 && (
        <section id="faq" className={cx(s.band, s.bandFog, a.anchor)} aria-labelledby="faq-titulo">
          <div className={cx(s.wrap, a.faq)}>
            <h2 id="faq-titulo" className={cx(s.h2, a.faqTitle)} data-reveal>{t.faqTitle}</h2>
            <div data-reveal style={delay(120)}>
              <Accordion prefix="faq" compact onFog items={faqs.map((f) => ({ id: f.id, title: f.title, html: f.description }))} />
            </div>
          </div>
        </section>
      )}

      <section id="contato" className={cx(s.band, a.anchor)} aria-labelledby="contato-titulo">
        <div className={s.wrap}>
          <div className={a.contact} data-reveal>
            <div className={a.contactInfo}>
              <h2 id="contato-titulo" className={a.slogan}>{t.contactTitle}</h2>
              <p>{t.contactText}</p>
              <ul className={a.contactList}>
                <ContactLine icon={ICON_PHONE}><a href={phoneHref}>{SITE_CONTACT.phone}</a></ContactLine>
                <ContactLine icon={ICON_PIN}>
                  {SITE_CONTACT.addressLines.map((line, i) => (
                    <span key={i} style={{ display: 'block' }}>{line}</span>
                  ))}
                </ContactLine>
              </ul>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </CleanShell>
  );
}
