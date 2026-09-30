'use client';

// "Do caos à decisão": cena 3D em canvas que conta o que a DriveData faz.
// Caos: os blocos de dados ficam em três silos (ERP, CRM, planilhas), cada um
// com o seu número para a mesma receita. Conectado: os mesmos blocos viram um
// gráfico de barras 3D, mês a mês, com um número só. Previsão: a quarta
// dimensão é o tempo; a régua estende os próximos meses com linha de tendência
// e faixa de incerteza. Arrastar gira a cena.
// Toca sozinha em ciclo até a pessoa interagir. Pausa fora da tela e com a aba
// oculta; com movimento reduzido mostra o estado final de cada etapa, parado.
import { useEffect, useMemo, useRef, useState } from 'react';
import { INTL_LOCALE, useLang, type Copy } from './i18n';
import { useSiteTheme } from './theme';
import s from './clean.module.css';

type Stage = 'caos' | 'conectado' | 'previsao';
const STAGE_IDS: Stage[] = ['caos', 'conectado', 'previsao'];

const PT = {
  stages: {
    caos: { label: 'Caos', text: 'Dados espalhados em ERP, CRM e planilhas que não conversam. Cada área tem o seu número.' },
    conectado: { label: 'Conectado', text: 'Tudo numa fonte única da verdade, organizada mês a mês. O mesmo número para todo mundo.' },
    previsao: { label: 'Previsão', text: 'A quarta dimensão é o tempo. Mova a régua e antecipe os próximos meses.' },
  },
  sheets: 'Planilhas',
  forecast: 'Previsão',
  today: 'Hoje',
  stagesLabel: 'Etapas',
  legendLabel: 'Origem dos dados',
  sceneLabel: (stage: string, text: string) => `Cena ilustrativa, etapa ${stage}: ${text}`,
  horizon: 'Horizonte',
  months: (n: number) => `${n} ${n === 1 ? 'mês' : 'meses'}`,
  ahead: (n: number) => `${n} ${n === 1 ? 'mês' : 'meses'} à frente`,
  oneNumber: (month: string) => `Receita de ${month}, um número só`,
  forecastFor: (month: string) => `Previsão para ${month}`,
};
const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    stages: {
      caos: { label: 'Chaos', text: 'Data scattered across ERP, CRM and spreadsheets that do not talk to each other. Each area has its own number.' },
      conectado: { label: 'Connected', text: 'Everything in a single source of truth, organized month by month. The same number for everyone.' },
      previsao: { label: 'Forecast', text: 'The fourth dimension is time. Move the slider and anticipate the coming months.' },
    },
    sheets: 'Spreadsheets',
    forecast: 'Forecast',
    today: 'Today',
    stagesLabel: 'Stages',
    legendLabel: 'Data sources',
    sceneLabel: (stage, text) => `Illustrative scene, ${stage} stage: ${text}`,
    horizon: 'Horizon',
    months: (n) => `${n} ${n === 1 ? 'month' : 'months'}`,
    ahead: (n) => `${n} ${n === 1 ? 'month' : 'months'} ahead`,
    oneNumber: (month) => `${month} revenue, one number`,
    forecastFor: (month) => `Forecast for ${month}`,
  },
  es: {
    stages: {
      caos: { label: 'Caos', text: 'Datos dispersos en ERP, CRM y hojas de cálculo que no se comunican. Cada área tiene su propio número.' },
      conectado: { label: 'Conectado', text: 'Todo en una única fuente de verdad, organizada mes a mes. El mismo número para todos.' },
      previsao: { label: 'Previsión', text: 'La cuarta dimensión es el tiempo. Mueva la regla y anticipe los próximos meses.' },
    },
    sheets: 'Hojas de cálculo',
    forecast: 'Previsión',
    today: 'Hoy',
    stagesLabel: 'Etapas',
    legendLabel: 'Origen de los datos',
    sceneLabel: (stage, text) => `Escena ilustrativa, etapa ${stage}: ${text}`,
    horizon: 'Horizonte',
    months: (n) => `${n} ${n === 1 ? 'mes' : 'meses'}`,
    ahead: (n) => `${n} ${n === 1 ? 'mes' : 'meses'} adelante`,
    oneNumber: (month) => `Ingresos de ${month}, un solo número`,
    forecastFor: (month) => `Previsión para ${month}`,
  },
  fr: {
    stages: {
      caos: { label: 'Chaos', text: 'Des données éparpillées entre ERP, CRM et tableurs qui ne se parlent pas. Chaque service a son propre chiffre.' },
      conectado: { label: 'Connecté', text: 'Tout dans une seule source de vérité, organisée mois par mois. Le même chiffre pour tout le monde.' },
      previsao: { label: 'Prévision', text: 'La quatrième dimension, c’est le temps. Déplacez le curseur et anticipez les prochains mois.' },
    },
    sheets: 'Tableurs',
    forecast: 'Prévision',
    today: 'Aujourd’hui',
    stagesLabel: 'Étapes',
    legendLabel: 'Sources des données',
    sceneLabel: (stage, text) => `Scène illustrative, étape ${stage} : ${text}`,
    horizon: 'Horizon',
    months: (n) => `${n} mois`,
    ahead: (n) => `${n} mois à venir`,
    oneNumber: (month) => `Chiffre d’affaires de ${month}, un seul chiffre`,
    forecastFor: (month) => `Prévision pour ${month}`,
  },
};

// Cores do canvas por tema. No escuro o ERP (navy) sumiria no fundo, então vira
// um cinza claro; as linhas e os rótulos seguem o texto do tema.
const PALETTE = {
  light: {
    src: [[10, 22, 40], [10, 114, 196], [21, 128, 61]],
    axis: 'rgba(10,22,40,0.22)',
    floor: 'rgba(10,22,40,0.045)',
    label: 'rgba(91,103,120,0.95)',
    future: '#15803d',
    futureFill: 'rgba(84,218,137,0.2)',
    band: 'rgba(84,218,137,0.16)',
    trend: 'rgba(10,22,40,0.55)',
    today: 'rgba(10,22,40,0.45)',
    todayText: '#0a1628',
  },
  dark: {
    src: [[203, 213, 225], [90, 169, 255], [84, 218, 137]],
    axis: 'rgba(234,240,251,0.2)',
    floor: 'rgba(234,240,251,0.04)',
    label: 'rgba(160,172,190,0.95)',
    future: '#54da89',
    futureFill: 'rgba(84,218,137,0.14)',
    band: 'rgba(84,218,137,0.12)',
    trend: 'rgba(234,240,251,0.6)',
    today: 'rgba(234,240,251,0.45)',
    todayText: '#e8eef8',
  },
};

/** Meses abreviados no idioma atual (jan., Jan, janv. viram Jan, Janv). */
function monthNames(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, m) => {
    const v = fmt.format(new Date(Date.UTC(2026, m, 15))).replace(/\.$/, '');
    return v.charAt(0).toUpperCase() + v.slice(1);
  });
}

const HIST = 12, FUT = 6, GAP = 0.8, UNIT = 0.4, FLOOR = -2.7;
// valor ilustrativo de cada bloco (em milhões) e a leitura de cada silo para
// dezembro: três números diferentes para a mesma receita
const BLOCK_VALUE = 0.62;
const SILO_READING = [4.1, 4.8, 3.7];
// centro de cada silo no caos: ERP à esquerda, CRM ao fundo, planilhas à direita
const SILO = [[-4.3, 0.1, -0.4], [0, 0.9, -1.2], [4.3, -0.1, -0.4]] as const;

const total = (m: number) => Math.round(6 + 2.6 * Math.sin((m / 12) * Math.PI * 2 - 1.2) + m * 0.28);
const topOf = (m: number) => FLOOR + total(m) * UNIT;
const xOf = (m: number) => (m - (HIST + FUT - 1) / 2) * GAP;

// gerador determinístico: a cena é sempre a mesma (cenário ilustrativo)
function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

interface Block { src: number; month: number; future: boolean; bar: [number, number, number]; chaos: [number, number, number]; phase: number; }

function buildBlocks(): Block[] {
  const r = rng(7), out: Block[] = [];
  for (let m = 0; m < HIST + FUT; m++) {
    const n = total(m), future = m >= HIST;
    for (let k = 0; k < n; k++) {
      const src = k < n * 0.45 ? 0 : k < n * 0.75 ? 1 : 2;
      const th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1), rad = 0.4 + Math.cbrt(r()) * 1.15;
      const c = SILO[src];
      out.push({
        src, month: m, future, bar: [xOf(m), FLOOR + k * UNIT + UNIT / 2, 0],
        chaos: [c[0] + rad * Math.sin(ph) * Math.cos(th), c[1] + rad * Math.cos(ph) * 0.9, c[2] + rad * Math.sin(ph) * Math.sin(th)],
        phase: r() * Math.PI * 2,
      });
    }
  }
  return out;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const mix = (c: number[], to: number, t: number) => `rgb(${c.map((v) => Math.round(v + (to - v) * t)).join(',')})`;

// faces do cubo: o vértice i tem x pelo bit 0, y pelo bit 1 e z pelo bit 2
const FACES: { n: [number, number, number]; v: number[]; shade: 'top' | 'side' | 'front' }[] = [
  { n: [0, 1, 0], v: [2, 3, 7, 6], shade: 'top' },
  { n: [0, -1, 0], v: [0, 1, 5, 4], shade: 'side' },
  { n: [1, 0, 0], v: [1, 3, 7, 5], shade: 'side' },
  { n: [-1, 0, 0], v: [0, 2, 6, 4], shade: 'side' },
  { n: [0, 0, 1], v: [4, 5, 7, 6], shade: 'front' },
  { n: [0, 0, -1], v: [0, 1, 3, 2], shade: 'front' },
];

export function DataScene() {
  const lang = useLang();
  const t = COPY[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const months = useMemo(() => monthNames(INTL_LOCALE[lang]), [lang]);
  const money = useMemo(() => new Intl.NumberFormat(INTL_LOCALE[lang], { notation: 'compact', maximumFractionDigits: 1 }), [lang]);
  const { theme } = useSiteTheme();
  const pal = PALETTE[theme];
  const palRef = useRef(pal);
  palRef.current = pal;
  // textos que o canvas desenha: lidos a cada quadro, então seguem a troca de idioma
  const labels = useRef({ months, today: t.today, sources: ['ERP', 'CRM', t.sheets], money });
  labels.current = { months, today: t.today, sources: ['ERP', 'CRM', t.sheets], money };
  const [stage, setStage] = useState<Stage>('caos');
  const [horizon, setHorizon] = useState(3);
  const [touched, setTouched] = useState(false);
  const live = useRef({ stage, horizon });
  live.current = { stage, horizon };

  // ciclo automático até a pessoa mexer
  useEffect(() => {
    if (touched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setStage((cur) => STAGE_IDS[(STAGE_IDS.indexOf(cur) + 1) % STAGE_IDS.length]);
    }, 4600);
    return () => window.clearInterval(id);
  }, [touched]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blocks = buildBlocks();
    // progresso animado de cada estado (0..1), perseguindo o alvo
    let toBar = 0, showFuture = 0, futureCount = 0;
    let yaw = -0.18, targetYaw = -0.18; const pitch = 0.26;
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now(), clock = 0;
    let display = 'Sora, ui-sans-serif, system-ui, sans-serif';
    // enquadramento: a câmera centra e dá zoom só no que está à vista
    let camX = 0, span = 14.5;
    let drag: { x: number; yaw: number } | null = null;
    let userYaw = false; // depois que a pessoa gira, a cena respeita o ângulo dela
    const VIEW = -0.18; // ângulo de leitura do gráfico (quase de frente, com profundidade)

    const size = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      display = getComputedStyle(canvas).getPropertyValue('--display').trim() || display;
    };

    // câmera em z = 9 olhando para o centro; gira em y (yaw) e inclina em x (pitch)
    const rot = (x: number, y: number, z: number): [number, number, number] => {
      x -= camX;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
      return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
    };
    const toScreen = (c: [number, number, number]) => {
      // escala pelo quadro: o que está à vista (span de largura, ~7 de altura) sempre cabe
      const k = 9 / (9 - c[2]), sc = Math.min(w / span, h / 7.4);
      return { x: w / 2 + c[0] * k * sc, y: h * 0.55 - (c[1] - 0.15) * k * sc };
    };
    const project = (x: number, y: number, z: number) => toScreen(rot(x, y, z));

    const poly = (pts: { x: number; y: number }[]) => {
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
    };

    // ponto da previsão em progresso: do último mês real até o mês i do futuro
    const futurePoint = (i: number, on: number, lift: number) => {
      const m = HIST + i;
      return [xOf(HIST - 1) + (xOf(m) - xOf(HIST - 1)) * on, topOf(HIST - 1) + (topOf(m) - topOf(HIST - 1)) * on + lift] as const;
    };

    const drawChart = (b: number) => {
      const p = palRef.current;
      ctx.save();
      ctx.globalAlpha = b;
      // chão: placa fina sob as barras, dá o apoio do 3D
      const x0 = xOf(0) - GAP * 0.7, x1 = xOf(HIST - 1 + futureCount * showFuture) + GAP * 0.7, zd = GAP * 0.62;
      poly([project(x0, FLOOR, -zd), project(x1, FLOOR, -zd), project(x1, FLOOR, zd), project(x0, FLOOR, zd)]);
      ctx.fillStyle = p.floor; ctx.fill();
      const a = project(x0, FLOOR, zd), c = project(x1, FLOOR, zd);
      ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
      // meses: rótulo só onde cabe, pulando o que ficaria colado no anterior
      ctx.font = '600 11px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
      let lastX = -Infinity;
      for (let m = 0; m < HIST + FUT; m++) {
        if (m >= HIST && (showFuture < 0.5 || m - HIST >= Math.round(futureCount))) continue;
        const q = project(xOf(m), FLOOR, zd);
        if (q.x - lastX < 30) continue;
        lastX = q.x;
        ctx.fillStyle = m < HIST ? p.label : p.future;
        ctx.fillText(labels.current.months[m % 12], q.x, q.y + 18);
      }
      if (showFuture > 0.02) {
        // faixa de incerteza: abre a partir de hoje conforme a previsão avança
        const start = project(xOf(HIST - 1), topOf(HIST - 1), 0);
        const up = [start], down = [start];
        for (let i = 0; i < FUT; i++) {
          const on = clamp01(futureCount - i);
          if (on <= 0) break;
          const spread = (0.25 + i * 0.2) * on;
          const [x, y] = futurePoint(i, on, 0);
          up.push(project(x, y + spread, 0)); down.push(project(x, y - spread, 0));
        }
        ctx.globalAlpha = b * showFuture;
        if (up.length > 1) { poly([...up, ...down.reverse()]); ctx.fillStyle = p.band; ctx.fill(); }
        // linha do "hoje"
        const tx = (xOf(HIST - 1) + xOf(HIST)) / 2;
        const bot = project(tx, FLOOR, 0), top = project(tx, FLOOR + 14.5 * UNIT, 0);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = p.today;
        ctx.beginPath(); ctx.moveTo(bot.x, bot.y); ctx.lineTo(top.x, top.y); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = p.todayText; ctx.font = '700 12px Inter, system-ui, sans-serif';
        ctx.fillText(labels.current.today, top.x, top.y - 8);
      }
      ctx.restore();
    };

    // tendência: sólida no histórico, tracejada verde no futuro (desenhada sobre as barras)
    const drawTrend = (b: number) => {
      if (showFuture < 0.02) return;
      const p = palRef.current;
      ctx.save();
      ctx.globalAlpha = b * showFuture;
      ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = p.trend; ctx.beginPath();
      for (let m = 0; m < HIST; m++) {
        const q = project(xOf(m), topOf(m) + 0.12, 0);
        if (m) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y);
      }
      ctx.stroke();
      ctx.strokeStyle = p.future; ctx.setLineDash([5, 5]); ctx.beginPath();
      let end = project(xOf(HIST - 1), topOf(HIST - 1) + 0.12, 0);
      ctx.moveTo(end.x, end.y);
      for (let i = 0; i < FUT; i++) {
        const on = clamp01(futureCount - i);
        if (on <= 0) break;
        const [x, y] = futurePoint(i, on, 0.12);
        end = project(x, y, 0);
        ctx.lineTo(end.x, end.y);
      }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = p.future; ctx.beginPath(); ctx.arc(end.x, end.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    // silos do caos: nome da origem e o número que cada um enxerga
    const drawSilos = (b: number) => {
      const alpha = clamp01(1 - b * 1.6);
      if (alpha <= 0.01) return;
      const p = palRef.current;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.globalAlpha = alpha;
      SILO.forEach((c, i) => {
        const q = project(c[0], c[1] + 1.95, c[2]);
        ctx.fillStyle = p.label; ctx.font = '600 12px Inter, system-ui, sans-serif';
        ctx.fillText(labels.current.sources[i], q.x, q.y - 28);
        ctx.fillStyle = mix(p.src[i], 0, 0);
        ctx.font = `800 22px ${display}`;
        ctx.fillText(labels.current.money.format(SILO_READING[i] * 1e6), q.x, q.y - 6);
      });
      ctx.restore();
    };

    const drawBlocks = (b: number) => {
      const p = palRef.current;
      const cube = UNIT * 0.36;
      const items: { bl: Block; x: number; y: number; z: number; hx: number; hz: number; alpha: number; c: [number, number, number] }[] = [];
      for (const bl of blocks) {
        let alpha = 1;
        if (bl.future) {
          alpha = showFuture * clamp01(futureCount - (bl.month - HIST));
          if (alpha <= 0.01) continue;
        }
        const wob = (1 - b) * 0.16;
        const cx = bl.chaos[0] + Math.sin(clock * 0.9 + bl.phase) * wob;
        const cy = bl.chaos[1] + Math.cos(clock * 0.7 + bl.phase) * wob;
        const cz = bl.chaos[2] + Math.sin(clock * 0.5 + bl.phase * 2) * wob;
        // cada bloco chega com um pequeno atraso próprio (efeito de "encaixe")
        const own = ease(clamp01(toBar * 1.35 - (bl.phase / (Math.PI * 2)) * 0.35));
        const x = cx + (bl.bar[0] - cx) * own, y = cy + (bl.bar[1] - cy) * own, z = cz + (bl.bar[2] - cz) * own;
        // no caos é um cubinho; encaixado, alarga até virar segmento de barra
        items.push({ bl, x, y, z, hx: cube + (GAP * 0.33 - cube) * own, hz: cube + (GAP * 0.3 - cube) * own, alpha, c: rot(x, y, z) });
      }
      items.sort((a, c) => a.c[2] - c.c[2]);
      const normals = FACES.map((f) => rot(f.n[0], f.n[1], f.n[2]));
      const hy = UNIT * 0.44;
      for (const it of items) {
        const verts = Array.from({ length: 8 }, (_, i) => project(
          it.x + (i & 1 ? it.hx : -it.hx), it.y + (i & 2 ? hy : -hy), it.z + (i & 4 ? it.hz : -it.hz)));
        ctx.globalAlpha = it.alpha * Math.max(0.6, Math.min(1, 0.8 + it.c[2] * 0.05));
        const base = p.src[it.bl.src];
        FACES.forEach((f, fi) => {
          // só as faces voltadas para a câmera (em z = 9)
          const n = normals[fi];
          if (-n[0] * it.c[0] - n[1] * it.c[1] + n[2] * (9 - it.c[2]) <= 0) return;
          poly(f.v.map((vi) => verts[vi]));
          if (it.bl.future) {
            ctx.fillStyle = p.futureFill; ctx.fill();
            ctx.strokeStyle = p.future; ctx.lineWidth = 1; ctx.stroke();
          } else {
            ctx.fillStyle = f.shade === 'top' ? mix(base, 255, 0.3) : f.shade === 'side' ? mix(base, 0, 0.25) : mix(base, 0, 0);
            ctx.fill();
          }
        });
      }
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const b = ease(toBar);
      // no caos cabem os três silos; no gráfico, só os meses visíveis (o futuro entra com a régua)
      const shown = HIST + futureCount * showFuture;
      camX = b * (xOf(0) + xOf(shown - 1)) / 2;
      span = 14.5 + (shown * GAP + 3.2 - 14.5) * b;
      if (b > 0.05) drawChart(b);
      drawBlocks(b);
      if (b > 0.05) drawTrend(b);
      drawSilos(b);
    };

    const step = (dt: number) => {
      const { stage: st, horizon: hz } = live.current;
      const targetBar = st === 'caos' ? 0 : 1;
      const targetFut = st === 'previsao' ? 1 : 0;
      const targetCount = st === 'previsao' ? hz : 0;
      toBar += (targetBar - toBar) * Math.min(1, dt * 2.2);
      showFuture += (targetFut - showFuture) * Math.min(1, dt * 3);
      futureCount += (targetCount - futureCount) * Math.min(1, dt * 4);
      if (!drag && !userYaw) {
        // no caos a cena balança devagar, sem virar os silos de costas;
        // organizada, volta ao ângulo de leitura com um respiro leve
        const goal = st === 'caos' ? Math.sin(clock * 0.35) * 0.22 : VIEW + Math.sin(clock * 0.4) * 0.07;
        targetYaw += (goal - targetYaw) * Math.min(1, dt * 1.5);
      }
      yaw += (targetYaw - yaw) * Math.min(1, dt * 6);
      clock += dt;
    };

    const loop = (now: number) => {
      const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;
      step(dt); draw();
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    const onDown = (e: PointerEvent) => { drag = { x: e.clientX, yaw: targetYaw }; userYaw = true; canvas.setPointerCapture(e.pointerId); setTouched(true); };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      targetYaw = drag.yaw + (e.clientX - drag.x) * 0.01;
      if (reduce) { yaw = targetYaw; draw(); }
    };
    const onUp = () => { drag = null; };

    if (reduce) { toBar = 1; }
    size(); draw();
    const ro = new ResizeObserver(() => { size(); draw(); }); ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); }, { threshold: 0.05 });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    // movimento reduzido: sem laço; redesenha o estado final quando algo muda
    (canvas as HTMLCanvasElement & { __snap?: () => void }).__snap = () => {
      const { stage: st, horizon: hz } = live.current;
      toBar = st === 'caos' ? 0 : 1; showFuture = st === 'previsao' ? 1 : 0; futureCount = st === 'previsao' ? hz : 0;
      draw();
    };
    start();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      (canvasRef.current as (HTMLCanvasElement & { __snap?: () => void }) | null)?.__snap?.();
    }
  }, [stage, horizon, lang, theme]);

  const current = t.stages[stage];
  const sources = ['ERP', 'CRM', t.sheets];
  const pick = (id: Stage) => { setTouched(true); setStage(id); };
  // leitura em destaque: um número só no conectado, o valor previsto na previsão
  const readMonth = stage === 'previsao' ? HIST - 1 + horizon : HIST - 1;
  const readout = stage === 'caos' ? null : {
    label: stage === 'previsao' ? t.forecastFor(months[readMonth % 12]) : t.oneNumber(months[readMonth % 12]),
    value: money.format(total(readMonth) * BLOCK_VALUE * 1e6),
  };

  return (
    <div className={s.scene}>
      <div className={s.sceneTop}>
        <div className={s.stageTabs} role="group" aria-label={t.stagesLabel}>
          {STAGE_IDS.map((id) => (
            <button key={id} type="button" aria-pressed={stage === id} onClick={() => pick(id)}>{t.stages[id].label}</button>
          ))}
        </div>
        <ul className={s.sceneLegend} aria-label={t.legendLabel}>
          {sources.map((name, i) => (
            <li key={i}><i style={{ background: `rgb(${pal.src[i].join(',')})` }} />{name}</li>
          ))}
          <li className={stage === 'previsao' ? '' : s.legendOff}><i className={s.legendFuture} />{t.forecast}</li>
        </ul>
      </div>
      <div className={s.sceneStage}>
        <canvas ref={canvasRef} className={s.sceneCanvas} role="img"
          aria-label={t.sceneLabel(current.label, current.text)} />
        <p className={`${s.sceneReadout} ${readout ? '' : s.sceneReadoutOff} ${stage === 'previsao' ? s.sceneReadoutFuture : ''}`} aria-hidden={!readout}>
          <span>{readout?.label ?? ' '}</span>
          <strong>{readout?.value ?? ' '}</strong>
        </p>
      </div>
      <div className={s.sceneFoot}>
        <p className={s.sceneText} aria-live="polite">{current.text}</p>
        <label className={`${s.timeControl} ${stage === 'previsao' ? '' : s.timeDim}`}>
          <span className={s.timeLabel}>{t.horizon} <strong>+{t.months(horizon)}</strong></span>
          <input type="range" min={1} max={FUT} value={horizon}
            style={{ ['--pct' as string]: `${((horizon - 1) / (FUT - 1)) * 100}%` }}
            onChange={(e) => { setTouched(true); setStage('previsao'); setHorizon(Number(e.target.value)); }}
            aria-valuetext={t.ahead(horizon)} />
        </label>
      </div>
    </div>
  );
}
