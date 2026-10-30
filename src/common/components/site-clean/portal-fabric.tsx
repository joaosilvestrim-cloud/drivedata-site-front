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
  COUNTRY, LEVELS, REGIONS, SCHEDULES, SKUS, SKU_LIMITS, SIZING, USD_PER_CU_HOUR,
  levelOf, recommendSku, simulate, sizeCapacity, skuMonthlyCost, usersToNextLevel,
  type Country, type RefreshWeight, type SimInput,
} from '@/portal-fabric/pricing';
import { INTL_LOCALE, useCopy, useLang, type Copy } from './i18n';
import { CleanShell } from './shell';
import { Portal4D } from './portal-4d';
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
        tag: 'Acceso a los paneles',
        items: [
          { title: 'Paneles por área', desc: 'Paneles organizados por área, con favoritos y cambio rápido entre los paneles de la misma área.' },
          { title: 'Catálogo con solicitud de acceso', desc: 'La persona ve lo que existe y pide acceso. El administrador lo aprueba en el propio portal.' },
          { title: 'Permisos por área, panel y página', desc: 'Libere por área o por panel y elija qué páginas del informe ve cada persona.' },
          { title: 'Seguridad por fila (RLS)', desc: 'El RLS de Power BI se aplica con la identidad de cada persona. Cada uno ve solo los datos que le corresponden.' },
          { title: 'Matriz de acceso', desc: 'Una pantalla muestra quién ve cada panel.' },
          { title: 'Sello de actualización', desc: 'Cada panel muestra el estado de la última actualización de los datos.' },
          { title: 'Exportación de datos', desc: 'Los datos de un visual se exportan en CSV o Excel.' },
        ],
      },
      {
        tag: 'Usuarios',
        items: [
          { title: 'Alta a su manera', desc: 'Alta manual, importación por CSV o sincronización con un grupo de Entra ID.' },
          { title: 'Contraseña provisional', desc: 'La persona recibe una contraseña provisional y debe cambiarla en el primer acceso.' },
          { title: 'Bloqueo por inactividad', desc: 'Quien no entra durante el número de días definido se bloquea automáticamente.' },
          { title: 'Acceso asistido', desc: 'El administrador entra como la persona para darle soporte, sin pedir la contraseña.' },
        ],
      },
      {
        tag: 'Seguridad',
        items: [
          { title: 'Dos pasos para administradores', desc: 'Verificación en dos pasos obligatoria para quien administra el portal.' },
          { title: 'Acceso por red, horario y día', desc: 'Entrada restringida por IP permitidas, por horario y por días de la semana.' },
          { title: 'Auditoría', desc: 'Las acciones y los accesos quedan registrados para consulta.' },
        ],
      },
      {
        tag: 'Compartir',
        items: [
          { title: 'Enlaces de invitado', desc: 'Un enlace abre el panel para quien no tiene usuario.' },
          { title: 'Modo TV', desc: 'Paneles en rotación en una pantalla, sin inicio de sesión.' },
        ],
      },
      {
        tag: 'Comunicación y soporte',
        items: [
          { title: 'Avisos', desc: 'Comunicados para todos en la campana o en una franja en la parte superior de la pantalla.' },
          { title: 'Notificaciones', desc: 'Aviso de panel nuevo, acceso liberado, datos actualizados y fallas.' },
          { title: 'Tickets de soporte', desc: 'La persona abre el ticket y el administrador responde en el propio portal.' },
        ],
      },
      {
        tag: 'Monitoreo y capacidad',
        items: [
          { title: 'Actualizaciones de datos', desc: 'Estado de las actualizaciones de cada panel, con alerta de falla.' },
          { title: 'Rendimiento por panel', desc: 'Tiempo de carga y aperturas fallidas de cada panel.' },
          { title: 'Uso de la capacidad', desc: 'Cuánto de la capacidad Fabric contratada está en uso.' },
          { title: 'Agenda de la capacidad', desc: 'Enciende y apaga la capacidad en los horarios definidos, para pagar solo el tiempo de uso.' },
        ],
      },
      {
        tag: 'Integración y uso',
        items: [
          { title: 'Con su marca', desc: 'Dominio, logo y colores del cliente.' },
          { title: 'Claves de API', desc: 'Para integrar el portal con otros sistemas.' },
          { title: 'Cuatro idiomas', desc: 'Portugués, inglés, español y francés.' },
          { title: 'En el celular', desc: 'Aplicación Android y versión para el navegador del celular.' },
          { title: 'Asistente de IA', desc: 'Responde preguntas sobre la página abierta del panel. Tiene prueba gratis y planes mensuales.' },
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
      { crit: 'Licencia de quien solo visualiza', trad: 'Power BI Pro para cada persona (por debajo de F64)', portal: 'Sin licencia individual (App Owns Data)' },
      { crit: 'Costo al crecer', trad: 'Una licencia Pro más por persona', portal: 'Capacidad fija y mensualidad por usuario' },
      { crit: 'Control de acceso', trad: 'Por workspace y app', portal: 'Por área, panel, página y fila (RLS)' },
      { crit: 'Política de acceso', trad: 'Configurada aparte en Entra ID', portal: 'Red, horario y día de la semana en el portal' },
      { crit: 'Auditoría', trad: 'Registro de actividad de Microsoft 365', portal: 'Acciones y accesos registrados en el portal' },
      { crit: 'Marca', trad: 'Interfaz estándar de Microsoft', portal: 'Dominio, logo y colores del cliente' },
      { crit: 'Encontrar el informe', trad: 'Lista de apps y workspaces', portal: 'Áreas, búsqueda, favoritos y catálogo' },
      { crit: 'Uso y rendimiento', trad: 'Informe de uso por workspace', portal: 'Aperturas, tiempo de carga, fallas y capacidad' },
      { crit: 'Soporte a quien usa', trad: 'Fuera de la herramienta', portal: 'Tickets, avisos y acceso asistido en el portal' },
      { crit: 'Celular', trad: 'App Power BI Mobile', portal: 'App Android y navegador del celular' },
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
      { q: '¿Quien solo visualiza necesita licencia Pro?', a: 'No. El portal usa el modelo App Owns Data: quien solo visualiza no necesita licencia individual en ningún tamaño de capacidad. Quien publica informes en Power BI mantiene su licencia Pro.' },
      { q: '¿Qué capacidad Fabric necesito?', a: 'Depende de cuántas veces se abren los informes, de cuántos modelos se actualizan por día y del tamaño del modelo más grande. Use el simulador de capacidad de esta página y confírmelo con dos semanas de medición en Capacity Metrics antes de reservar por un año.' },
    ],
  },
  schedule: {
    title: 'Agende su demostración',
    subtitle: 'Elija el mejor horario abajo. La invitación llega directo a su agenda y a la nuestra.',
    fallback: '¿No aparece la agenda?',
    fallbackLink: 'Abrir en una pestaña nueva',
    loading: 'Cargando la agenda…',
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
  featuresLead: 'O que o portal entrega hoje, organizado por frente.',
  pillarsTabs: 'Funcionalidades',
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
  pageNav: {
    label: 'Nesta página',
    items: { pilares: 'Pilares', 'como-funciona': 'Como funciona', features: 'Funcionalidades', capacidade: 'Capacidade', roi: 'Economia', comparativo: 'Comparativo', instalacao: 'Instalação', faq: 'Dúvidas', agenda: 'Agenda' },
    cta: 'Agendar demonstração',
  },
  scene: { capacity: 'Capacidade Fabric', portal: 'Portal DriveData', people: 'Cada área, só o seu dado', aria: 'Animação: os dados saem da capacidade Fabric, passam pelo Portal DriveData e chegam a cada pessoa só com o que ela pode ver.' },
  sizing: {
    title: 'Qual capacidade Fabric você precisa?',
    lead: 'Responda sobre o uso de hoje. O simulador estima o tamanho pela consulta no pico, pela atualização dos dados e pela memória do maior modelo.',
    panelTitle: 'Seu uso',
    people: 'Pessoas que acessam',
    opens: 'Aberturas por pessoa por dia útil',
    opensHint: 'Quantas vezes, em média, cada pessoa abre um relatório por dia. O comum fica entre 3 e 4.',
    hours: 'Janela de uso',
    hoursOpt: '{h} h',
    hoursHint: 'Horas do dia em que as pessoas usam os relatórios.',
    models: 'Modelos semânticos que atualizam',
    modelsHint: 'Modelos (datasets) com atualização agendada.',
    refreshes: 'Atualizações por dia de cada modelo',
    weight: 'Peso de cada atualização',
    weights: { light: 'Leve', medium: 'Médio', heavy: 'Pesado' },
    weightHints: { light: 'Modelos pequenos, poucas tabelas e fontes.', medium: 'O caso comum: algumas fontes e milhões de linhas.', heavy: 'Modelos grandes, muitas fontes ou transformações pesadas.' },
    largest: 'Tamanho do maior modelo (GB)',
    largestHint: 'No Power BI Pro nenhum modelo passa de 1 GB. Ao atualizar, o modelo ocupa cerca do dobro.',
    dq: 'Algum modelo usa DirectQuery?',
    yes: 'Sim', no: 'Não',
    resultLabel: 'Capacidade recomendada',
    none: 'Acima da F64',
    noneNote: 'Esse uso pede mais que uma F64. Fale com a gente para dividir em capacidades ou otimizar os modelos.',
    minimum: 'Mínimo aceitável: {sku}, sem folga para os picos.',
    sameMin: 'É também o menor tamanho que comporta esse uso.',
    drivers: {
      refresh: 'A atualização dos dados é o que decide o tamanho.',
      query: 'A consulta no horário de pico é o que decide o tamanho.',
      memory: 'A memória do maior modelo é o que decide o tamanho.',
      directquery: 'O DirectQuery pede 10 conexões por modelo, o que começa na F8.',
    },
    colSku: 'SKU', colPeak: 'Pico de consulta', colDay: 'Uso do dia', colMem: 'Memória',
    status: { rec: 'recomendada', min: 'no limite', no: 'não comporta', over: 'com folga' },
    memOk: '{gb} GB', memNo: '{gb} GB, pouco',
    costReserved: 'Reserva de 1 ano', costPayg: 'Por uso, ligada 24/7', perMonth: '{v} por mês',
    costRegion: 'Preço de tabela em {region}, sem impostos.',
    apply: 'Levar {sku} para o simulador de economia',
    opensDay: '{n} aberturas por dia',
    premises: 'Estimativa com premissas declaradas: {pages} páginas por abertura, {cu} CU-segundos por página, pico de 3 vezes a média da janela de uso e atualização de {light}, {medium} ou {heavy} CU-segundos (leve, médio ou pesado). Acima de 70% de uso o tamanho sobe. Confirme com duas semanas de medição no Capacity Metrics antes de reservar por um ano.',
  },
  roiX: {
    publishers: 'Quem publica relatórios',
    publishersHint: 'Contas Pro de quem cria e publica no Power BI. Elas continuam necessárias com o Portal.',
    rowFee: 'Mensalidade do Portal · {n} × {fee}',
    rowFeeTbd: 'Mensalidade do Portal',
    feeTbd: 'sob consulta',
    rowPublishers: 'Contas Pro de quem publica · {n} × {price}',
    rowCapacity: 'Capacidade {sku} em {region}',
    rowTotal: 'Total com o Portal',
    feeNote: 'Mensalidade do Portal de {fee} por usuário, sem impostos. A capacidade é contratada direto com a Microsoft.',
    feeTbdNote: 'A mensalidade do Portal não entra nesta conta. Fale com a gente para saber o valor no seu país.',
    breakEvenNote: 'A partir de {n} usuários o Portal sai mais barato que Pro para todos. Cada pessoa nova custa {fee} no Portal e {price} no Pro.',
    eqUserFee: 'é o que custa cada pessoa nova no Portal. No Pro, {price} por mês.',
    beCapacity: 'Portal + capacidade + contas de quem publica',
    paygNote: 'Ao pausar, a Microsoft cobra na hora o consumo que ainda estava sendo diluído.',
    fromSizing: 'Capacidade e usuários vieram do simulador de capacidade.',
  },
  agendaFacts: [
    ['30 minutos', 'Conversa online. O link da reunião vai no convite.'],
    ['Na prática', 'Você vê o portal funcionando e tira dúvidas de licença e capacidade.'],
    ['Sem custo', 'A demonstração é gratuita e não gera compromisso.'],
  ] as [string, string][],
  agendaSlow: 'A agenda está demorando para abrir.',
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
    featuresLead: 'What the portal delivers today, by area.',
    pillarsTabs: 'Features',
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
    pageNav: {
      label: 'On this page',
      items: { pilares: 'Pillars', 'como-funciona': 'How it works', features: 'Features', capacidade: 'Capacity', roi: 'Savings', comparativo: 'Comparison', instalacao: 'Setup', faq: 'FAQ', agenda: 'Book' },
      cta: 'Book a demo',
    },
    scene: { capacity: 'Fabric capacity', portal: 'DriveData Portal', people: 'Each area, only its data', aria: 'Animation: data leaves the Fabric capacity, goes through the DriveData Portal and reaches each person with only what they may see.' },
    sizing: {
      title: 'Which Fabric capacity do you need?',
      lead: 'Answer about today’s usage. The simulator estimates the size from peak queries, data refreshes and the memory of the largest model.',
      panelTitle: 'Your usage',
      people: 'People who access reports',
      opens: 'Opens per person per business day',
      opensHint: 'How many times, on average, each person opens a report per day. Usually 3 to 4.',
      hours: 'Usage window',
      hoursOpt: '{h} h',
      hoursHint: 'Hours of the day when people use the reports.',
      models: 'Semantic models that refresh',
      modelsHint: 'Models (datasets) with scheduled refresh.',
      refreshes: 'Refreshes per day for each model',
      weight: 'Weight of each refresh',
      weights: { light: 'Light', medium: 'Medium', heavy: 'Heavy' },
      weightHints: { light: 'Small models, few tables and sources.', medium: 'The usual case: a few sources and millions of rows.', heavy: 'Large models, many sources or heavy transformations.' },
      largest: 'Size of the largest model (GB)',
      largestHint: 'On Power BI Pro no model goes above 1 GB. During refresh a model takes about twice its size.',
      dq: 'Does any model use DirectQuery?',
      yes: 'Yes', no: 'No',
      resultLabel: 'Recommended capacity',
      none: 'Above F64',
      noneNote: 'This usage needs more than an F64. Talk to us about splitting capacities or optimizing the models.',
      minimum: 'Minimum acceptable: {sku}, with no room for peaks.',
      sameMin: 'It is also the smallest size that handles this usage.',
      drivers: {
        refresh: 'Data refresh is what sets the size.',
        query: 'Peak-hour queries are what set the size.',
        memory: 'The memory of the largest model is what sets the size.',
        directquery: 'DirectQuery needs 10 connections per model, which starts at F8.',
      },
      colSku: 'SKU', colPeak: 'Peak queries', colDay: 'Daily usage', colMem: 'Memory',
      status: { rec: 'recommended', min: 'at the limit', no: 'too small', over: 'room to spare' },
      memOk: '{gb} GB', memNo: '{gb} GB, too little',
      costReserved: '1-year reservation', costPayg: 'Pay as you go, on 24/7', perMonth: '{v} per month',
      costRegion: 'List price in {region}, before taxes.',
      apply: 'Take {sku} to the savings simulator',
      opensDay: '{n} opens per day',
      premises: 'Estimate with stated assumptions: {pages} pages per open, {cu} CU-seconds per page, a peak of 3 times the average of the usage window and refreshes of {light}, {medium} or {heavy} CU-seconds (light, medium or heavy). Above 70% usage the size goes up. Confirm with two weeks of measurement in Capacity Metrics before reserving for a year.',
    },
    roiX: {
      publishers: 'People who publish reports',
      publishersHint: 'Pro accounts for those who build and publish in Power BI. They are still needed with the Portal.',
      rowFee: 'Portal fee · {n} × {fee}',
      rowFeeTbd: 'Portal fee',
      feeTbd: 'on request',
      rowPublishers: 'Pro accounts for publishers · {n} × {price}',
      rowCapacity: '{sku} capacity in {region}',
      rowTotal: 'Total with the Portal',
      feeNote: 'Portal fee of {fee} per user, before taxes. The capacity is bought directly from Microsoft.',
      feeTbdNote: 'The Portal fee is not in this calculation. Talk to us for the price in your country.',
      breakEvenNote: 'From {n} users the Portal costs less than Pro for everyone. Each new person costs {fee} on the Portal and {price} on Pro.',
      eqUserFee: 'is what each new person costs on the Portal. On Pro, {price} per month.',
      beCapacity: 'Portal + capacity + publisher accounts',
      paygNote: 'When you pause, Microsoft bills right away the usage that was still being smoothed.',
      fromSizing: 'Capacity and users came from the capacity simulator.',
    },
    agendaFacts: [
      ['30 minutes', 'Online call. The meeting link comes in the invite.'],
      ['Hands-on', 'You see the portal running and get your licensing and capacity questions answered.'],
      ['Free', 'The demo is free and carries no commitment.'],
    ],
    agendaSlow: 'The calendar is taking a while to open.',
  },
  es: {
    src: ES_SOURCE,
    heroLead: 'Una capa centralizada sobre su capacidad Microsoft Fabric. Mejor experiencia para quienes la usan, gobernanza granular y una reducción notable de los costos de licencias.',
    videoCaption: 'Un recorrido rápido por Portal DriveData funcionando sobre la capacidad Microsoft Fabric.',
    pillarsLead: 'Tres ejes que responden a los principales retos de los equipos de datos.',
    howLead: 'Portal DriveData se ubica entre la capacidad Microsoft Fabric de su empresa y quienes consumen los datos. Simplifica el acceso, aplica gobernanza y reduce costos.',
    archNote: (title) => `${title}. Integración nativa mediante las API oficiales de Fabric y Power BI, sin soluciones improvisadas.`,
    featuresLead: 'Lo que el portal entrega hoy, organizado por frente.',
    pillarsTabs: 'Funcionalidades',
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
    pageNav: {
      label: 'En esta página',
      items: { pilares: 'Pilares', 'como-funciona': 'Cómo funciona', features: 'Funcionalidades', capacidade: 'Capacidad', roi: 'Ahorro', comparativo: 'Comparativo', instalacao: 'Instalación', faq: 'Preguntas', agenda: 'Agenda' },
      cta: 'Agendar demostración',
    },
    scene: { capacity: 'Capacidad Fabric', portal: 'Portal DriveData', people: 'Cada área, solo sus datos', aria: 'Animación: los datos salen de la capacidad Fabric, pasan por el Portal DriveData y llegan a cada persona solo con lo que puede ver.' },
    sizing: {
      title: '¿Qué capacidad Fabric necesita?',
      lead: 'Responda sobre el uso de hoy. El simulador estima el tamaño por la consulta en el pico, la actualización de los datos y la memoria del modelo más grande.',
      panelTitle: 'Su uso',
      people: 'Personas que acceden',
      opens: 'Aperturas por persona por día hábil',
      opensHint: 'Cuántas veces, en promedio, cada persona abre un informe por día. Lo común es entre 3 y 4.',
      hours: 'Ventana de uso',
      hoursOpt: '{h} h',
      hoursHint: 'Horas del día en que las personas usan los informes.',
      models: 'Modelos semánticos que se actualizan',
      modelsHint: 'Modelos (datasets) con actualización programada.',
      refreshes: 'Actualizaciones por día de cada modelo',
      weight: 'Peso de cada actualización',
      weights: { light: 'Liviana', medium: 'Media', heavy: 'Pesada' },
      weightHints: { light: 'Modelos pequeños, pocas tablas y fuentes.', medium: 'El caso común: algunas fuentes y millones de filas.', heavy: 'Modelos grandes, muchas fuentes o transformaciones pesadas.' },
      largest: 'Tamaño del modelo más grande (GB)',
      largestHint: 'En Power BI Pro ningún modelo supera 1 GB. Al actualizarse, el modelo ocupa cerca del doble.',
      dq: '¿Algún modelo usa DirectQuery?',
      yes: 'Sí', no: 'No',
      resultLabel: 'Capacidad recomendada',
      none: 'Por encima de F64',
      noneNote: 'Este uso pide más que una F64. Hable con nosotros para dividir en capacidades u optimizar los modelos.',
      minimum: 'Mínimo aceptable: {sku}, sin margen para los picos.',
      sameMin: 'También es el menor tamaño que soporta este uso.',
      drivers: {
        refresh: 'La actualización de los datos es lo que define el tamaño.',
        query: 'La consulta en la hora pico es lo que define el tamaño.',
        memory: 'La memoria del modelo más grande es lo que define el tamaño.',
        directquery: 'DirectQuery pide 10 conexiones por modelo, lo que empieza en F8.',
      },
      colSku: 'SKU', colPeak: 'Pico de consulta', colDay: 'Uso del día', colMem: 'Memoria',
      status: { rec: 'recomendada', min: 'al límite', no: 'no soporta', over: 'con margen' },
      memOk: '{gb} GB', memNo: '{gb} GB, poco',
      costReserved: 'Reserva de 1 año', costPayg: 'Pago por uso, encendida 24/7', perMonth: '{v} al mes',
      costRegion: 'Precio de lista en {region}, sin impuestos.',
      apply: 'Llevar {sku} al simulador de ahorro',
      opensDay: '{n} aperturas por día',
      premises: 'Estimación con supuestos declarados: {pages} páginas por apertura, {cu} CU-segundos por página, pico de 3 veces el promedio de la ventana de uso y actualización de {light}, {medium} o {heavy} CU-segundos (liviana, media o pesada). Por encima del 70% de uso el tamaño sube. Confírmelo con dos semanas de medición en Capacity Metrics antes de reservar por un año.',
    },
    roiX: {
      publishers: 'Quien publica informes',
      publishersHint: 'Cuentas Pro de quien crea y publica en Power BI. Siguen siendo necesarias con el Portal.',
      rowFee: 'Mensualidad del Portal · {n} × {fee}',
      rowFeeTbd: 'Mensualidad del Portal',
      feeTbd: 'a consultar',
      rowPublishers: 'Cuentas Pro de quien publica · {n} × {price}',
      rowCapacity: 'Capacidad {sku} en {region}',
      rowTotal: 'Total con el Portal',
      feeNote: 'Mensualidad del Portal de {fee} por usuario, sin impuestos. La capacidad se contrata directamente con Microsoft.',
      feeTbdNote: 'La mensualidad del Portal no entra en esta cuenta. Hable con nosotros para conocer el valor en su país.',
      breakEvenNote: 'A partir de {n} usuarios el Portal sale más barato que Pro para todos. Cada persona nueva cuesta {fee} en el Portal y {price} en Pro.',
      eqUserFee: 'es lo que cuesta cada persona nueva en el Portal. En Pro, {price} al mes.',
      beCapacity: 'Portal + capacidad + cuentas de quien publica',
      paygNote: 'Al pausar, Microsoft cobra en el momento el consumo que todavía se estaba diluyendo.',
      fromSizing: 'La capacidad y los usuarios vinieron del simulador de capacidad.',
    },
    agendaFacts: [
      ['30 minutos', 'Reunión en línea. El enlace llega en la invitación.'],
      ['En la práctica', 'Ve el portal funcionando y resuelve sus dudas de licencias y capacidad.'],
      ['Sin costo', 'La demostración es gratuita y sin compromiso.'],
    ],
    agendaSlow: 'La agenda está tardando en abrir.',
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
    featuresLead: 'Ce que le portail offre aujourd’hui, par domaine.',
    pillarsTabs: 'Fonctionnalités',
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
    pageNav: {
      label: 'Sur cette page',
      items: { pilares: 'Piliers', 'como-funciona': 'Fonctionnement', features: 'Fonctionnalités', capacidade: 'Capacité', roi: 'Économies', comparativo: 'Comparatif', instalacao: 'Installation', faq: 'Questions', agenda: 'Rendez-vous' },
      cta: 'Planifier une démo',
    },
    scene: { capacity: 'Capacité Fabric', portal: 'Portail DriveData', people: 'Chaque domaine, ses données', aria: 'Animation : les données quittent la capacité Fabric, passent par le Portail DriveData et arrivent à chaque personne avec seulement ce qu’elle peut voir.' },
    sizing: {
      title: 'De quelle capacité Fabric avez-vous besoin ?',
      lead: 'Répondez sur votre usage actuel. Le simulateur estime la taille à partir des requêtes en pointe, des actualisations de données et de la mémoire du plus gros modèle.',
      panelTitle: 'Votre usage',
      people: 'Personnes qui consultent',
      opens: 'Ouvertures par personne par jour ouvré',
      opensHint: 'Combien de fois, en moyenne, chaque personne ouvre un rapport par jour. Souvent 3 à 4.',
      hours: 'Plage d’utilisation',
      hoursOpt: '{h} h',
      hoursHint: 'Heures de la journée pendant lesquelles les rapports sont utilisés.',
      models: 'Modèles sémantiques actualisés',
      modelsHint: 'Modèles (jeux de données) avec actualisation planifiée.',
      refreshes: 'Actualisations par jour de chaque modèle',
      weight: 'Poids de chaque actualisation',
      weights: { light: 'Légère', medium: 'Moyenne', heavy: 'Lourde' },
      weightHints: { light: 'Petits modèles, peu de tables et de sources.', medium: 'Le cas courant : quelques sources et des millions de lignes.', heavy: 'Gros modèles, nombreuses sources ou transformations lourdes.' },
      largest: 'Taille du plus gros modèle (Go)',
      largestHint: 'Avec Power BI Pro aucun modèle ne dépasse 1 Go. Pendant l’actualisation, un modèle occupe environ le double.',
      dq: 'Un modèle utilise-t-il DirectQuery ?',
      yes: 'Oui', no: 'Non',
      resultLabel: 'Capacité recommandée',
      none: 'Au-delà de F64',
      noneNote: 'Cet usage demande plus qu’une F64. Parlez-nous pour répartir en plusieurs capacités ou optimiser les modèles.',
      minimum: 'Minimum acceptable : {sku}, sans marge pour les pointes.',
      sameMin: 'C’est aussi la plus petite taille qui supporte cet usage.',
      drivers: {
        refresh: 'C’est l’actualisation des données qui fixe la taille.',
        query: 'Ce sont les requêtes en heure de pointe qui fixent la taille.',
        memory: 'C’est la mémoire du plus gros modèle qui fixe la taille.',
        directquery: 'DirectQuery demande 10 connexions par modèle, ce qui commence à la F8.',
      },
      colSku: 'SKU', colPeak: 'Requêtes en pointe', colDay: 'Usage du jour', colMem: 'Mémoire',
      status: { rec: 'recommandée', min: 'à la limite', no: 'insuffisante', over: 'avec marge' },
      memOk: '{gb} Go', memNo: '{gb} Go, trop peu',
      costReserved: 'Réservation d’un an', costPayg: 'Paiement à l’usage, allumée 24/7', perMonth: '{v} par mois',
      costRegion: 'Prix catalogue en {region}, hors taxes.',
      apply: 'Utiliser {sku} dans le simulateur d’économies',
      opensDay: '{n} ouvertures par jour',
      premises: 'Estimation selon des hypothèses déclarées : {pages} pages par ouverture, {cu} CU-secondes par page, une pointe de 3 fois la moyenne de la plage d’utilisation et des actualisations de {light}, {medium} ou {heavy} CU-secondes (légère, moyenne ou lourde). Au-delà de 70 % d’usage, la taille augmente. Confirmez avec deux semaines de mesure dans Capacity Metrics avant de réserver pour un an.',
    },
    roiX: {
      publishers: 'Personnes qui publient des rapports',
      publishersHint: 'Comptes Pro de ceux qui créent et publient dans Power BI. Ils restent nécessaires avec le Portail.',
      rowFee: 'Tarif du Portail · {n} × {fee}',
      rowFeeTbd: 'Tarif du Portail',
      feeTbd: 'sur demande',
      rowPublishers: 'Comptes Pro des auteurs · {n} × {price}',
      rowCapacity: 'Capacité {sku} en {region}',
      rowTotal: 'Total avec le Portail',
      feeNote: 'Tarif du Portail de {fee} par utilisateur, hors taxes. La capacité est achetée directement auprès de Microsoft.',
      feeTbdNote: 'Le tarif du Portail n’est pas inclus dans ce calcul. Contactez-nous pour le prix dans votre pays.',
      breakEvenNote: 'À partir de {n} utilisateurs, le Portail coûte moins cher que Pro pour tous. Chaque nouvelle personne coûte {fee} sur le Portail et {price} sur Pro.',
      eqUserFee: 'c’est ce que coûte chaque nouvelle personne sur le Portail. Sur Pro, {price} par mois.',
      beCapacity: 'Portail + capacité + comptes des auteurs',
      paygNote: 'À la mise en pause, Microsoft facture aussitôt la consommation qui était encore lissée.',
      fromSizing: 'La capacité et les utilisateurs viennent du simulateur de capacité.',
    },
    agendaFacts: [
      ['30 minutes', 'Rencontre en ligne. Le lien arrive dans l’invitation.'],
      ['Concrètement', 'Vous voyez le portail en action et posez vos questions sur les licences et la capacité.'],
      ['Gratuit', 'La démo est gratuite et sans engagement.'],
    ],
    agendaSlow: 'L’agenda met du temps à s’ouvrir.',
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

// ─────────── Menu da página ───────────
// Fica preso logo abaixo do cabeçalho do site. Marca a seção em que a pessoa está
// (traço verde que desliza até o item) e mostra o quanto da página já foi lido.
const PAGE_SECTIONS = ['pilares', 'como-funciona', 'features', 'capacidade', 'roi', 'comparativo', 'instalacao', 'faq', 'agenda'] as const;
function PageNav() {
  const t = useCopy(COPY);
  const n = t.pageNav;
  const [active, setActive] = useState<string>(PAGE_SECTIONS[0]);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 48;
      let cur: string = PAGE_SECTIONS[0];
      for (const id of PAGE_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive(cur);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progRef.current) progRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);

  // o traço vai até o item ativo; no celular a lista rola para mostrá-lo
  useEffect(() => {
    const list = listRef.current;
    const a = list?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!list || !a) return;
    const raf = requestAnimationFrame(() => setBar({ x: a.offsetLeft, w: a.offsetWidth }));
    const target = a.offsetLeft - list.clientWidth / 2 + a.offsetWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    return () => cancelAnimationFrame(raf);
  }, [active, n]);

  return (
    <nav ref={navRef} className={p.pageNav} aria-label={n.label}>
      <div className={`${s.wrap} ${p.pageNavInner}`}>
        <ul ref={listRef} className={p.pageNavList}>
          {PAGE_SECTIONS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className={p.pageNavLink} aria-current={active === id ? 'location' : undefined}>{n.items[id]}</a>
            </li>
          ))}
          <span className={p.pageNavBar} style={{ transform: `translateX(${bar.x}px)`, width: bar.w }} aria-hidden="true" />
        </ul>
        <button type="button" className={`${s.btn} ${p.pageNavCta}`} onClick={openBooking}>{n.cta}</button>
      </div>
      <span ref={progRef} className={p.pageNavProgress} aria-hidden="true" />
    </nav>
  );
}

// Número da faixa de resultados: conta até o valor quando aparece na tela.
// Aceita prefixo e sufixo ("+500", "73%", "<30d"); sem número, mostra o texto.
function StatValue({ value }: { value: string }) {
  const m = /^(\D*)(\d+)(.*)$/.exec(value);
  const target = m ? Number(m[2]) : 0;
  const [n, setN] = useState(target);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1100);
        setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame((now) => { setN(0); step(now); });
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps
  return <strong ref={ref} aria-label={value}>{m ? `${m[1]}${n}${m[3]}` : value}</strong>;
}

// ─────────── Funcionalidades (abas por pilar) ───────────
function Features() {
  const t = useCopy(COPY);
  const f = t.src.features;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  // menu lateral no desktop (setas para cima e para baixo), fileira que rola no celular
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = f.groups.length;
    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight', prev = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    const to = next ? (i + 1) % n : prev ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setActive(to);
    tabs.current[to]?.focus();
  };
  const group = f.groups[active];
  // o traço verde vai até a frente escolhida: na vertical à esquerda, na horizontal embaixo
  const [thumb, setThumb] = useState({ x: 0, y: 0, w: 0, h: 0 });
  useEffect(() => {
    const place = () => {
      const el = tabs.current[active], list = listRef.current;
      if (!el || !list) return;
      const vertical = getComputedStyle(list).flexDirection === 'column';
      setThumb(vertical
        ? { x: 0, y: el.offsetTop, w: 2, h: el.offsetHeight }
        : { x: el.offsetLeft, y: el.offsetTop + el.offsetHeight - 2, w: el.offsetWidth, h: 2 });
      if (!vertical) list.scrollTo({ left: Math.max(0, el.offsetLeft - list.clientWidth / 2 + el.offsetWidth / 2), behavior: 'smooth' });
    };
    const raf = requestAnimationFrame(place);
    window.addEventListener('resize', place);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', place); };
  }, [active, f.groups]);
  const count = (n: number) => String(n).padStart(2, '0');

  return (
    <section id="features" className={s.band} aria-labelledby="features-titulo">
      <div className={s.wrap}>
        <SectionHead id="features-titulo" title={f.title}>{t.featuresLead}</SectionHead>
        <div className={p.featLayout}>
          <div ref={listRef} role="tablist" aria-label={t.pillarsTabs} aria-orientation="vertical" className={p.fTabs} data-reveal>
            <span className={p.fThumb} style={{ transform: `translate(${thumb.x}px, ${thumb.y}px)`, width: thumb.w, height: thumb.h }} aria-hidden="true" />
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
                className={p.fTab}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span>{g.tag}</span>
                <span className={p.fCount} aria-hidden="true">{count(g.items.length)}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" id="pf-tabpanel" aria-labelledby={`pf-tab-${active}`} tabIndex={0} className={p.fPanel}>
            <p key={`h${active}`} className={p.fPanelHead}>
              <strong>{group.tag}</strong>
              <span>{count(active + 1)} / {count(f.groups.length)}</span>
            </p>
            <ul key={active} className={p.featGrid}>
              {group.items.map((it, i) => (
                <li key={it.title} className={p.featItem} style={{ ['--i' as string]: i }}>
                  <h3 className={s.h3}>{it.title}</h3>
                  <p className={s.muted}>{it.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────── Gráfico do ponto de equilíbrio ───────────
// Mesma geometria do BreakEven da landing atual; cores do fundo navy. O lado do
// portal é o custo fixo (capacidade + contas de quem publica) mais a tarifa por usuário.
function BreakEvenChart({ users, licensePrice, fixedCost, fee, breakEvenUsers, fmt }: {
  users: number; licensePrice: number; fixedCost: number; fee: number; breakEvenUsers: number; fmt: (n: number) => string;
}) {
  const t = useCopy(COPY);
  const c = t.src.roi.calc;
  const maxUsers = Math.max(users * 1.6, breakEvenUsers * 2, 40);
  const portalAt = (u: number) => fixedCost + fee * u;
  const maxCost = Math.max(maxUsers * licensePrice, portalAt(maxUsers) * 1.2, 1);
  const W = 560, H = 220, PAD_L = 8, PAD_B = 30, PAD_T = 30;
  const x = (u: number) => PAD_L + (u / maxUsers) * (W - PAD_L - 8);
  const y = (v: number) => H - PAD_B - (v / maxCost) * (H - PAD_B - PAD_T);
  const licEnd = { x: x(maxUsers), y: y(maxUsers * licensePrice) };
  const capY = y(fixedCost);
  const capEndY = y(portalAt(maxUsers));
  const crossX = breakEvenUsers > 0 && breakEvenUsers <= maxUsers ? x(breakEvenUsers) : null;
  const crossY = y(portalAt(breakEvenUsers));
  const meX = x(users);
  const meY = y(users * licensePrice);
  const saving = users * licensePrice > portalAt(users);
  const label = t.chartLabel(fmt(fixedCost), breakEvenUsers, users);
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
            <polygon className={p.cFill} points={`${crossX},${crossY} ${licEnd.x},${licEnd.y} ${licEnd.x},${capEndY}`} />
          )}
          <line className={p.cCap} x1={PAD_L} x2={W - 8} y1={capY} y2={capEndY} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <line className={p.cLic} x1={x(0)} y1={y(0)} x2={licEnd.x} y2={licEnd.y} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {crossX !== null && (
            <>
              <line className={p.cGuide} x1={crossX} x2={crossX} y1={PAD_T} y2={H - PAD_B} strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
              <circle className={p.cNode} cx={crossX} cy={crossY} r="5.5" strokeWidth="2" />
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
        <span><i className={p.swCap} aria-hidden="true" /> {t.roiX.beCapacity}</span>
      </figcaption>
    </figure>
  );
}

// ─────────── Simulador de capacidade ───────────
// Estima o SKU pelo uso: consulta no pico, atualização dos dados ao longo do dia e
// memória do maior modelo (mesma conta das propostas, premissas em SIZING). O botão
// leva o SKU e as pessoas para a calculadora de economia logo abaixo.
const HOURS = [8, 10, 12, 24];
const REFRESHES = [1, 2, 4, 8];
const WEIGHTS: RefreshWeight[] = ['light', 'medium', 'heavy'];
function Sizing({ onApply }: { onApply: (sku: string, people: number) => void }) {
  const t = useCopy(COPY);
  const lang = useLang();
  const z = t.sizing;
  const cfg = COUNTRY[SITE_COUNTRY as Country] ?? COUNTRY.BR;
  const region = REGIONS.find((r) => r.id === cfg.defaultRegion) ?? REGIONS[0];

  const [people, setPeople] = useState(cfg.defaultUsers);
  const [opensPerPerson, setOpens] = useState(3.5);
  const [hoursPerDay, setHours] = useState(10);
  const [models, setModels] = useState(20);
  const [refreshesPerDay, setRefreshes] = useState(4);
  const [weight, setWeight] = useState<RefreshWeight>('medium');
  const [largestModelGb, setLargest] = useState(1);
  const [directQuery, setDq] = useState(false);

  const res = useMemo(
    () => sizeCapacity({ people, opensPerPerson, hoursPerDay, models, refreshesPerDay, weight, largestModelGb, directQuery }),
    [people, opensPerPerson, hoursPerDay, models, refreshesPerDay, weight, largestModelGb, directQuery],
  );
  const locale = INTL_LOCALE[lang];
  const nf0 = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const money = (n: number) => `${cfg.currency} ${nf0.format(Math.round(n))}`;
  const rec = res.recommended;
  const cost = rec ? skuMonthlyCost(rec.id, region.id, cfg.fx) : null;
  const num = (v: string, min: number, max: number) => Math.max(min, Math.min(max, Number(v.replace(',', '.')) || 0));
  const pct = (v: number) => (v > 999 ? '>999%' : `${Math.round(v)}%`);
  const announce = useSettled(rec ? `${z.resultLabel}: ${rec.id}` : z.none);

  return (
    <section id="capacidade" className={s.band} aria-labelledby="capacidade-titulo">
      <div className={s.wrap}>
        <SectionHead id="capacidade-titulo" title={z.title}>{z.lead}</SectionHead>

        <div className={p.roiGrid}>
          <div className={p.panel} data-reveal>
            <h3 className={p.panelTitle}>{z.panelTitle}</h3>

            <div className={p.field}>
              <div className={p.fieldHead}>
                <label htmlFor="pf-sz-people" className={p.fieldLabel}>{z.people}</label>
                <output htmlFor="pf-sz-people" className={p.fieldValue}>{people}</output>
              </div>
              <input
                id="pf-sz-people" className={p.range} type="range" min={10} max={3000} step={10}
                value={people} onChange={(e) => setPeople(Number(e.target.value))} aria-valuetext={t.usersValue(people)}
              />
            </div>

            <div className={p.field}>
              <label htmlFor="pf-sz-opens" className={p.fieldLabel}>{z.opens}</label>
              <div className={p.money}>
                <input id="pf-sz-opens" type="number" min={0.5} max={50} step={0.5} inputMode="decimal" value={opensPerPerson}
                  aria-describedby="pf-sz-opens-hint" onChange={(e) => setOpens(num(e.target.value, 0.5, 50))} />
              </div>
              <p id="pf-sz-opens-hint" className={p.hint}>{z.opensHint} {tpl(z.opensDay, { n: nf0.format(res.opensPerDay) })}.</p>
            </div>

            <div className={p.field}>
              <span id="pf-sz-hours" className={p.fieldLabel}>{z.hours}</span>
              <div className={p.seg} role="group" aria-labelledby="pf-sz-hours">
                {HOURS.map((h) => (
                  <button key={h} type="button" className={p.segBtn} aria-pressed={hoursPerDay === h} onClick={() => setHours(h)}>
                    {tpl(z.hoursOpt, { h })}
                  </button>
                ))}
              </div>
              <p className={p.hint}>{z.hoursHint}</p>
            </div>

            <div className={p.field}>
              <label htmlFor="pf-sz-models" className={p.fieldLabel}>{z.models}</label>
              <div className={p.money}>
                <input id="pf-sz-models" type="number" min={0} max={2000} step={1} inputMode="numeric" value={models}
                  aria-describedby="pf-sz-models-hint" onChange={(e) => setModels(Math.round(num(e.target.value, 0, 2000)))} />
              </div>
              <p id="pf-sz-models-hint" className={p.hint}>{z.modelsHint}</p>
            </div>

            <div className={p.field}>
              <span id="pf-sz-ref" className={p.fieldLabel}>{z.refreshes}</span>
              <div className={p.seg} role="group" aria-labelledby="pf-sz-ref">
                {REFRESHES.map((n) => (
                  <button key={n} type="button" className={p.segBtn} aria-pressed={refreshesPerDay === n} onClick={() => setRefreshes(n)}>{n}×</button>
                ))}
              </div>
            </div>

            <div className={p.field}>
              <span id="pf-sz-weight" className={p.fieldLabel}>{z.weight}</span>
              <div className={p.seg} role="group" aria-labelledby="pf-sz-weight">
                {WEIGHTS.map((w) => (
                  <button key={w} type="button" className={p.segBtn} aria-pressed={weight === w} onClick={() => setWeight(w)}>{z.weights[w]}</button>
                ))}
              </div>
              <p className={p.hint}>{z.weightHints[weight]}</p>
            </div>

            <div className={p.field}>
              <label htmlFor="pf-sz-gb" className={p.fieldLabel}>{z.largest}</label>
              <div className={p.money}>
                <input id="pf-sz-gb" type="number" min={0.1} max={100} step={0.1} inputMode="decimal" value={largestModelGb}
                  aria-describedby="pf-sz-gb-hint" onChange={(e) => setLargest(num(e.target.value, 0.1, 100))} />
              </div>
              <p id="pf-sz-gb-hint" className={p.hint}>{z.largestHint}</p>
            </div>

            <div className={p.field}>
              <span id="pf-sz-dq" className={p.fieldLabel}>{z.dq}</span>
              <div className={p.seg} role="group" aria-labelledby="pf-sz-dq">
                <button type="button" className={p.segBtn} aria-pressed={!directQuery} onClick={() => setDq(false)}>{z.no}</button>
                <button type="button" className={p.segBtn} aria-pressed={directQuery} onClick={() => setDq(true)}>{z.yes}</button>
              </div>
            </div>
          </div>

          <div className={p.result} data-reveal style={delay(100)}>
            <p className={p.resultLabel}>{z.resultLabel}</p>
            <p key={rec?.id ?? 'none'} className={`${p.big} ${p.skuSwap}`} aria-hidden="true">{rec ? rec.id : z.none}</p>
            <p className={p.srOnly} aria-live="polite">{announce}</p>
            <p className={p.resultLine}>{rec ? z.drivers[res.driver] : z.noneNote}</p>
            {rec && res.minimum && (
              <p className={p.nextGoal}>{res.minimum.id === rec.id ? z.sameMin : tpl(z.minimum, { sku: res.minimum.id })}</p>
            )}

            <div className={p.skuRows} role="table" aria-label={z.resultLabel}>
              <div className={`${p.skuRow} ${p.skuHead}`} role="row">
                <span role="columnheader">{z.colSku}</span>
                <span role="columnheader">{z.colPeak}</span>
                <span role="columnheader">{z.colDay}</span>
                <span role="columnheader" className={p.skuMem}>{z.colMem}</span>
                <span role="columnheader" className={p.skuSt} />
              </div>
              {res.fits.map((f) => {
                const isRec = rec?.id === f.sku.id;
                const st = isRec ? 'rec' : f.comfortable ? 'over' : f.fits ? 'min' : 'no';
                const gb = SKU_LIMITS[f.sku.id].memoryGb;
                return (
                  <div key={f.sku.id} role="row" className={`${p.skuRow} ${isRec ? p.skuRowRec : ''}`}>
                    <strong role="cell">{f.sku.id}</strong>
                    {[f.peakPct, f.dailyPct].map((v, i) => (
                      <span key={i} role="cell" className={p.barCell}>
                        <em className={p.barLbl}>{i === 0 ? z.colPeak : z.colDay}</em>
                        <span className={`${p.bar} ${v > 100 ? p.barOver : v > SIZING.target * 100 ? p.barWarn : ''}`} aria-hidden="true">
                          <i style={{ width: `${Math.min(100, v)}%` }} />
                        </span>
                        <span>{pct(v)}</span>
                      </span>
                    ))}
                    <span role="cell" className={`${p.skuMem} ${f.memoryOk ? '' : p.memNo}`}>
                      {tpl(f.memoryOk ? z.memOk : z.memNo, { gb: nf1.format(gb) })}
                    </span>
                    <span role="cell" className={`${p.skuSt} ${p[`st_${st}`]}`}>{z.status[st]}</span>
                  </div>
                );
              })}
            </div>

            {rec && cost && (
              <dl className={p.rows}>
                <div className={p.row}><dt>{z.costReserved}</dt><dd>{tpl(z.perMonth, { v: money(cost.reserved) })}</dd></div>
                <div className={p.row}><dt>{z.costPayg}</dt><dd>{tpl(z.perMonth, { v: money(cost.payg) })}</dd></div>
              </dl>
            )}
            {rec && <p className={p.resultNote}>{tpl(z.costRegion, { region: region.label })}</p>}

            {rec && (
              <button type="button" className={`${s.btn} ${p.sizeApply}`} onClick={() => onApply(rec.id, people)}>
                {tpl(z.apply, { sku: rec.id })}
              </button>
            )}
          </div>
        </div>

        <div className={p.roiFoot}>
          <p>
            {tpl(z.premises, {
              pages: nf1.format(SIZING.pagesPerOpen), cu: SIZING.cuSecPerPage,
              light: nf0.format(SIZING.refreshCuSec.light), medium: nf0.format(SIZING.refreshCuSec.medium), heavy: nf0.format(SIZING.refreshCuSec.heavy),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────── Calculadora de ROI ───────────
// Mesma conta das propostas: Pro para todos contra mensalidade do Portal por usuário +
// contas Pro de quem publica + capacidade. `preset` vem do simulador de capacidade.
type Preset = { sku: string; users: number; n: number };
function Roi({ preset }: { preset: Preset | null }) {
  const t = useCopy(COPY);
  const lang = useLang();
  const r = t.src.roi;
  const c = r.calc;
  const { openTypebot } = useTypebot();
  const cfg = COUNTRY[SITE_COUNTRY as Country] ?? COUNTRY.BR;

  const x = t.roiX;
  const [users, setUsers] = useState(preset?.users ?? cfg.defaultUsers);
  const [publishers, setPublishers] = useState(2);
  const [licenseKind, setKind] = useState<'pro' | 'ppu'>('pro');
  const [licensePrice, setLic] = useState(cfg.proPrice);
  const [regionId, setRegion] = useState(cfg.defaultRegion);
  const [skuId, setSku] = useState(preset?.sku ?? 'F8');
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
  const money2 = (n: number) => `${cfg.currency} ${dec2(n)}`;
  const fee = cfg.portalFee;

  const input: SimInput = {
    users, licensePrice, skuId, regionId, billing, scheduleId, fx: cfg.fx,
    portalFee: fee ?? 0, publishers, publisherPrice: cfg.proPrice,
  };
  const sim = useMemo(() => simulate(input), [users, licensePrice, skuId, regionId, billing, scheduleId, cfg.fx, publishers]); // eslint-disable-line react-hooks/exhaustive-deps
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
            {preset && <p className={p.hint}>{x.fromSizing}</p>}

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
              <div className={p.fieldHead}>
                <label htmlFor="pf-pub" className={p.fieldLabel}>{x.publishers}</label>
              </div>
              <div className={p.money}>
                <input
                  id="pf-pub" type="number" min={0} max={500} step={1} inputMode="numeric" value={publishers}
                  aria-describedby="pf-pub-hint"
                  onChange={(e) => setPublishers(Math.max(0, Math.min(500, Math.round(Number(e.target.value) || 0))))}
                />
              </div>
              <p id="pf-pub-hint" className={p.hint}>{x.publishersHint}</p>
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
                users={users} licensePrice={licensePrice} fixedCost={sim.fixedCost} fee={fee ?? 0}
                breakEvenUsers={sim.breakEvenUsers} fmt={fmt}
              />
            </div>

            <dl className={p.rows}>
              <div className={p.row}>
                <dt>{tpl(c.rowToday, { n: users, price: money2(licensePrice) })}</dt>
                <dd>{fmt(sim.licenseCost)}</dd>
              </div>
              <div className={p.row}>
                <dt>{fee != null ? tpl(x.rowFee, { n: users, fee: money2(fee) }) : x.rowFeeTbd}</dt>
                <dd>{fee != null ? fmt(sim.portalCost) : x.feeTbd}</dd>
              </div>
              <div className={p.row}>
                <dt>{tpl(x.rowPublishers, { n: publishers, price: money2(cfg.proPrice) })}</dt>
                <dd>{fmt(sim.publisherCost)}</dd>
              </div>
              <div className={p.row}>
                <dt>{tpl(x.rowCapacity, { sku: sku.id, region: region.label })}</dt>
                <dd>{fmt(sim.capacityCost)}</dd>
              </div>
              <div className={`${p.row} ${p.rowSub}`}>
                <dt>{x.rowTotal}</dt>
                <dd>{fmt(sim.totalPortal)}</dd>
              </div>
              <div className={`${p.row} ${p.rowTotal}`}>
                <dt>{positive ? c.youSave : c.difference}</dt>
                <dd className={positive ? '' : p.bigNeg}>{signed(sim.savings)}</dd>
              </div>
            </dl>
            <p className={p.resultNote}>
              {fee != null
                ? `${tpl(x.breakEvenNote, { n: sim.breakEvenUsers, fee: money2(fee), price: money2(licensePrice) })} ${tpl(x.feeNote, { fee: money2(fee) })}`
                : `${tpl(c.breakEvenNote, { n: sim.breakEvenUsers })} ${x.feeTbdNote}`}
            </p>
          </div>
        </div>

        {positive && (
          <ul className={p.eqs}>
            {fee != null && <li><strong>{money2(fee)}</strong><span>{tpl(x.eqUserFee, { price: money2(licensePrice) })}</span></li>}
            <li><strong>{proYear}</strong><span>{tpl(c.eqLicenses, { kind: licenseKind === 'pro' ? 'Pro' : 'PPU' })}</span></li>
            <li><strong>{tpl(c.eqMonths, { n: capMonths })}</strong><span>{tpl(c.eqCapacity, { sku: sku.id })}</span></li>
          </ul>
        )}

        <div className={p.roiFoot}>
          <p>
            {tpl(c.footBase, { x: dec2(USD_PER_CU_HOUR) })}
            {region.mult !== 1 && tpl(c.footRegionExtra, { p: Math.round((region.mult - 1) * 100), region: region.label })},
            {billing === 'reserved' ? c.footReserved : tpl(c.footPayg, { hours: schedHours })},
            {tpl(c.footConv, { fx: fxLabel })}{billing === 'payg' ? `${x.paygNote} ` : ''}{r.note}
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

// O Bookings leva alguns segundos para desenhar o calendário, e o navegador só desenha
// o iframe quando ele aparece na tela. Até lá fica um esqueleto com a mesma forma
// (título, mês, horários) em vez da moldura branca: ele sai 3,5s depois de o iframe ter
// carregado E estar visível. Se a agenda visível passar de 15s sem abrir, o aviso oferece
// a nova aba. O iframe entra só depois da hidratação para o onLoad nunca escapar.
function Agenda() {
  const t = useCopy(COPY);
  const sc = t.src.schedule;
  const [src, setSrc] = useState<string>();
  const [state, setState] = useState<'loading' | 'slow' | 'ready'>('loading');
  const [loaded, setLoaded] = useState(false);
  const [seen, setSeen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setSrc(BOOKING_URL));
    const el = frameRef.current;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.2 });
    if (el) io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  useEffect(() => {
    if (!seen) return;
    const slow = setTimeout(() => setState((v) => (v === 'loading' ? 'slow' : v)), 15000);
    return () => clearTimeout(slow);
  }, [seen]);
  useEffect(() => {
    if (!seen || !loaded) return;
    const ready = setTimeout(() => setState('ready'), 3500);
    return () => clearTimeout(ready);
  }, [seen, loaded]);
  const newTab = <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{sc.fallbackLink}</a>;

  return (
    <section id="agenda" className={s.band} aria-labelledby="agenda-titulo">
      <div className={`${s.wrap} ${p.agendaGrid}`}>
        <div className={p.agendaHead} data-reveal>
          <h2 id="agenda-titulo" className={s.h2}>{sc.title}</h2>
          <p className={s.lead}>{sc.subtitle}</p>
          <dl className={p.agendaFacts}>
            {t.agendaFacts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <p className={p.agendaAlt}>{sc.fallback} {newTab}</p>
        </div>
        <div ref={frameRef} className={p.agendaFrame} data-reveal data-state={state} style={delay(100)}>
          <div className={p.agendaSkel} aria-hidden={state === 'ready'}>
            <span className={p.skTitle} />
            <span className={p.skSub} />
            <span className={p.skBox} />
            <div className={p.skGrid}>{Array.from({ length: 35 }, (_, i) => <i key={i} />)}</div>
            <div className={p.skSlots}>{Array.from({ length: 5 }, (_, i) => <i key={i} />)}</div>
            <p className={p.skMsg} role="status">
              {state === 'slow' ? <>{t.agendaSlow} {newTab}</> : sc.loading}
            </p>
          </div>
          {/* Agenda pública do Microsoft Bookings: os agendamentos caem no Outlook do time. */}
          {src && <iframe src={src} title={sc.title} onLoad={() => setLoaded(true)} />}
        </div>
      </div>
    </section>
  );
}

// ─────────── Página ───────────
export function PortalFabricClean({ videoUrl }: { videoUrl?: string | null }) {
  const { openTypebot } = useTypebot();
  const t = useCopy(COPY);
  const copy = t.src;
  const h = copy.hero;
  const [preset, setPreset] = useState<Preset | null>(null);

  return (
    <CleanShell current="solutions">
      <section className={`${s.pageHero} ${p.hero}`} aria-labelledby="page-titulo">
        <div className={`${s.wrap} ${p.heroGrid}`}>
          <div className={p.heroText}>
            <h1 id="page-titulo" className={`${s.display} ${s.displayLeft} ${p.heroTitle}`}>{h.title}</h1>
            <p className={`${s.lead} ${p.heroLead}`}>{t.heroLead}</p>
            <div className={`${s.actions} ${p.heroActions}`}>
              <button type="button" className={s.btn} onClick={openBooking}>{h.ctaPrimary}</button>
              <a href="#roi" className={s.link}>{h.ctaSecondary}</a>
            </div>
          </div>
          <div className={p.heroScene}>
            <Portal4D labels={t.scene} />
          </div>
        </div>
      </section>

      <PageNav />

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
          <div className={p.stepsWrap}>
          <span className={p.flowLine} data-reveal aria-hidden="true" />
          <ol className={`${s.steps} ${p.steps4}`}>
            {copy.how.steps.map((st, i) => (
              <li key={st.title} className={s.step} data-reveal style={delay(i * 110)}>
                <span className={s.stepNum} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.h3}>{st.title}</h3>
                <p>{st.desc}</p>
              </li>
            ))}
          </ol>
          </div>
          <p className={p.archNote} data-reveal>
            {t.archNote(copy.arch.title)}
          </p>
        </div>
      </section>

      <Features />

      <Sizing onApply={(sku, people) => {
        setPreset((v) => ({ sku, users: people, n: (v?.n ?? 0) + 1 }));
        document.getElementById('roi')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }} />

      {/* key: o simulador de capacidade remonta a calculadora com o SKU e os usuários escolhidos */}
      <Roi key={preset?.n ?? 0} preset={preset} />

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
                <StatValue value={st.value} />
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

      <Agenda />

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
