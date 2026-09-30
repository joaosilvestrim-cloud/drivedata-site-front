'use client';

// Página oficial do Portal Fabric (rota /portal-fabric), no visual "clean".
// Em pt, en, es e fr com troca de idioma na hora. Os textos longos vêm do
// content.ts da landing anterior (pt/en/fr); o espanhol e as frases próprias
// desta página ficam no COPY abaixo. A calculadora usa o mesmo modelo de preços
// (portal-fabric/pricing.ts): a moeda segue o país do site e a formatação dos
// números segue o idioma. Os botões de agenda e contato disparam os mesmos fluxos.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { SITE_COUNTRY } from '@/common/config/site';
import { BOOKING_URL, openBooking } from '@/portal-fabric/booking';
import { PORTAL_COPY, type PortalCopy } from '@/portal-fabric/content';
import {
  COUNTRY, LEVELS, REGIONS, SCHEDULES, SKUS, USD_PER_CU_HOUR,
  levelOf, recommendSku, simulate, usersToNextLevel,
  type Country, type SimInput,
} from '@/portal-fabric/pricing';
import { INTL_LOCALE, useCopy, useLang, type Copy } from './i18n';
import { CleanShell } from './shell';
import { Icon, SectionHead } from './ui';
import s from './clean.module.css';
import p from './portal-fabric.module.css';

// ─────────── Textos ───────────
// Só as partes do PortalCopy que esta página mostra (o espanhol é escrito aqui).
type PageSource = {
  hero: Pick<PortalCopy['hero'], 'title' | 'ctaPrimary' | 'ctaSecondary'>;
  video: Pick<PortalCopy['video'], 'title'>;
  pillars: { title: string; items: Pick<PortalCopy['pillars']['items'][number], 'tag' | 'title' | 'desc'>[] };
  how: Pick<PortalCopy['how'], 'title' | 'steps'>;
  arch: Pick<PortalCopy['arch'], 'title'>;
  features: Pick<PortalCopy['features'], 'title' | 'groups'>;
  roi: Pick<PortalCopy['roi'], 'title' | 'usersLabel' | 'monthlyLabel' | 'note' | 'calc'>;
  compare: Pick<PortalCopy['compare'], 'title' | 'colTraditional' | 'colPortal' | 'rows'>;
  proof: Pick<PortalCopy['proof'], 'title' | 'stats' | 'compatTitle' | 'compat'>;
  install: Omit<PortalCopy['install'], 'eyebrow'>;
  faq: Pick<PortalCopy['faq'], 'title' | 'subtitle' | 'items'>;
  schedule: PortalCopy['schedule'];
  cta: Pick<PortalCopy['cta'], 'title' | 'ctaPrimary' | 'ctaSecondary'>;
};
// A lei de privacidade citada acompanha o país do site em qualquer idioma: LGPD no
// Brasil, Lei 25 (Quebec) e PIPEDA no Canadá. A landing antiga citava a Lei 25 em
// inglês e francês mesmo no site do Brasil.
const LAW_SWAPS: [RegExp, string][] =
  SITE_COUNTRY === 'CA'
    ? [[/LGPD/g, 'Lei 25']]
    : [[/Law 25 \/ PIPEDA|Loi 25 \/ LPRPDE/g, 'LGPD'], [/Law 25|Loi 25/g, 'LGPD']];
function localLaw<T>(v: T): T {
  if (typeof v === 'string') return LAW_SWAPS.reduce<string>((acc, [re, to]) => acc.replace(re, to), v) as T;
  if (Array.isArray(v)) return v.map(localLaw) as T;
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, localLaw(x)])) as T;
  }
  return v;
}
const page = (c: PageSource): PageSource => localLaw(c);

const COMPAT_TAIL = ['Microsoft Entra ID', 'Azure Active Directory', 'Microsoft 365', 'Power BI Embedded A-SKU'];
// Lei de privacidade citada no espanhol (o inglês e o francês da landing já citam a Lei 25).
const ES_LAW = SITE_COUNTRY === 'CA' ? 'Ley 25' : 'LGPD';

const ES_SOURCE = page({
  hero: {
    title: 'El portal que transforma la forma en que su empresa consume datos',
    ctaPrimary: 'Agendar demostración',
    ctaSecondary: 'Calcular ahorro',
  },
  video: { title: 'Vea el Portal en acción' },
  pillars: {
    title: 'Tres pilares, un portal',
    items: [
      {
        tag: 'Usabilidad', title: 'Experiencia centrada en el usuario',
        desc: 'Interfaz unificada y personalizada que facilita el consumo de informes Power BI para todos los perfiles, del analista al ejecutivo.',
      },
      {
        tag: 'Gobernanza', title: 'Control, auditoría y cumplimiento',
        desc: 'Gobernanza granular sobre quién accede a qué, cuándo y cómo, con trazabilidad completa para la ley de protección de datos, auditorías internas y certificaciones.',
      },
      {
        tag: 'Ahorro en licencias', title: 'Reducción real de costos con Fabric',
        desc: 'Elimine licencias Power BI individuales innecesarias aprovechando la capacidad Fabric ya contratada para atender a todos los consumidores de informes.',
      },
    ],
  },
  how: {
    title: 'De la capacidad Fabric al usuario final',
    steps: [
      { title: 'Capacidad Fabric', desc: 'Su capacidad Microsoft Fabric (F-SKU o P-SKU) ya contratada sirve como base de procesamiento y renderizado.' },
      { title: 'Portal DriveData', desc: 'El portal gestiona identidades, permisos, catálogo de informes y trazabilidad de accesos en una sola capa.' },
      { title: 'Políticas y gobernanza', desc: 'Las reglas de acceso, auditoría y cumplimiento se aplican automáticamente, sin intervención manual del equipo de TI.' },
      { title: 'Usuario final', desc: 'Los colaboradores acceden a los informes con inicio de sesión SSO, sin necesidad de una licencia Power BI Pro individual.' },
    ],
  },
  arch: { title: 'Construido sobre Microsoft Fabric' },
  features: {
    title: 'Todo lo que ofrece el portal',
    groups: [
      {
        tag: 'Usabilidad',
        items: [
          { title: 'Embed nativo de Power BI y Fabric', desc: 'Informes Power BI y visuales Fabric renderizados directamente en el portal mediante la API oficial de embed, sin redirecciones ni cambios de contexto.' },
          { title: 'Experiencia mobile-first', desc: 'Interfaz totalmente adaptable con soporte para gestos táctiles, visualización optimizada para pantallas pequeñas y opción de PWA para instalar en el dispositivo.' },
          { title: 'Inicio de sesión SSO sin fricción', desc: 'Integración nativa con Microsoft Entra ID para inicio de sesión único. Los usuarios acceden con las mismas credenciales corporativas.' },
          { title: 'Panel ejecutivo de adopción', desc: 'Dashboard interno que muestra los informes más consultados, el tiempo de sesión, el compromiso por departamento y las tendencias de uso.' },
        ],
      },
      {
        tag: 'Gobernanza',
        items: [
          { title: 'Control de acceso granular (RBAC)', desc: 'Permisos por usuario, grupo, departamento o workspace, con herencia de grupos de Active Directory y revisión periódica automatizada.' },
          { title: 'Registro de auditoría completo', desc: 'Registro inmutable de toda la actividad: quién accedió, a qué informe, a qué hora, desde qué dispositivo e IP. Exportable a SIEM o a herramientas de cumplimiento.' },
          { title: 'Seguridad a nivel de fila (RLS)', desc: 'Row-Level Security aplicada automáticamente según el perfil del usuario autenticado, sin configuración manual por informe.' },
          { title: `Cumplimiento ${ES_LAW} y GDPR`, desc: 'Enmascaramiento de campos sensibles, gestión de consentimientos, informes de titulares y exportación de evidencias para auditorías regulatorias.' },
          { title: 'Alertas de acceso y anomalías', desc: 'Notificaciones en tiempo real para accesos fuera de horario, intentos no autorizados, volúmenes inusuales de consultas o picos de exportación.' },
          { title: 'Revisión periódica de accesos', desc: 'Flujo automatizado de revisión de permisos con aprobación del responsable, que elimina los accesos innecesarios.' },
        ],
      },
      {
        tag: 'Ahorro',
        items: [
          { title: 'Usuarios Free acceden vía Fabric Capacity', desc: 'Con la capacidad Fabric, los usuarios con licencia Microsoft 365 Free pueden consumir informes publicados, eliminando las licencias Pro individuales.' },
          { title: 'Monitoreo del uso de la capacidad', desc: 'Dashboards de consumo de CU (Capacity Units) en tiempo real para identificar cuellos de botella, optimizar el refresh y evitar autoscaling innecesario.' },
          { title: 'Informe de ROI y ahorro acumulado', desc: 'Panel ejecutivo con cálculo automático del ahorro, historial mensual y proyección anual.' },
          { title: 'Escala sin costo adicional por usuario', desc: 'Agregue 10 o 10.000 usuarios al portal sin un aumento proporcional del costo. La capacidad soporta cualquier volumen de consumidores.' },
          { title: 'Recomendaciones automáticas de dimensionamiento', desc: 'Análisis continuo del patrón de uso para sugerir el SKU de capacidad ideal, evitando el sobredimensionamiento o la pérdida de rendimiento.' },
          { title: 'Migración de licencias asistida', desc: 'Mapeo de los usuarios con licencia Pro y plan de migración al modelo por capacidad, con soporte técnico y simulación de impacto.' },
        ],
      },
    ],
  },
  roi: {
    title: 'Calcule su ahorro real',
    usersLabel: 'Usuarios que consumen informes',
    monthlyLabel: 'Ahorro mensual estimado',
    note: 'Valores de referencia para la simulación. El ahorro real depende del SKU, del volumen de uso y del contrato Microsoft vigente.',
    calc: {
      levelPrefix: 'Nivel',
      levels: { none: 'Aún no compensa', balance: 'Empate técnico', good: 'Ahorro real', high: 'Ahorro alto', max: 'Ahorro máximo' },
      monthlyDiff: 'Diferencia mensual',
      savingsLine: '{pct}% de reducción · {annual} al año',
      negativeNote: 'En este escenario la capacidad todavía cuesta más que las licencias.',
      nextGoal: '{n} usuario{s} más y llega a {level}',
      maxLevel: 'Está en el nivel máximo de ahorro',
      scenarioTitle: 'Su escenario',
      usersHint: 'Cuántas personas solo consumen informes (no los crean).',
      licenseTodayLabel: 'Licencia que paga hoy',
      licenseHint: '{cur} por usuario/mes. Precio de mercado de su país, puede ajustarlo según su contrato.',
      skuFieldLabel: 'Capacidad Fabric (SKU)',
      skuHints: { F2: 'equipos pequeños, pocos informes', F4: 'operación reducida', F8: 'lo más común en medianas empresas', F16: 'muchos informes y refresh intensivo', F32: 'operación grande', F64: 'escala enterprise' },
      skuRecommended: 'Recomendado para {n} usuarios, {hint}.',
      skuOther: 'Para {n} usuarios, lo más común es {rec}. El dimensionamiento final depende de su uso real.',
      regionLabel: 'Región de Azure',
      base: 'base',
      billingLabel: 'Modalidad de contratación',
      billingReserved: 'Reserva 1 año', billingPayg: 'Pago por uso',
      billingReservedHint: 'Compromiso de 1 año, encendida 24/7, con ~41% de descuento.',
      billingPaygHint: 'Sin compromiso y se puede pausar. Solo paga las horas encendida.',
      scheduleLabel: 'Capacidad encendida',
      scheduleLabels: { '24x7': 'Encendida 24/7', comercial: 'Horario comercial (12h)', reduzida: 'Jornada (8h hábiles)' },
      schedulePerMonth: '{label}, {hours}h/mes',
      scheduleHint: 'Pausar la capacidad fuera del horario laboral reduce bastante la factura.',
      breakEvenTitle: 'Punto de equilibrio',
      rowToday: 'Hoy · {n} × {price}',
      rowPortal: 'Portal DriveData · {sku} en {region}',
      youSave: 'Usted ahorra', difference: 'Diferencia',
      breakEvenNote: 'La capacidad cuesta lo mismo con 10 o 10.000 usuarios. Por encima de {n} usuarios ya sale más barata que las licencias.',
      eqUserZero: 'es lo que cuesta cada nuevo usuario en el portal. Hoy, cada uno cuesta {price}/mes.',
      eqLicenses: 'licencias {kind} durante un año entero es lo que paga su ahorro anual.',
      eqMonths: '{n} meses',
      eqCapacity: 'de capacidad {sku} salen gratis con lo que ahorra en un año.',
      footBase: 'Base del cálculo: capacidad Fabric a US$ {x} por CU/hora en East US',
      footRegionExtra: ' (+{p}% en {region})',
      footReserved: ' reserva de 1 año con ~41% de descuento',
      footPayg: ' {hours}h encendida al mes',
      footConv: ' convertida a {fx} por dólar. ',
      cta: 'Quiero validar este escenario con un especialista',
      beEquilibrium: 'equilibrio: {n} usuarios', beYou: 'usted', beUsers: '{n} usuarios',
      beLicenses: 'Licencias individuales ({price}/usuario)', beCapacity: 'Capacidad Fabric (fija)',
    },
  },
  compare: {
    title: 'Portal DriveData vs. modelo tradicional',
    colTraditional: 'Modelo tradicional Power BI',
    colPortal: 'Portal DriveData + Fabric',
    rows: [
      { crit: 'Licencia por usuario consumidor', trad: 'Power BI Pro obligatoria', portal: 'Basta una licencia Free' },
      { crit: 'Costo al escalar usuarios', trad: 'Crece linealmente con la plantilla', portal: 'Fijo por la capacidad Fabric' },
      { crit: 'Control de acceso granular', trad: 'Limitado a workspaces y apps', portal: 'Por usuario, grupo, informe' },
      { crit: 'Registro de auditoría detallado', trad: 'Activity Log básico (Office 365)', portal: 'Completo y exportable' },
      { crit: 'Identidad visual personalizada', trad: 'Interfaz estándar de Microsoft', portal: 'White-label completo' },
      { crit: 'SSO integrado', trad: 'Parcial (requiere cuenta Microsoft)', portal: 'Entra ID nativo' },
      { crit: 'Catálogo de informes con búsqueda', trad: 'Solo una lista de apps', portal: 'Búsqueda, etiquetas y favoritos' },
      { crit: `Cumplimiento ${ES_LAW} / GDPR`, trad: 'Manual, sin soporte nativo', portal: 'Enmascaramiento e informes' },
      { crit: 'Monitoreo de uso y ROI', trad: 'Capacity Metrics básico', portal: 'Dashboard ejecutivo completo' },
      { crit: 'Acceso móvil optimizado', trad: 'App Power BI Mobile genérica', portal: 'PWA white-label adaptable' },
    ],
  },
  proof: {
    title: 'Resultados que hablan por sí solos',
    stats: [
      { value: '+500', label: 'usuarios atendidos en promedio por implementación' },
      { value: '73%', label: 'de reducción promedio en el costo de licencias' },
      { value: '100%', label: 'de trazabilidad y auditoría de accesos' },
      { value: '<30d', label: 'tiempo promedio de implementación y puesta en marcha' },
    ],
    compatTitle: 'Compatible con',
    compat: ['Microsoft Fabric F2 a F64', 'Power BI Premium P1 a P5', ...COMPAT_TAIL],
  },
  install: {
    title: 'Rápido de instalar, a nuestra manera',
    subtitle: 'La instalación se hace en su propio entorno Microsoft, con nuestro equipo a su lado. No se instala nada en los equipos de los usuarios.',
    timeLabel: 'Tiempo promedio', timeValue: '1 a 2 días hábiles',
    modesTitle: 'Cómo instalamos',
    modes: [
      { title: 'Asistida', desc: 'Nuestro equipo conduce la instalación de principio a fin, junto con su TI.' },
      { title: 'Guiada', desc: 'Usted instala siguiendo nuestra documentación paso a paso, con soporte cuando lo necesite.' },
    ],
    prereqTitle: 'Requisitos previos',
    prereqs: [
      'Tenant Microsoft / Azure activo',
      'Permiso de administrador global (Global Admin)',
      'Workspace de Power BI publicado',
      'Licencia Power BI Pro, Premium, Fabric o Embedded',
    ],
    stepsTitle: 'Qué configuramos',
    steps: [
      { title: 'Registro de aplicación (Entra ID)', desc: 'Creamos la aplicación y el service principal que conectan el portal a su Power BI de forma segura.' },
      { title: 'Capacidad Fabric', desc: 'Asociación de la capacidad (F2 a F64) al workspace que servirá los informes.' },
      { title: 'Admin de Power BI', desc: 'Activación de los permisos de embedding y asociación del workspace al grupo de acceso.' },
      { title: 'Portal en línea', desc: 'Publicación del portal con control de acceso por usuario, listo para usar.' },
    ],
    cta: 'Agendar la instalación',
  },
  faq: {
    title: 'Preguntas frecuentes',
    subtitle: 'Lo que más preguntan las empresas antes de empezar.',
    items: [
      { q: '¿Es legal y cumple las reglas de Microsoft?', a: 'Sí. El portal usa el modelo oficial App Owns Data de Power BI Embedded, dentro de los términos de licenciamiento de Microsoft.' },
      { q: '¿Necesito instalar algo en mi equipo?', a: 'No. Todo funciona en su entorno Microsoft y en el navegador. No hay software que instalar en los equipos de los usuarios.' },
      { q: '¿Cuánto tarda la instalación?', a: 'En promedio de 1 a 2 días hábiles, según su entorno. Nuestro equipo acompaña todo el proceso.' },
      { q: '¿Hay soporte después de la instalación?', a: 'Sí. Cuenta con el soporte de DriveData para evoluciones, ajustes y nuevas necesidades.' },
      { q: '¿Con qué capacidades funciona?', a: 'Con Microsoft Fabric (F2 a F64), Power BI Premium y Power BI Embedded.' },
    ],
  },
  schedule: {
    title: 'Agende su demostración',
    subtitle: 'Elija el mejor horario abajo. La invitación llega directo a su agenda y a la nuestra.',
  },
  cta: {
    title: '¿Listo para transformar la forma en que su empresa consume datos?',
    ctaPrimary: 'Agendar demostración gratuita',
    ctaSecondary: 'Hablar con un consultor',
  },
});

const PT = {
  src: page(PORTAL_COPY.pt),
  heroLead: 'Uma camada centralizada sobre a sua capacidade Microsoft Fabric. Experiência melhor para quem usa, governança granular e redução expressiva de custos com licenças.',
  videoCaption: 'Um tour rápido pelo Portal DriveData rodando sobre a capacidade Microsoft Fabric.',
  pillarsLead: 'Três eixos que respondem às principais dores das equipes de dados.',
  howLead: 'O Portal DriveData fica entre a capacidade Microsoft Fabric da sua empresa e quem consome os dados. Simplifica o acesso, aplica governança e reduz custos.',
  archNote: (title: string) => `${title}. Integração nativa pelas APIs oficiais do Fabric e do Power BI, sem gambiarra.`,
  featuresLead: 'Recursos organizados pelos três pilares.',
  pillarsTabs: 'Pilares',
  chartLabel: (cap: string, be: number, users: number) =>
    `Licenças individuais crescem com o número de usuários. A capacidade Fabric fica fixa em ${cap} por mês. Equilíbrio em ${be} usuários; você está em ${users}.`,
  roiLead: 'Veja quanto sua empresa pode economizar trocando licenças individuais pela capacidade Fabric com o Portal DriveData.',
  usersValue: (n: number) => `${n} usuários`,
  licenseAria: (cur: string) => `Valor da licença por usuário por mês, em ${cur}`,
  recommended: ' (recomendado)',
  criterion: 'Critério',
  traditional: 'Tradicional',
  proofLead: 'Organizações de diferentes setores usam o Portal DriveData para ganhar governança, melhorar a experiência de quem consome relatórios e reduzir o custo com licenças Power BI.',
  ctaLead: 'Agende uma demonstração gratuita e veja na prática como a capacidade Microsoft Fabric reduz o custo com licenças e eleva a governança de BI da sua empresa.',
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    src: page({
      ...PORTAL_COPY.en,
      proof: { ...PORTAL_COPY.en.proof, compat: ['Microsoft Fabric F2 to F64', 'Power BI Premium P1 to P5', ...COMPAT_TAIL] },
    }),
    heroLead: 'A centralized layer over your Microsoft Fabric capacity. A better experience for users, granular governance and a significant cut in licensing costs.',
    videoCaption: 'A quick tour of Portal DriveData running on Microsoft Fabric capacity.',
    pillarsLead: 'Three axes that answer the main pain points of data teams.',
    howLead: 'Portal DriveData sits between your company’s Microsoft Fabric capacity and the people who consume the data. It simplifies access, applies governance and reduces costs.',
    archNote: (title) => `${title}. Native integration through the official Fabric and Power BI APIs, no workarounds.`,
    featuresLead: 'Capabilities organized by the three pillars.',
    pillarsTabs: 'Pillars',
    chartLabel: (cap, be, users) =>
      `Individual licenses grow with the number of users. Fabric capacity stays fixed at ${cap} per month. Break-even at ${be} users; you are at ${users}.`,
    roiLead: 'See how much your company can save by replacing individual licenses with Fabric capacity and Portal DriveData.',
    usersValue: (n) => `${n} users`,
    licenseAria: (cur) => `License price per user per month, in ${cur}`,
    recommended: ' (recommended)',
    criterion: 'Criterion',
    traditional: 'Traditional',
    proofLead: 'Organizations across sectors use Portal DriveData to gain governance, improve the experience of report consumers and cut Power BI licensing costs.',
    ctaLead: 'Book a free demo and see in practice how Microsoft Fabric capacity cuts licensing costs and raises your company’s BI governance.',
  },
  es: {
    src: ES_SOURCE,
    heroLead: 'Una capa centralizada sobre su capacidad Microsoft Fabric. Mejor experiencia para quienes la usan, gobernanza granular y una reducción notable de los costos de licencias.',
    videoCaption: 'Un recorrido rápido por Portal DriveData funcionando sobre la capacidad Microsoft Fabric.',
    pillarsLead: 'Tres ejes que responden a los principales retos de los equipos de datos.',
    howLead: 'Portal DriveData se ubica entre la capacidad Microsoft Fabric de su empresa y quienes consumen los datos. Simplifica el acceso, aplica gobernanza y reduce costos.',
    archNote: (title) => `${title}. Integración nativa mediante las API oficiales de Fabric y Power BI, sin soluciones improvisadas.`,
    featuresLead: 'Recursos organizados según los tres pilares.',
    pillarsTabs: 'Pilares',
    chartLabel: (cap, be, users) =>
      `Las licencias individuales crecen con el número de usuarios. La capacidad Fabric se mantiene fija en ${cap} al mes. Equilibrio en ${be} usuarios; usted está en ${users}.`,
    roiLead: 'Vea cuánto puede ahorrar su empresa al cambiar licencias individuales por la capacidad Fabric con Portal DriveData.',
    usersValue: (n) => `${n} usuarios`,
    licenseAria: (cur) => `Precio de la licencia por usuario al mes, en ${cur}`,
    recommended: ' (recomendado)',
    criterion: 'Criterio',
    traditional: 'Tradicional',
    proofLead: 'Organizaciones de distintos sectores usan Portal DriveData para ganar gobernanza, mejorar la experiencia de quienes consumen informes y reducir el costo de las licencias Power BI.',
    ctaLead: 'Agende una demostración gratuita y vea en la práctica cómo la capacidad Microsoft Fabric reduce el costo de licencias y eleva la gobernanza de BI de su empresa.',
  },
  fr: {
    src: page({
      ...PORTAL_COPY.fr,
      proof: { ...PORTAL_COPY.fr.proof, compat: ['Microsoft Fabric F2 à F64', 'Power BI Premium P1 à P5', ...COMPAT_TAIL] },
    }),
    heroLead: 'Une couche centralisée au-dessus de votre capacité Microsoft Fabric. Une meilleure expérience pour les utilisateurs, une gouvernance granulaire et une réduction marquée des coûts de licences.',
    videoCaption: 'Un aperçu rapide de Portal DriveData fonctionnant sur la capacité Microsoft Fabric.',
    pillarsLead: 'Trois axes qui répondent aux principaux défis des équipes de données.',
    howLead: 'Portal DriveData se place entre la capacité Microsoft Fabric de votre entreprise et ceux qui consomment les données. Il simplifie l’accès, applique la gouvernance et réduit les coûts.',
    archNote: (title) => `${title}. Intégration native via les API officielles de Fabric et Power BI, sans bricolage.`,
    featuresLead: 'Des capacités organisées selon les trois piliers.',
    pillarsTabs: 'Piliers',
    chartLabel: (cap, be, users) =>
      `Les licences individuelles augmentent avec le nombre d’utilisateurs. La capacité Fabric reste fixe à ${cap} par mois. Seuil de rentabilité à ${be} utilisateurs; vous êtes à ${users}.`,
    roiLead: 'Voyez combien votre entreprise peut économiser en remplaçant les licences individuelles par la capacité Fabric avec Portal DriveData.',
    usersValue: (n) => `${n} utilisateurs`,
    licenseAria: (cur) => `Prix de la licence par utilisateur par mois, en ${cur}`,
    recommended: ' (recommandé)',
    criterion: 'Critère',
    traditional: 'Traditionnel',
    proofLead: 'Des organisations de divers secteurs utilisent Portal DriveData pour gagner en gouvernance, améliorer l’expérience des consommateurs de rapports et réduire les coûts de licences Power BI.',
    ctaLead: 'Planifiez une démo gratuite et voyez concrètement comment la capacité Microsoft Fabric réduit les coûts de licences et rehausse la gouvernance BI de votre entreprise.',
  },
};

const tpl = (str: string, vars: Record<string, string | number>) =>
  str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });
const noStar = (str: string) => str.replace(/^★\s*/, '');
const noArrow = (str: string) => str.replace(/\s*→\s*$/, '');

const PILLAR_ICONS = [
  'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'M3 7l6 6 4-4 8 8M14 17h7v-7',
];

/** Extrai o ID (11 chars) de uma URL do YouTube (watch?v=, youtu.be, embed, shorts) ou de um ID puro. */
function youtubeId(input: string): string | null {
  const v = (input || '').trim();
  if (!v) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  try {
    const u = new URL(v);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0] || null;
    const q = u.searchParams.get('v');
    if (q) return q;
    const m = u.pathname.match(/\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
  } catch {
    /* não é URL: cai no regex abaixo */
  }
  const m = v.match(/[A-Za-z0-9_-]{11}/);
  return m ? m[0] : null;
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

/** Contador animado do resultado (mesmo comportamento da landing atual). */
function useCountUp(value: number, ms = 700) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { from.current = value; setDisplay(value); return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    let done = false;
    const finish = () => { if (!done) { done = true; from.current = value; setDisplay(value); } };
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setDisplay(a + (value - a) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick); else finish();
    };
    raf = requestAnimationFrame(tick);
    // com a aba em segundo plano o rAF para; o timer garante o valor final
    const safety = setTimeout(finish, ms + 150);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [value, ms]);
  return display;
}

/** Valor que só muda depois de um tempo parado (para o leitor de tela não narrar cada passo da régua). */
function useSettled<T>(value: T, ms = 700) {
  const [v, setV] = useState(value);
  useEffect(() => { const id = setTimeout(() => setV(value), ms); return () => clearTimeout(id); }, [value, ms]);
  return v;
}

// ─────────── Vídeo ───────────
function Video({ url }: { url?: string | null }) {
  const t = useCopy(COPY);
  const copy = t.src;
  const reduce = useReducedMotion();
  const id = youtubeId(url ?? '');
  if (!id) return null; // sem vídeo no admin, a seção não aparece (igual à landing atual)
  // Autoplay mudo, sem controles e sem interação, como na landing atual. Com
  // movimento reduzido o vídeo não toca sozinho e o player fica utilizável.
  const src = reduce
    ? `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
      '&controls=0&modestbranding=1&rel=0&disablekb=1&playsinline=1&fs=0&iv_load_policy=3';
  return (
    <section className={p.videoStage} aria-labelledby="video-titulo">
      <div className={s.wrap}>
        <h2 id="video-titulo" className={p.srOnly}>{copy.video.title}</h2>
        <div className={`${p.videoFrame} ${reduce ? p.videoLive : ''}`} data-reveal>
          <iframe
            src={src}
            title={copy.video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            {...(reduce ? {} : { tabIndex: -1, 'aria-hidden': true })}
          />
          {!reduce && <div className={p.shield} />}
        </div>
        <p className={p.videoCaption}>{t.videoCaption}</p>
      </div>
    </section>
  );
}

// ─────────── Funcionalidades (abas por pilar) ───────────
function Features() {
  const t = useCopy(COPY);
  const f = t.src.features;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = f.groups.length;
    const to = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n
      : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setActive(to);
    tabs.current[to]?.focus();
  };
  const group = f.groups[active];
  return (
    <section id="features" className={s.band} aria-labelledby="features-titulo">
      <div className={s.wrap}>
        <SectionHead id="features-titulo" title={f.title}>{t.featuresLead}</SectionHead>
        <div role="tablist" aria-label={t.pillarsTabs} className={p.tabs} data-reveal>
          {f.groups.map((g, i) => (
            <button
              key={g.tag}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`pf-tab-${i}`}
              aria-selected={i === active}
              aria-controls="pf-tabpanel"
              tabIndex={i === active ? 0 : -1}
              className={p.tab}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {g.tag}
            </button>
          ))}
        </div>
        <div role="tabpanel" id="pf-tabpanel" aria-labelledby={`pf-tab-${active}`} tabIndex={0} className={p.tabPanel}>
          <ul className={p.featGrid}>
            {group.items.map((it) => (
              <li key={it.title}>
                <h3 className={s.h3}>{it.title}</h3>
                <p className={s.muted}>{it.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─────────── Gráfico do ponto de equilíbrio ───────────
// Mesma geometria do BreakEven da landing atual; cores do fundo navy.
function BreakEvenChart({ users, licensePrice, capacityCost, breakEvenUsers, fmt }: {
  users: number; licensePrice: number; capacityCost: number; breakEvenUsers: number; fmt: (n: number) => string;
}) {
  const t = useCopy(COPY);
  const c = t.src.roi.calc;
  const maxUsers = Math.max(users * 1.6, breakEvenUsers * 2, 40);
  const maxCost = Math.max(maxUsers * licensePrice, capacityCost * 1.4, 1);
  const W = 560, H = 220, PAD_L = 8, PAD_B = 30, PAD_T = 30;
  const x = (u: number) => PAD_L + (u / maxUsers) * (W - PAD_L - 8);
  const y = (v: number) => H - PAD_B - (v / maxCost) * (H - PAD_B - PAD_T);
  const licEnd = { x: x(maxUsers), y: y(maxUsers * licensePrice) };
  const capY = y(capacityCost);
  const crossX = breakEvenUsers <= maxUsers ? x(breakEvenUsers) : null;
  const meX = x(users);
  const meY = y(users * licensePrice);
  const saving = users * licensePrice > capacityCost;
  const label = t.chartLabel(fmt(capacityCost), breakEvenUsers, users);
  // Rótulos em HTML por cima do SVG (posição em %): o desenho escala com a
  // largura, mas o texto fica sempre no tamanho de leitura, inclusive no celular.
  const at = (px: number, py: number) => ({ left: `${(px / W) * 100}%`, top: `${(py / H) * 100}%` });

  return (
    <figure className={p.chart}>
      <div className={p.plot}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} className={p.cGrid} x1={PAD_L} x2={W - 8} y1={y(maxCost * f)} y2={y(maxCost * f)} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <line className={p.cAxis} x1={PAD_L} x2={W - 8} y1={H - PAD_B} y2={H - PAD_B} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {crossX !== null && (
            <polygon className={p.cFill} points={`${crossX},${capY} ${licEnd.x},${licEnd.y} ${licEnd.x},${capY}`} />
          )}
          <line className={p.cCap} x1={PAD_L} x2={W - 8} y1={capY} y2={capY} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <line className={p.cLic} x1={x(0)} y1={y(0)} x2={licEnd.x} y2={licEnd.y} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {crossX !== null && (
            <>
              <line className={p.cGuide} x1={crossX} x2={crossX} y1={PAD_T} y2={H - PAD_B} strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
              <circle className={p.cNode} cx={crossX} cy={capY} r="5.5" strokeWidth="2" />
            </>
          )}
          <circle className={`${p.cMe} ${saving ? p.cMeOn : p.cMeOff}`} cx={meX} cy={meY} r="7" strokeWidth="2.5" />
        </svg>
        <span aria-hidden="true">
          {crossX !== null && (
            <span
              className={`${p.cTag} ${crossX < W * 0.4 ? p.cTagTopStart : crossX > W * 0.6 ? p.cTagTopEnd : p.cTagTop}`}
              style={at(crossX, PAD_T - 6)}
            >
              {tpl(c.beEquilibrium, { n: breakEvenUsers })}
            </span>
          )}
          <span className={`${p.cTag} ${p.cTagMe}`} style={at(Math.min(meX, W - 30), Math.max(meY - 12, PAD_T + 16))}>{c.beYou}</span>
          <span className={`${p.cTag} ${p.cTagStart}`} style={at(PAD_L, H - 4)}>0</span>
          <span className={`${p.cTag} ${p.cTagEnd}`} style={at(W - 8, H - 4)}>{tpl(c.beUsers, { n: Math.round(maxUsers) })}</span>
        </span>
      </div>
      <figcaption className={p.legend}>
        <span><i className={p.swLic} aria-hidden="true" /> {tpl(c.beLicenses, { price: fmt(licensePrice) })}</span>
        <span><i className={p.swCap} aria-hidden="true" /> {c.beCapacity}</span>
      </figcaption>
    </figure>
  );
}

// ─────────── Calculadora de ROI ───────────
function Roi() {
  const t = useCopy(COPY);
  const lang = useLang();
  const r = t.src.roi;
  const c = r.calc;
  const { openTypebot } = useTypebot();
  const cfg = COUNTRY[SITE_COUNTRY as Country] ?? COUNTRY.BR;

  const [users, setUsers] = useState(cfg.defaultUsers);
  const [licenseKind, setKind] = useState<'pro' | 'ppu'>('pro');
  const [licensePrice, setLic] = useState(cfg.proPrice);
  const [regionId, setRegion] = useState(cfg.defaultRegion);
  const [skuId, setSku] = useState('F8');
  const [billing, setBilling] = useState<'reserved' | 'payg'>('reserved');
  const [scheduleId, setSched] = useState('24x7');

  // Moeda pelo país do site; separadores de milhar e decimal pelo idioma.
  const locale = INTL_LOCALE[lang];
  const fmt = useMemo(() => {
    const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    return (n: number) => `${cfg.currency} ${nf.format(Math.round(n))}`;
  }, [cfg, locale]);
  const dec2 = (n: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  const fxLabel = `${cfg.currency} ${dec2(cfg.fx)}`;

  const input: SimInput = { users, licensePrice, skuId, regionId, billing, scheduleId, fx: cfg.fx };
  const sim = useMemo(() => simulate(input), [users, licensePrice, skuId, regionId, billing, scheduleId, cfg.fx]); // eslint-disable-line react-hooks/exhaustive-deps
  const level = levelOf(sim.savingsPct);
  const next = usersToNextLevel(input, level);
  const rec = recommendSku(users);
  const region = REGIONS.find((x) => x.id === regionId)!;
  const sku = SKUS.find((x) => x.id === skuId)!;
  const shown = useCountUp(Math.max(0, sim.savings));
  const positive = sim.savings > 0;
  const levelName = (key: string) => c.levels[key as keyof typeof c.levels];
  const skuHint = (id: string) => c.skuHints[id as keyof typeof c.skuHints];

  // Troca o preço quando muda Pro ↔ PPU.
  const switchKind = (k: 'pro' | 'ppu') => { setKind(k); setLic(k === 'pro' ? cfg.proPrice : cfg.ppuPrice); };

  const proYear = sim.annualSavings > 0 && licensePrice > 0 ? Math.floor(sim.annualSavings / (licensePrice * 12)) : 0;
  const capMonths = sim.annualSavings > 0 && sim.capacityCost > 0 ? Math.floor(sim.annualSavings / sim.capacityCost) : 0;
  const signed = (n: number) => (n > 0 ? fmt(n) : `− ${fmt(Math.abs(n))}`);

  const announce = useSettled(
    `${positive ? r.monthlyLabel : c.monthlyDiff}: ${signed(sim.savings)}. ${c.levelPrefix} ${level.idx}, ${levelName(level.key)}.`,
  );

  const schedHours = SCHEDULES.find((x) => x.id === scheduleId)?.hours ?? '';

  return (
    <section id="roi" className={`${s.band} ${s.bandFog}`} aria-labelledby="roi-titulo">
      <div className={s.wrap}>
        <SectionHead id="roi-titulo" title={r.title}>
          {t.roiLead}
        </SectionHead>

        <div className={p.roiGrid}>
          {/* Controles */}
          <div className={p.panel} data-reveal>
            <h3 className={p.panelTitle}>{c.scenarioTitle}</h3>

            <div className={p.field}>
              <div className={p.fieldHead}>
                <label htmlFor="pf-users" className={p.fieldLabel}>{r.usersLabel}</label>
                <output htmlFor="pf-users" className={p.fieldValue}>{users}</output>
              </div>
              <input
                id="pf-users" className={p.range} type="range" min={10} max={3000} step={10}
                value={users} onChange={(e) => setUsers(Number(e.target.value))}
                aria-valuetext={t.usersValue(users)} aria-describedby="pf-users-hint"
              />
              <p id="pf-users-hint" className={p.hint}>{c.usersHint}</p>
            </div>

            <div className={p.field}>
              <span id="pf-lic-label" className={p.fieldLabel}>{c.licenseTodayLabel}</span>
              <div className={p.seg} role="group" aria-labelledby="pf-lic-label">
                <button type="button" className={p.segBtn} aria-pressed={licenseKind === 'pro'} onClick={() => switchKind('pro')}>Power BI Pro</button>
                <button type="button" className={p.segBtn} aria-pressed={licenseKind === 'ppu'} onClick={() => switchKind('ppu')}>Premium (PPU)</button>
              </div>
              <div className={p.money}>
                <span aria-hidden="true">{cfg.currency}</span>
                <input
                  id="pf-lic" type="number" min={0} step={1} inputMode="decimal" value={licensePrice}
                  aria-label={t.licenseAria(cfg.currency)} aria-describedby="pf-lic-hint"
                  onChange={(e) => setLic(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <p id="pf-lic-hint" className={p.hint}>{tpl(c.licenseHint, { cur: cfg.currency })}</p>
            </div>

            <div className={p.field}>
              <span id="pf-sku-label" className={p.fieldLabel}>{c.skuFieldLabel}</span>
              <div className={p.skus} role="group" aria-labelledby="pf-sku-label">
                {SKUS.map((x) => (
                  <button
                    key={x.id} type="button" title={skuHint(x.id)}
                    className={`${p.skuBtn} ${rec.id === x.id ? p.skuRec : ''}`}
                    aria-pressed={skuId === x.id} onClick={() => setSku(x.id)}
                  >
                    {x.id}
                    {rec.id === x.id && <span className={p.srOnly}>{t.recommended}</span>}
                  </button>
                ))}
              </div>
              <p className={p.hint} aria-live="polite">
                {rec.id === skuId
                  ? noStar(tpl(c.skuRecommended, { n: users, hint: skuHint(sku.id) }))
                  : noStar(tpl(c.skuOther, { n: users, rec: rec.id }))}
              </p>
            </div>

            <div className={p.field}>
              <label htmlFor="pf-region" className={p.fieldLabel}>{c.regionLabel}</label>
              <select id="pf-region" className={p.select} value={regionId} onChange={(e) => setRegion(e.target.value)}>
                {REGIONS.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.label}{x.mult === 1 ? ` · ${c.base}` : ` · +${Math.round((x.mult - 1) * 100)}%`}
                  </option>
                ))}
              </select>
            </div>

            <div className={p.field}>
              <span id="pf-billing-label" className={p.fieldLabel}>{c.billingLabel}</span>
              <div className={p.seg} role="group" aria-labelledby="pf-billing-label">
                <button type="button" className={p.segBtn} aria-pressed={billing === 'reserved'} onClick={() => setBilling('reserved')}>{c.billingReserved}</button>
                <button type="button" className={p.segBtn} aria-pressed={billing === 'payg'} onClick={() => setBilling('payg')}>{c.billingPayg}</button>
              </div>
              <p className={p.hint}>{billing === 'reserved' ? c.billingReservedHint : c.billingPaygHint}</p>
            </div>

            {billing === 'payg' && (
              <div className={p.field}>
                <label htmlFor="pf-sched" className={p.fieldLabel}>{c.scheduleLabel}</label>
                <select id="pf-sched" className={p.select} value={scheduleId} onChange={(e) => setSched(e.target.value)}>
                  {SCHEDULES.map((x) => (
                    <option key={x.id} value={x.id}>
                      {tpl(c.schedulePerMonth, { label: c.scheduleLabels[x.id as keyof typeof c.scheduleLabels], hours: x.hours })}
                    </option>
                  ))}
                </select>
                <p className={p.hint}>{c.scheduleHint}</p>
              </div>
            )}
          </div>

          {/* Resultado */}
          <div className={p.result} data-reveal style={delay(100)}>
            <div className={p.levelRow}>
              <span className={p.levelPill}>{c.levelPrefix} {Math.max(level.idx, 0)} · {levelName(level.key)}</span>
              <span className={p.meter} aria-hidden="true">
                {LEVELS.filter((l) => l.idx > 0).map((l) => (
                  <i key={l.key} className={level.idx >= l.idx ? p.meterOn : undefined} />
                ))}
              </span>
            </div>

            <p className={p.resultLabel}>{positive ? r.monthlyLabel : c.monthlyDiff}</p>
            <p className={`${p.big} ${positive ? '' : p.bigNeg}`} aria-hidden="true">
              {positive ? fmt(shown) : `− ${fmt(Math.abs(sim.savings))}`}
            </p>
            <p className={p.srOnly} aria-live="polite">{announce}</p>
            <p className={p.resultLine}>
              {positive
                ? tpl(c.savingsLine, { pct: Math.round(sim.savingsPct), annual: fmt(sim.annualSavings) })
                : c.negativeNote}
            </p>
            {next && (
              <p className={p.nextGoal}>
                {tpl(c.nextGoal, { n: next.users, s: next.users !== 1 ? 's' : '', level: levelName(next.level.key) })}
              </p>
            )}
            {!next && positive && <p className={p.nextGoal}>{c.maxLevel}</p>}

            <div className={p.chartBlock}>
              <h3 className={p.chartTitle}>{c.breakEvenTitle}</h3>
              <BreakEvenChart
                users={users} licensePrice={licensePrice} capacityCost={sim.capacityCost}
                breakEvenUsers={sim.breakEvenUsers} fmt={fmt}
              />
            </div>

            <dl className={p.rows}>
              <div className={p.row}>
                <dt>{tpl(c.rowToday, { n: users, price: fmt(licensePrice) })}</dt>
                <dd>{fmt(sim.licenseCost)}</dd>
              </div>
              <div className={p.row}>
                <dt>{tpl(c.rowPortal, { sku: sku.id, region: region.label })}</dt>
                <dd>{fmt(sim.capacityCost)}</dd>
              </div>
              <div className={`${p.row} ${p.rowTotal}`}>
                <dt>{positive ? c.youSave : c.difference}</dt>
                <dd className={positive ? '' : p.bigNeg}>{signed(sim.savings)}</dd>
              </div>
            </dl>
            <p className={p.resultNote}>{tpl(c.breakEvenNote, { n: sim.breakEvenUsers })}</p>
          </div>
        </div>

        {positive && (
          <ul className={p.eqs}>
            <li><strong>{cfg.currency} 0</strong><span>{tpl(c.eqUserZero, { price: fmt(licensePrice) })}</span></li>
            <li><strong>{proYear}</strong><span>{tpl(c.eqLicenses, { kind: licenseKind === 'pro' ? 'Pro' : 'PPU' })}</span></li>
            <li><strong>{tpl(c.eqMonths, { n: capMonths })}</strong><span>{tpl(c.eqCapacity, { sku: sku.id })}</span></li>
          </ul>
        )}

        <div className={p.roiFoot}>
          <p>
            {tpl(c.footBase, { x: dec2(USD_PER_CU_HOUR) })}
            {region.mult !== 1 && tpl(c.footRegionExtra, { p: Math.round((region.mult - 1) * 100), region: region.label })},
            {billing === 'reserved' ? c.footReserved : tpl(c.footPayg, { hours: schedHours })},
            {tpl(c.footConv, { fx: fxLabel })}{r.note}
          </p>
          <button type="button" className={`${s.link} ${p.linkBtn}`} onClick={() => openTypebot()}>
            {noArrow(c.cta)} <span className={p.arrow} aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────── Perguntas frequentes ───────────
function Faq() {
  const f = useCopy(COPY).src.faq;
  const [open, setOpen] = useState<number | null>(0);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: f.items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  };
  return (
    <section id="faq" className={`${s.band} ${s.bandFog}`} aria-labelledby="faq-titulo">
      <div className={`${s.wrap} ${p.faqGrid}`}>
        <div className={p.faqHead} data-reveal>
          <h2 id="faq-titulo" className={s.h2}>{f.title}</h2>
          <p className={s.muted}>{f.subtitle}</p>
        </div>
        <ul className={p.faqList} data-reveal style={delay(100)}>
          {f.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q}>
                <h3>
                  <button
                    type="button" className={p.faqQ} aria-expanded={isOpen} aria-controls={`pf-faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{it.q}</span>
                    <span className={p.faqIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                </h3>
                <div id={`pf-faq-${i}`} className={p.faqA} hidden={!isOpen}><p>{it.a}</p></div>
              </li>
            );
          })}
        </ul>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

// ─────────── Página ───────────
export function PortalFabricClean({ videoUrl }: { videoUrl?: string | null }) {
  const { openTypebot } = useTypebot();
  const t = useCopy(COPY);
  const copy = t.src;
  const h = copy.hero;

  return (
    <CleanShell current="solutions">
      <section className={s.pageHero} aria-labelledby="page-titulo">
        <div className={s.wrap}>
          <h1 id="page-titulo" className={`${s.display} ${s.displayLeft} ${p.heroTitle}`}>{h.title}</h1>
          <div className={s.pageHeroFoot}>
            <p className={s.lead}>{t.heroLead}</p>
            <div className={s.actions}>
              <button type="button" className={s.btn} onClick={openBooking}>{h.ctaPrimary}</button>
              <a href="#roi" className={s.link}>{h.ctaSecondary}</a>
            </div>
          </div>
        </div>
      </section>

      <Video url={videoUrl} />

      <section id="pilares" className={`${s.band} ${s.bandFog} ${youtubeId(videoUrl ?? '') ? p.afterVideo : ''}`} aria-labelledby="pilares-titulo">
        <div className={s.wrap}>
          <SectionHead id="pilares-titulo" title={copy.pillars.title}>{t.pillarsLead}</SectionHead>
          <ul className={p.pillars}>
            {copy.pillars.items.map((it, i) => (
              <li key={it.tag} className={p.pillar} data-reveal style={delay(i * 90)}>
                <span className={s.icon}><Icon d={PILLAR_ICONS[i]} /></span>
                <span className={s.cardTag}>{it.tag}</span>
                <h3 className={p.pillarTitle}>{it.title}</h3>
                <p className={s.muted}>{it.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="como-funciona" className={`${s.band} ${s.bandInk}`} aria-labelledby="como-titulo">
        <div className={s.wrap}>
          <div className={s.split} data-reveal>
            <h2 id="como-titulo" className={s.h2}>{copy.how.title}</h2>
            <p className={p.onInkLead}>{t.howLead}</p>
          </div>
          <ol className={`${s.steps} ${p.steps4}`}>
            {copy.how.steps.map((st, i) => (
              <li key={st.title} className={s.step} data-reveal style={delay(i * 110)}>
                <span className={s.stepNum} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.h3}>{st.title}</h3>
                <p>{st.desc}</p>
              </li>
            ))}
          </ol>
          <p className={p.archNote} data-reveal>
            {t.archNote(copy.arch.title)}
          </p>
        </div>
      </section>

      <Features />

      <Roi />

      <section id="comparativo" className={s.band} aria-labelledby="comparativo-titulo">
        <div className={s.wrap}>
          <h2 id="comparativo-titulo" className={`${s.h2} ${p.compareTitle}`} data-reveal>{copy.compare.title}</h2>
          <div className={p.tableWrap} data-reveal style={delay(100)}>
            <table className={p.table}>
              <thead>
                <tr>
                  <th scope="col"><span className={p.srOnly}>{t.criterion}</span></th>
                  <th scope="col">{copy.compare.colTraditional}</th>
                  <th scope="col" className={p.colPortal}>{copy.compare.colPortal}</th>
                </tr>
              </thead>
              <tbody>
                {copy.compare.rows.map((row) => (
                  <tr key={row.crit}>
                    <th scope="row">{row.crit}</th>
                    <td data-label={t.traditional}>{row.trad}</td>
                    <td data-label="Portal DriveData" className={p.colPortal}>{row.portal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={`${s.band} ${s.bandInk}`} aria-labelledby="impacto-titulo">
        <div className={s.wrap}>
          <div className={s.split} data-reveal>
            <h2 id="impacto-titulo" className={s.h2}>{copy.proof.title}</h2>
            <p className={p.onInkLead}>{t.proofLead}</p>
          </div>
          <ul className={p.stats}>
            {copy.proof.stats.map((st, i) => (
              <li key={st.label} data-reveal style={delay(i * 90)}>
                <strong>{st.value}</strong>
                <span>{st.label}</span>
              </li>
            ))}
          </ul>
          <div className={p.compat} data-reveal>
            <h3>{copy.proof.compatTitle}</h3>
            <ul>{copy.proof.compat.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section id="instalacao" className={s.band} aria-labelledby="instalacao-titulo">
        <div className={s.wrap}>
          <div className={`${s.split} ${p.splitTop}`} data-reveal>
            <h2 id="instalacao-titulo" className={s.h2}>{copy.install.title}</h2>
            <div className={p.installLead}>
              <p className={s.lead}>{copy.install.subtitle}</p>
              <p className={p.timeBox}>
                <span>{copy.install.timeLabel}</span>
                <strong>{copy.install.timeValue}</strong>
              </p>
            </div>
          </div>
          <div className={p.installGrid}>
            <div data-reveal>
              <h3 className={s.fitTitle}>{copy.install.modesTitle}</h3>
              <ul className={s.fitList}>
                {copy.install.modes.map((m) => <li key={m.title}><strong>{m.title}</strong>{m.desc}</li>)}
              </ul>
              <h3 className={`${s.fitTitle} ${p.blockGap}`}>{copy.install.prereqTitle}</h3>
              <ul className={`${s.fitList} ${p.prereqs}`}>
                {copy.install.prereqs.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div data-reveal style={delay(100)}>
              <h3 className={s.fitTitle}>{copy.install.stepsTitle}</h3>
              <ol className={p.installSteps}>
                {copy.install.steps.map((st, i) => (
                  <li key={st.title}>
                    <span className={p.installNum} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <div><strong>{st.title}</strong><p>{st.desc}</p></div>
                  </li>
                ))}
              </ol>
              <button type="button" className={`${s.link} ${p.linkBtn} ${p.installCta}`} onClick={openBooking}>
                {copy.install.cta} <span className={p.arrow} aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Faq />

      <section id="agenda" className={s.band} aria-labelledby="agenda-titulo">
        <div className={`${s.wrap} ${p.agendaGrid}`}>
          <div className={p.agendaHead} data-reveal>
            <h2 id="agenda-titulo" className={s.h2}>{copy.schedule.title}</h2>
            <p className={s.lead}>{copy.schedule.subtitle}</p>
          </div>
          <div className={p.agendaFrame} data-reveal style={delay(100)}>
            {/* Agenda pública do Microsoft Bookings: os agendamentos caem no Outlook do time. */}
            <iframe src={BOOKING_URL} title={copy.schedule.title} loading="lazy" />
          </div>
        </div>
      </section>

      <section className={`${s.band} ${s.bandTight}`} aria-labelledby="cta-titulo">
        <div className={s.wrap}>
          <div className={s.cta} data-reveal>
            <h2 id="cta-titulo" className={s.h2}>{copy.cta.title}</h2>
            <div className={s.ctaActions}>
              <p>{t.ctaLead}</p>
              <div className={s.ctaButtons}>
                <button type="button" className={s.btn} onClick={openBooking}>{copy.cta.ctaPrimary}</button>
                <button type="button" className={`${s.link} ${p.linkBtn}`} onClick={() => openTypebot()}>{copy.cta.ctaSecondary}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CleanShell>
  );
}
