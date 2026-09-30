'use client';

// "Do caos à decisão": cena 3D em canvas que conta o que a DriveData faz.
// Caos: blocos de dados soltos (ERP, CRM, planilhas). Conectado: os mesmos blocos
// viram um gráfico de barras 3D, mês a mês. Previsão: a quarta dimensão é o
// tempo; a régua estende os próximos meses. Arrastar gira a cena.
// Toca sozinha em ciclo até a pessoa interagir. Pausa fora da tela e com a aba
// oculta; com movimento reduzido mostra o estado "Conectado" parado.
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
  },
};

// Cores do canvas por tema. No escuro o ERP (navy) sumiria no fundo, então vira
// um cinza claro; as linhas e os rótulos seguem o texto do tema.
const PALETTE = {
  light: {
    src: [[10, 22, 40], [10, 114, 196], [21, 128, 61]],
    axis: 'rgba(10,22,40,0.25)',
    label: 'rgba(91,103,120,0.9)',
    future: '#15803d',
    futureFill: 'rgba(84,218,137,0.22)',
    today: 'rgba(10,22,40,0.5)',
    todayText: '#0a1628',
  },
  dark: {
    src: [[203, 213, 225], [90, 169, 255], [84, 218, 137]],
    axis: 'rgba(234,240,251,0.22)',
    label: 'rgba(160,172,190,0.95)',
    future: '#54da89',
    futureFill: 'rgba(84,218,137,0.16)',
    today: 'rgba(234,240,251,0.5)',
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

const HIST = 12, FUT = 6, GAP = 0.78, UNIT = 0.34;

// gerador determinístico: a cena é sempre a mesma (cenário ilustrativo)
function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

interface Block { src: number; month: number; future: boolean; bar: [number, number, number]; chaos: [number, number, number]; phase: number; }

function buildBlocks(): Block[] {
  const r = rng(7), out: Block[] = [];
  const total = (m: number) => Math.round(6 + 2.6 * Math.sin((m / 12) * Math.PI * 2 - 1.2) + m * 0.28);
  for (let m = 0; m < HIST + FUT; m++) {
    const n = total(m), future = m >= HIST;
    for (let k = 0; k < n; k++) {
      const src = k < n * 0.45 ? 0 : k < n * 0.75 ? 1 : 2;
      const x = (m - (HIST + FUT - 1) / 2) * GAP, y = -2.2 + k * UNIT + UNIT / 2;
      const th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1), rad = 2.2 + r() * 2.6;
      out.push({
        src, month: m, future, bar: [x, y, 0],
        chaos: [rad * Math.sin(ph) * Math.cos(th) * 1.25, rad * Math.cos(ph) * 0.7, rad * Math.sin(ph) * Math.sin(th)],
        phase: r() * Math.PI * 2,
      });
    }
  }
  return out;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function DataScene() {
  const lang = useLang();
  const t = COPY[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const months = useMemo(() => monthNames(INTL_LOCALE[lang]), [lang]);
  const { theme } = useSiteTheme();
  const pal = PALETTE[theme];
  const palRef = useRef(pal);
  palRef.current = pal;
  // textos que o canvas desenha: lidos a cada quadro, então seguem a troca de idioma
  const labels = useRef({ months, today: t.today });
  labels.current = { months, today: t.today };
  const [stage, setStage] = useState<Stage>('caos');
  const [horizon, setHorizon] = useState(3);
  const [touched, setTouched] = useState(false);
  const live = useRef({ stage, horizon });
  live.current = { stage, horizon };

  // ciclo automático até a pessoa mexer
  useEffect(() => {
    if (touched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const order: Stage[] = ['caos', 'conectado', 'previsao'];
    const id = window.setInterval(() => {
      setStage((cur) => order[(order.indexOf(cur) + 1) % order.length]);
    }, 4200);
    return () => window.clearInterval(id);
  }, [touched]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blocks = buildBlocks();
    // progresso animado de cada estado (0..1), perseguindo o alvo
    let toBar = 0, showFuture = 0, futureCount = 0;
    let yaw = -0.16, targetYaw = -0.16; const pitch = 0.22;
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now(), clock = 0;
    let drag: { x: number; yaw: number } | null = null;
    let userYaw = false; // depois que a pessoa gira, a cena respeita o ângulo dela
    const VIEW = -0.16; // ângulo de leitura do gráfico (quase de frente, com profundidade)

    const size = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (x: number, y: number, z: number) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
      const y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      // escala pelo quadro: o gráfico (~15 unidades de largura, ~7 de altura) sempre cabe
      const k = 9 / (9 - z2), sc = Math.min(w / 17.5, h / 7.6);
      return { x: w / 2 + x1 * k * sc, y: h * 0.52 - y1 * k * sc, k, z: z2, sc };
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const b = ease(toBar);

      // chão e linha do "hoje" quando organizado
      if (b > 0.05) {
        ctx.save();
        ctx.globalAlpha = b;
        const x0 = (-(HIST + FUT - 1) / 2 - 0.6) * GAP, x1 = ((HIST + FUT - 1) / 2 + 0.6) * GAP;
        const a = project(x0, -2.2, 0), c = project(x1, -2.2, 0);
        ctx.strokeStyle = palRef.current.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
        ctx.fillStyle = palRef.current.label;
        ctx.font = '600 11px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
        // rótulo só onde cabe: pula o mês se ficaria colado no anterior
        let lastX = -Infinity;
        for (let m = 0; m < HIST + FUT; m++) {
          if (m >= HIST && (showFuture < 0.5 || m - HIST >= Math.round(futureCount))) continue;
          const p = project((m - (HIST + FUT - 1) / 2) * GAP, -2.2, 0);
          if (p.x - lastX < 30) continue;
          lastX = p.x;
          ctx.fillStyle = m < HIST ? palRef.current.label : palRef.current.future;
          ctx.fillText(labels.current.months[m % 12], p.x, p.y + 18);
        }
        if (showFuture > 0.05) {
          const t = project((HIST - 0.5 - (HIST + FUT - 1) / 2) * GAP, -2.2, 0);
          const top = project((HIST - 0.5 - (HIST + FUT - 1) / 2) * GAP, 2.2, 0);
          ctx.globalAlpha = b * showFuture;
          ctx.setLineDash([4, 4]); ctx.strokeStyle = palRef.current.today;
          ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(top.x, top.y); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = palRef.current.todayText; ctx.font = '700 12px Inter, system-ui, sans-serif';
          ctx.fillText(labels.current.today, top.x, top.y - 8);
        }
        ctx.restore();
      }

      const items = blocks.map((bl) => {
        let alpha = 1;
        if (bl.future) {
          const idx = bl.month - HIST;
          const on = Math.max(0, Math.min(1, futureCount - idx));
          alpha = showFuture * on;
          if (alpha <= 0.01) return null;
        }
        const wob = (1 - b) * 0.18;
        const cx = bl.chaos[0] + Math.sin(clock * 0.9 + bl.phase) * wob;
        const cy2 = bl.chaos[1] + Math.cos(clock * 0.7 + bl.phase) * wob;
        const cz = bl.chaos[2] + Math.sin(clock * 0.5 + bl.phase * 2) * wob;
        // cada bloco chega com um pequeno atraso próprio (efeito de "encaixe")
        const own = ease(Math.max(0, Math.min(1, toBar * 1.35 - (bl.phase / (Math.PI * 2)) * 0.35)));
        const x = cx + (bl.bar[0] - cx) * own, y = cy2 + (bl.bar[1] - cy2) * own, z = cz + (bl.bar[2] - cz) * own;
        return { bl, p: project(x, y, z), alpha, own };
      }).filter(Boolean) as { bl: Block; p: ReturnType<typeof project>; alpha: number; own: number }[];

      items.sort((a, c) => a.p.z - c.p.z);
      for (const { bl, p, alpha, own } of items) {
        // no caos é um quadradinho; encaixado, alarga até virar segmento de barra
        const bw = (UNIT * 0.86 + (GAP * 0.66 - UNIT * 0.86) * own) * p.k * p.sc;
        const size = UNIT * 0.86 * p.k * p.sc;
        const depth = Math.max(0.55, Math.min(1, 0.78 + p.z * 0.06));
        const [r, g, bb] = palRef.current.src[bl.src];
        ctx.globalAlpha = alpha * depth;
        if (bl.future) {
          ctx.strokeStyle = palRef.current.future; ctx.lineWidth = 1.5;
          ctx.strokeRect(p.x - bw / 2 + 0.75, p.y - size / 2 + 0.75, bw - 1.5, size - 1.5);
          ctx.fillStyle = palRef.current.futureFill;
          ctx.fillRect(p.x - bw / 2, p.y - size / 2, bw, size);
        } else {
          ctx.fillStyle = `rgb(${r},${g},${bb})`;
          ctx.fillRect(p.x - bw / 2, p.y - size / 2, bw, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = (dt: number) => {
      const { stage: st, horizon: hz } = live.current;
      const targetBar = st === 'caos' ? 0 : 1;
      const targetFut = st === 'previsao' ? 1 : 0;
      const targetCount = st === 'previsao' ? hz : 0;
      const k = Math.min(1, dt * 2.2);
      toBar += (targetBar - toBar) * k;
      showFuture += (targetFut - showFuture) * Math.min(1, dt * 3);
      futureCount += (targetCount - futureCount) * Math.min(1, dt * 4);
      if (!drag) {
        if (st === 'caos') targetYaw += dt * 0.18;
        else if (!userYaw) {
          // volta ao ângulo de leitura mais próximo, sem dar a volta inteira
          const turns = Math.round((targetYaw - VIEW) / (Math.PI * 2));
          const goal = VIEW + turns * Math.PI * 2 + Math.sin(clock * 0.4) * 0.08;
          targetYaw += (goal - targetYaw) * Math.min(1, dt * 1.5);
        }
      }
      yaw += (targetYaw - yaw) * Math.min(1, dt * 6);
      clock += dt;
    };

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
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
      <canvas ref={canvasRef} className={s.sceneCanvas} role="img"
        aria-label={t.sceneLabel(current.label, current.text)} />
      <div className={s.sceneFoot}>
        <p className={s.sceneText} aria-live="polite">{current.text}</p>
        <label className={`${s.timeControl} ${stage === 'previsao' ? '' : s.timeDim}`}>
          <span className={s.timeLabel}>{t.horizon} <strong>+{t.months(horizon)}</strong></span>
          <input type="range" min={1} max={FUT} value={horizon}
            onChange={(e) => { setTouched(true); setStage('previsao'); setHorizon(Number(e.target.value)); }}
            aria-valuetext={t.ahead(horizon)} />
        </label>
      </div>
    </div>
  );
}
