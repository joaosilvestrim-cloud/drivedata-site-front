// Conteúdo compartilhado do site "clean": rotas, menu, rodapé e logos.
import { SITE_COUNTRY } from '@/common/config/site';
import type { Copy, Lang } from './i18n';

export const ACADEMY = 'https://academy.drivedata.com.br/';
// DriveVision: workspace de dashboards por assinatura (R$, Asaas, site em português).
// Só aparece no site do Brasil.
export const VISION = 'https://vision.drivedata.com.br/';
export const SHOW_VISION = SITE_COUNTRY !== 'CA';

/** Rotas oficiais do site. As URLs antigas foram mantidas por causa do SEO. */
export const ROUTES = {
  home: '/',
  about: '/about',
  solutions: '/about#solucoes',
  cases: '/cases',
  dalt: '/dalt',
  fabric: '/portal-fabric',
  jobs: '/vagas',
  partners: '/parceiros',
  articles: '/article',
} as const;

type Link = { href: string; label: string };

const NAV_COPY: Copy<{ solutions: string; cases: string; about: string; articles: string; jobs: string; partners: string }> = {
  pt: { solutions: 'Soluções', cases: 'Cases', about: 'Sobre', articles: 'Artigos', jobs: 'Vagas', partners: 'Parceiros' },
  en: { solutions: 'Solutions', cases: 'Case studies', about: 'About', articles: 'Articles', jobs: 'Careers', partners: 'Partners' },
  es: { solutions: 'Soluciones', cases: 'Casos', about: 'Nosotros', articles: 'Artículos', jobs: 'Empleos', partners: 'Socios' },
  fr: { solutions: 'Solutions', cases: 'Études de cas', about: 'À propos', articles: 'Articles', jobs: 'Carrières', partners: 'Partenaires' },
};

/** Menu principal. `key` identifica o item ativo sem depender do idioma. */
export const nav = (lang: Lang) => {
  const t = NAV_COPY[lang];
  return [
    { key: 'solutions', href: ROUTES.solutions, label: t.solutions },
    { key: 'cases', href: ROUTES.cases, label: t.cases },
    { key: 'about', href: ROUTES.about, label: t.about },
    { key: 'articles', href: ROUTES.articles, label: t.articles },
    { key: 'jobs', href: ROUTES.jobs, label: t.jobs },
    { key: 'partners', href: ROUTES.partners, label: t.partners },
  ] as const;
};
export type NavKey = ReturnType<typeof nav>[number]['key'];

/** Produtos e serviços: submenu "Soluções", rodapé e cartões da home. */
export type Product = { key: 'dalt' | 'fabric' | 'vision' | 'academy'; href: string; name: string; tag: string; text: string };
const PRODUCT_COPY: Copy<Record<Product['key'], { tag: string; text: string }>> = {
  pt: {
    dalt: { tag: 'Consultoria', text: 'Dados, BI, engenharia e IA sob medida para a sua operação.' },
    fabric: { tag: 'Produto', text: 'Acesso e governança sobre o Microsoft Fabric, com cada usuário vendo só o que deve.' },
    vision: { tag: 'Produto', text: 'Seu workspace de dashboards a partir de Excel, CSV, OneDrive e SharePoint.' },
    academy: { tag: 'Treinamento', text: 'Cursos e trilhas práticas de dados, BI e analytics.' },
  },
  en: {
    dalt: { tag: 'Consulting', text: 'Tailored data, BI, engineering and AI for your operation.' },
    fabric: { tag: 'Product', text: 'Access and governance on Microsoft Fabric, each user seeing only what they should.' },
    vision: { tag: 'Product', text: 'Your dashboard workspace built from Excel, CSV, OneDrive and SharePoint.' },
    academy: { tag: 'Training', text: 'Hands-on courses and tracks in data, BI and analytics.' },
  },
  es: {
    dalt: { tag: 'Consultoría', text: 'Datos, BI, ingeniería e IA a la medida de su operación.' },
    fabric: { tag: 'Producto', text: 'Acceso y gobernanza sobre Microsoft Fabric, cada usuario ve solo lo que debe.' },
    vision: { tag: 'Producto', text: 'Su espacio de dashboards a partir de Excel, CSV, OneDrive y SharePoint.' },
    academy: { tag: 'Formación', text: 'Cursos y rutas prácticas de datos, BI y analytics.' },
  },
  fr: {
    dalt: { tag: 'Conseil', text: 'Données, BI, ingénierie et IA sur mesure pour votre activité.' },
    fabric: { tag: 'Produit', text: 'Accès et gouvernance sur Microsoft Fabric, chacun ne voit que ce qu’il doit voir.' },
    vision: { tag: 'Produit', text: 'Votre espace de tableaux de bord à partir d’Excel, CSV, OneDrive et SharePoint.' },
    academy: { tag: 'Formation', text: 'Cours et parcours pratiques en données, BI et analytics.' },
  },
};
export const products = (lang: Lang): Product[] => {
  const t = PRODUCT_COPY[lang];
  const all: Product[] = [
    { key: 'dalt', href: ROUTES.dalt, name: 'DALT', ...t.dalt },
    { key: 'fabric', href: ROUTES.fabric, name: 'Portal Fabric', ...t.fabric },
    { key: 'vision', href: VISION, name: 'DriveVision', ...t.vision },
    { key: 'academy', href: ACADEMY, name: 'Academy', ...t.academy },
  ];
  return all.filter((p) => p.key !== 'vision' || SHOW_VISION);
};
export const ALL_SOLUTIONS_LABEL: Copy<string> = { pt: 'Todas as soluções', en: 'All solutions', es: 'Todas las soluciones', fr: 'Toutes les solutions' };

const FOOTER_COPY: Copy<{ solutions: string; allSolutions: string; company: string; partner: string; social: string }> = {
  pt: { solutions: 'Soluções', allSolutions: 'Todas as soluções', company: 'Empresa', partner: 'Seja parceiro', social: 'Redes' },
  en: { solutions: 'Solutions', allSolutions: 'All solutions', company: 'Company', partner: 'Become a partner', social: 'Social' },
  es: { solutions: 'Soluciones', allSolutions: 'Todas las soluciones', company: 'Empresa', partner: 'Sea socio', social: 'Redes' },
  fr: { solutions: 'Solutions', allSolutions: 'Toutes les solutions', company: 'Entreprise', partner: 'Devenir partenaire', social: 'Réseaux' },
};

export const footer = (lang: Lang): { title: string; links: Link[] }[] => {
  const t = FOOTER_COPY[lang];
  const n = NAV_COPY[lang];
  return [
    {
      title: t.solutions,
      links: [
        ...products(lang).map((p) => ({ href: p.href, label: p.name })),
        { href: ROUTES.solutions, label: t.allSolutions },
      ],
    },
    {
      title: t.company,
      links: [
        { href: ROUTES.about, label: n.about },
        { href: ROUTES.cases, label: n.cases },
        { href: ROUTES.jobs, label: n.jobs },
        { href: ROUTES.partners, label: t.partner },
        { href: ROUTES.articles, label: n.articles },
      ],
    },
    {
      title: t.social,
      links: [
        { href: 'https://www.linkedin.com/company/drivedatabi/', label: 'LinkedIn' },
        { href: 'https://www.instagram.com/_drivedata', label: 'Instagram' },
        { href: 'https://www.tiktok.com/@_drivedata', label: 'TikTok' },
      ],
    },
  ];
};

// Todos os logos de clientes do site (mesmos arquivos da tabela partner), com
// nome para leitor de tela. `h` é a altura em px: símbolos quadrados precisam de
// mais altura que logotipos em texto para ter o mesmo peso visual na faixa.
// `featured` = marca global conhecida: vai na fileira de cima da parede de
// clientes (pedido de 01/10/2026: o cliente de fora tem que reconhecer de cara).
// Vale entra como herança da DataCraft Intelligence (abre portas na mineração).
export const LOGOS: { src: string; name: string; h: number; featured?: boolean }[] = [
  { src: '/PepsiCo_logo.svg', name: 'PepsiCo', h: 30, featured: true },
  { src: '/clientes/layer1.svg', name: 'Unilever', h: 44, featured: true },
  { src: '/clientes/image 28006.svg', name: "McDonald's", h: 38, featured: true },
  { src: '/clientes/VISA LOGO 1.svg', name: 'Visa', h: 28, featured: true },
  { src: '/clientes/vale.svg', name: 'Vale', h: 40, featured: true },
  { src: '/clientes/image 28018.svg', name: 'JBS', h: 30, featured: true },
  { src: '/clientes/teck.svg', name: 'Teck', h: 30, featured: true },
  { src: '/clientes/image 28009.svg', name: 'McCain', h: 38 },
  { src: '/clientes/image 28004.svg', name: 'Vertiv', h: 24 },
  { src: '/clientes/Camada_1.svg', name: 'Tambasa', h: 28 },
  { src: '/clientes/image 28012.svg', name: 'ITT', h: 30 },
  { src: '/clientes/image 28005.svg', name: 'Bericap', h: 28 },
  { src: '/clientes/image 28010.svg', name: 'TV TEM', h: 36 },
  { src: '/clientes/image 28016.svg', name: 'TMG', h: 26 },
  { src: '/clientes/image 27999.svg', name: 'OEC', h: 30 },
  { src: '/clientes/FROSTY_portal 1.svg', name: 'Frosty', h: 34 },
  { src: '/clientes/image 28019.svg', name: 'Contatus', h: 38 },
  { src: '/clientes/image 28000.svg', name: 'Rei das Canecas', h: 38 },
  { src: '/clientes/image 27997 1.svg', name: 'Combina', h: 26 },
  { src: '/clientes/image 28017.svg', name: 'Nova União Alimentos', h: 38 },
  { src: '/clientes/image 28013.svg', name: 'Martinpel', h: 20 },
  { src: '/clientes/image 28002.svg', name: 'Technolog', h: 24 },
  { src: '/clientes/image 28003.svg', name: 'ViaGlobal Seguros', h: 40 },
  { src: '/clientes/image 27998.svg', name: 'Grupo Rotele', h: 40 },
  { src: '/clientes/image 28025.svg', name: 'Shift Mobilidade Corporativa', h: 36 },
  { src: '/clientes/image 28024.svg', name: 'Obify', h: 20 },
  { src: '/clientes/Group 1707489281.svg', name: 'Assisty 24h', h: 34 },
  { src: '/clientes/image 27993.svg', name: 'ACM', h: 40 },
  { src: '/clientes/image 28014.svg', name: 'IBF', h: 36 },
  { src: '/clientes/image 28015.svg', name: 'Martorelli Advogados', h: 26 },
  { src: '/clientes/image 28023.svg', name: 'Soluções Certas', h: 40 },
  { src: '/clientes/image 28008.svg', name: 'Inform Action', h: 34 },
  { src: '/clientes/image 27996.svg', name: 'Logo de cliente', h: 38 },
  { src: '/clientes/image 28011.svg', name: 'Logo de cliente', h: 36 },
  { src: '/clientes/image 28020.svg', name: 'Logo de cliente', h: 30 },
  { src: '/clientes/image 28021.svg', name: 'Logo de cliente', h: 38 },
];

/**
 * Versão leve do logo: os SVGs originais pesam até 400 KB (alguns trazem imagem
 * embutida). public/clientes/opt tem cada um em WebP com 120 px de altura
 * (2x o maior tamanho exibido). Arquivo fora da lista segue como está.
 */
const OPT_SKIP = new Set(['baldan']); // original já é pequeno; ampliar só borraria
export const optLogo = (src: string): string => {
  const m = src.match(/^\/(?:clientes\/)?([^/]+)\.(svg|png|webp)$/i);
  if (!m || !(src.startsWith('/clientes/') || src === '/PepsiCo_logo.svg')) return src;
  const name = m[1].toLowerCase().replace(/ /g, '-');
  return OPT_SKIP.has(name) ? src : `/clientes/opt/${name}.webp`;
};

/** Nome do cliente pelo arquivo do logo (a tabela partner quase nunca tem nome). */
export const logoName = (src: string) => LOGOS.find((l) => l.src === src)?.name ?? null;
/** A faixa anda na mesma velocidade qualquer que seja o número de logos. */
export const marqueeSpeed = (count: number) => ({ animationDuration: `${Math.max(24, count * 4)}s` });

export const isExternal = (href: string) => href.startsWith('http');
export const ext = (href: string) => (isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {});
export const stripHtml = (v: string) => v.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
