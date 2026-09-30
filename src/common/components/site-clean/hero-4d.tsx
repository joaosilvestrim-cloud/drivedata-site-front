'use client';

// Escultura de dados do topo da home. Milhares de pontos que mudam de forma com
// o tempo (a quarta dimensão): esfera de dados, o "D" da DriveData, gráfico de
// barras, rosca, linha de tendência, banco de dados e uma superfície de dados. Gira sozinha, inclina com o ponteiro e os
// pontos se afastam do cursor. Canvas 2D puro, sem biblioteca.
// Pausa fora da tela e com a aba oculta; com movimento reduzido mostra o "D" parado.
import { useEffect, useRef } from 'react';
import s from './clean.module.css';

type Vec = Float32Array; // x, y, z por ponto

// gradiente do logo: verde da marca > ciano > azul
const STOPS = [
  [34, 197, 120],
  [8, 172, 228],
  [10, 92, 190],
];
const BUCKETS = 16;
const colorAt = (t: number) => {
  const seg = t < 0.5 ? 0 : 1;
  const k = seg === 0 ? t / 0.5 : (t - 0.5) / 0.5;
  const a = STOPS[seg], b = STOPS[seg + 1];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;
};
const PALETTE = Array.from({ length: BUCKETS }, (_, i) => colorAt(i / (BUCKETS - 1)));

function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

/** Esfera por espiral de Fibonacci: distribuição uniforme, sem aglomerar nos polos. */
function sphere(n: number): Vec {
  const out = new Float32Array(n * 3), g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i;
    out[i * 3] = Math.cos(th) * r * 1.05; out[i * 3 + 1] = y * 1.05; out[i * 3 + 2] = Math.sin(th) * r * 1.05;
  }
  return out;
}

/** O "D" do logo: meia-lua com o entalhe em ">" à esquerda, extrudado em profundidade. */
function logoD(n: number): Vec {
  const out = new Float32Array(n * 3), r = rng(11);
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  const path = new Path2D();
  // espaço do desenho: x de -0.95 a 1.05, y de -1 a 1
  path.moveTo(-0.95, -1);
  path.lineTo(0.05, -1);
  path.arc(0.05, 0, 1, -Math.PI / 2, Math.PI / 2);
  path.lineTo(-0.95, 1);
  path.lineTo(-0.35, 0);
  path.closePath();
  let i = 0, guard = 0;
  while (i < n && guard < n * 40) {
    guard++;
    const x = -0.95 + r() * 2, y = -1 + r() * 2;
    if (!ctx.isPointInPath(path, x, y)) continue;
    // mais pontos na borda deixam o contorno nítido
    const edge = ctx.isPointInPath(path, x + 0.07, y) && ctx.isPointInPath(path, x - 0.07, y) && ctx.isPointInPath(path, x, y + 0.07) && ctx.isPointInPath(path, x, y - 0.07);
    if (edge && r() < 0.45) continue;
    out[i * 3] = x * 0.95; out[i * 3 + 1] = y * 0.95; out[i * 3 + 2] = (r() - 0.5) * 0.36;
    i++;
  }
  for (; i < n; i++) { out[i * 3] = 0; out[i * 3 + 1] = 0; out[i * 3 + 2] = 0; }
  return out;
}

/** Grade da superfície de dados (x, z); a altura é calculada a cada quadro. */
function waveGrid(n: number): Vec {
  const out = new Float32Array(n * 3), side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const gx = i % side, gz = Math.floor(i / side);
    out[i * 3] = (gx / (side - 1) - 0.5) * 2.6; out[i * 3 + 1] = 0; out[i * 3 + 2] = (gz / (side - 1) - 0.5) * 2.6;
  }
  return out;
}

/** Superfícies com área: cada uma recebe pontos na proporção do seu tamanho. */
type Patch = { area: number; at: (u: number, v: number) => [number, number, number]; tag?: number };
function fromPatches(n: number, patches: Patch[], seed: number, tags?: Float32Array): Vec {
  const out = new Float32Array(n * 3), r = rng(seed);
  const total = patches.reduce((a, q) => a + q.area, 0);
  let i = 0;
  patches.forEach((q, k) => {
    const want = k === patches.length - 1 ? n - i : Math.round((q.area / total) * n);
    for (let j = 0; j < want && i < n; j++, i++) {
      const [x, y, z] = q.at(r(), r());
      out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
      if (tags) tags[i] = q.tag ?? -1;
    }
  });
  return out;
}

/** Faces de uma caixa (sem a de baixo) entre x0..x1, y0..y1, z0..z1. */
function boxPatches(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, tag: number): Patch[] {
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
  return [
    { area: dx * dz, at: (u, v) => [x0 + u * dx, y1, z0 + v * dz], tag },
    { area: dx * dy, at: (u, v) => [x0 + u * dx, y0 + v * dy, z1], tag },
    { area: dx * dy, at: (u, v) => [x0 + u * dx, y0 + v * dy, z0], tag },
    { area: dz * dy, at: (u, v) => [x0, y0 + v * dy, z0 + u * dz], tag },
    { area: dz * dy, at: (u, v) => [x1, y0 + v * dy, z0 + u * dz], tag },
  ];
}

// Gráfico de barras 3D: uma fileira de colunas em alta. `barOf` guarda a coluna
// de cada ponto para as alturas respirarem no tempo.
const BAR_BASE = -0.95;
const BAR_H = [0.6, 0.95, 0.8, 1.25, 1.1, 1.55, 1.85];
function bars(n: number, barOf: Float32Array): Vec {
  const patches: Patch[] = [];
  const cols = BAR_H.length, w = 0.24, gap = 0.1;
  for (let c = 0; c < cols; c++) {
    const x0 = -((cols * w + (cols - 1) * gap) / 2) + c * (w + gap);
    patches.push(...boxPatches(x0, x0 + w, BAR_BASE, BAR_BASE + BAR_H[c], -0.14, 0.14, c));
  }
  // base do gráfico
  patches.push({ area: 0.18, at: (u, v) => [-1.25 + u * 2.5, BAR_BASE, -0.3 + v * 0.6], tag: -1 });
  return fromPatches(n, patches, 21, barOf);
}

/** Gráfico de rosca de frente, com quatro fatias e a maior destacada. */
function donut(n: number): Vec {
  const slices = [0.38, 0.27, 0.2, 0.15], gap = 0.07, rIn = 0.46, rOut = 1, depth = 0.2;
  const patches: Patch[] = [];
  let a0 = Math.PI / 2;
  slices.forEach((f, k) => {
    const span = f * Math.PI * 2 - gap, start = a0 - gap / 2 - span, mid = start + span / 2;
    const pop = k === 0 ? 0.13 : 0; // fatia destacada
    const ox = Math.cos(mid) * pop, oy = Math.sin(mid) * pop;
    const ring = (u: number, v: number, z: number): [number, number, number] => {
      const a = start + u * span, rr = Math.sqrt(rIn * rIn + v * (rOut * rOut - rIn * rIn));
      return [ox + Math.cos(a) * rr, oy + Math.sin(a) * rr, z];
    };
    const faceArea = (span / 2) * (rOut * rOut - rIn * rIn);
    patches.push({ area: faceArea, at: (u, v) => ring(u, v, depth) });
    patches.push({ area: faceArea * 0.6, at: (u, v) => ring(u, v, -depth) });
    patches.push({ area: span * rOut * depth * 2, at: (u, v) => { const a = start + u * span; return [ox + Math.cos(a) * rOut, oy + Math.sin(a) * rOut, -depth + v * depth * 2]; } });
    patches.push({ area: span * rIn * depth * 1.2, at: (u, v) => { const a = start + u * span; return [ox + Math.cos(a) * rIn, oy + Math.sin(a) * rIn, -depth + v * depth * 2]; } });
    a0 = start - gap / 2;
  });
  return fromPatches(n, patches, 31);
}

/** Linha de tendência de frente: eixos, a linha grossa, os marcadores e a área abaixo. */
function lineChart(n: number): Vec {
  const P = [[-1, -0.55], [-0.7, -0.25], [-0.42, -0.4], [-0.12, 0.05], [0.16, -0.05], [0.44, 0.4], [0.72, 0.3], [1, 0.8]];
  const base = -0.9, patches: Patch[] = [];
  const seg = (k: number) => {
    const [x0, y0] = P[k], [x1, y1] = P[k + 1];
    return { x0, y0, x1, y1, len: Math.hypot(x1 - x0, y1 - y0) };
  };
  for (let k = 0; k < P.length - 1; k++) {
    const q = seg(k);
    // a linha: fita fina com um pouco de profundidade
    patches.push({ area: q.len * 0.9, at: (u, v) => [q.x0 + (q.x1 - q.x0) * u, q.y0 + (q.y1 - q.y0) * u + (v - 0.5) * 0.05, (v - 0.5) * 0.12] });
    // a área abaixo da linha, mais rala
    patches.push({ area: q.len * 0.55, at: (u, v) => { const x = q.x0 + (q.x1 - q.x0) * u, y = q.y0 + (q.y1 - q.y0) * u; return [x, base + (y - base) * v, -0.06]; } });
  }
  // marcadores nos pontos
  P.forEach(([x, y]) => patches.push({ area: 0.05, at: (u, v) => { const a = u * Math.PI * 2, rr = 0.065 * Math.sqrt(v); return [x + Math.cos(a) * rr, y + Math.sin(a) * rr, 0.02]; } }));
  // eixos
  patches.push({ area: 0.22, at: (u, v) => [-1.12 + u * 2.24, base, (v - 0.5) * 0.04] });
  patches.push({ area: 0.18, at: (u, v) => [-1.12, base + u * 1.9, (v - 0.5) * 0.04] });
  return fromPatches(n, patches, 41);
}

/** Banco de dados: o cilindro clássico de três discos. */
function database(n: number): Vec {
  const R = 0.72, hDisk = 0.46, gapD = 0.1, patches: Patch[] = [];
  const y0 = -((hDisk * 3 + gapD * 2) / 2);
  for (let d = 0; d < 3; d++) {
    const b = y0 + d * (hDisk + gapD);
    patches.push({ area: Math.PI * 2 * R * hDisk, at: (u, v) => { const a = u * Math.PI * 2; return [Math.cos(a) * R, b + v * hDisk, Math.sin(a) * R]; } });
    // aro de cima de cada disco, mais denso para desenhar a elipse
    patches.push({ area: Math.PI * 2 * R * 0.12, at: (u, v) => { const a = u * Math.PI * 2, rr = R * (0.94 + v * 0.06); return [Math.cos(a) * rr, b + hDisk, Math.sin(a) * rr]; } });
  }
  // tampa
  patches.push({ area: Math.PI * R * R * 0.55, at: (u, v) => { const a = u * Math.PI * 2, rr = R * Math.sqrt(v); return [Math.cos(a) * rr, y0 + 3 * hDisk + 2 * gapD, Math.sin(a) * rr]; } });
  return fromPatches(n, patches, 51);
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const HOLD = 3.2, MORPH = 1.7; // segundos em cada forma e na transição
// ordem: esfera, D, barras, rosca, linha, banco de dados, superfície
const WAVE = 6, BARS = 2;
// formas que ficam de frente para a câmera (as outras giram)
const FRONT = [false, true, false, true, true, false, false];

export function Hero4D({ label }: { label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 760px)').matches;
    const N = small ? 1300 : 2600;
    const barOf = new Float32Array(N);
    const shapes = [sphere(N), logoD(N), bars(N, barOf), donut(N), lineChart(N), database(N), waveGrid(N)];
    const r = rng(3);
    const delay = Float32Array.from({ length: N }, () => r() * 0.35);
    // a cor sai da posição na tela (degradê de cima para baixo em qualquer forma);
    // os pontos são agrupados por cor a cada quadro para trocar fillStyle pouco
    const bucketOf = new Uint8Array(N);
    const counts = new Uint32Array(BUCKETS), starts = new Uint32Array(BUCKETS), order = new Uint32Array(N);
    const px = new Float32Array(N), py = new Float32Array(N), pz = new Float32Array(N);

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, last = performance.now(), clock = reduce ? HOLD + MORPH + 0.5 : 0;
    let spin = 0, dFront = 2 * Math.PI, tiltX = 0, tiltY = 0, aimX = 0, aimY = 0;
    let mx = -9999, my = -9999, hover = 0, hoverAim = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // posição na linha do tempo: forma atual, próxima e o progresso da troca
    const phase = (t: number) => {
      const cycle = HOLD + MORPH, k = Math.floor(t / cycle);
      const inCycle = t - k * cycle;
      const n = shapes.length, from = ((k % n) + n) % n, to = (from + 1) % n;
      const p = inCycle < HOLD ? 0 : (inCycle - HOLD) / MORPH;
      return { from, to, p };
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const { from, to, p } = phase(clock);
      const A = shapes[from], B = shapes[to];
      const sc = Math.min(w, h) * 0.36, cx = w / 2, cy = h / 2;
      // no "D" e nos gráficos a escultura fica de frente (balançando de leve); nas outras formas gira
      if (!FRONT[from]) dFront = Math.ceil(spin / (2 * Math.PI)) * 2 * Math.PI;
      const dAmount = ease(FRONT[from] && FRONT[to] ? 1 : FRONT[from] ? 1 - p : FRONT[to] ? p : 0);
      const yaw = spin + (dFront + Math.sin(clock * 0.8) * 0.28 - spin) * dAmount;
      const cyaw = Math.cos(yaw + tiltY), syaw = Math.sin(yaw + tiltY);
      // de frente a câmera fica quase reta; girando, olha de cima
      const pitch = 0.32 * (1 - dAmount * 0.8) + tiltX;
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const t = clock;

      for (let i = 0; i < N; i++) {
        const k = ease(Math.max(0, Math.min(1, (p * 1.35 - delay[i]))));
        const o = i * 3;
        let ax = A[o], ay = A[o + 1], az = A[o + 2];
        let bx = B[o], by = B[o + 1], bz = B[o + 2];
        // a quarta dimensão: a superfície ondula e as barras sobem e descem no tempo
        if (from === WAVE) ay = Math.sin(ax * 2.2 + t * 1.6) * 0.22 + Math.cos(az * 2.6 - t * 1.2) * 0.18 - 0.1;
        if (to === WAVE) by = Math.sin(bx * 2.2 + t * 1.6) * 0.22 + Math.cos(bz * 2.6 - t * 1.2) * 0.18 - 0.1;
        if (barOf[i] >= 0) {
          const grow = 1 + Math.sin(t * 1.4 + barOf[i] * 0.9) * 0.14;
          if (from === BARS) ay = BAR_BASE + (ay - BAR_BASE) * grow;
          if (to === BARS) by = BAR_BASE + (by - BAR_BASE) * grow;
        }
        // as formas paradas flutuam de leve
        if (from !== WAVE) { ax += Math.sin(t * 0.9 + i) * 0.006; ay += Math.cos(t * 0.7 + i) * 0.006; }
        const x = ax + (bx - ax) * k, y = ay + (by - ay) * k, z = az + (bz - az) * k;
        // gira em y e inclina em x
        const x1 = x * cyaw - z * syaw, z1 = x * syaw + z * cyaw;
        const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const persp = 3.4 / (3.4 - z2);
        px[i] = cx + x1 * sc * persp; py[i] = cy - y2 * sc * persp; pz[i] = z2;
      }

      // os pontos perto do cursor se afastam
      if (hover > 0.01) {
        const R = Math.min(w, h) * 0.16, R2 = R * R;
        for (let i = 0; i < N; i++) {
          const dx = px[i] - mx, dy = py[i] - my, d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2), f = (1 - d / R) * 26 * hover;
            px[i] += (dx / d) * f; py[i] += (dy / d) * f;
          }
        }
      }

      counts.fill(0);
      const span = sc * 2.3;
      for (let i = 0; i < N; i++) {
        const tt = ((py[i] - (cy - span / 2)) / span) * 0.8 + ((px[i] - (cx - span / 2)) / span) * 0.2;
        const b = Math.max(0, Math.min(BUCKETS - 1, Math.round(tt * (BUCKETS - 1))));
        bucketOf[i] = b; counts[b]++;
      }
      for (let b = 0, acc = 0; b < BUCKETS; b++) { starts[b] = acc; acc += counts[b]; }
      for (let i = 0; i < N; i++) order[starts[bucketOf[i]]++] = i;

      let bucket = -1;
      for (let j = 0; j < N; j++) {
        const i = order[j];
        if (bucketOf[i] !== bucket) { bucket = bucketOf[i]; ctx.fillStyle = PALETTE[bucket]; }
        const depth = Math.max(0, Math.min(1, (pz[i] + 1.3) / 2.6)); // 0 fundo, 1 frente
        const size = 1.4 + depth * 2.6;
        ctx.globalAlpha = 0.35 + depth * 0.65;
        ctx.fillRect(px[i] - size / 2, py[i] - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      // o horário do quadro pode vir um pouco antes do marcado no start: nunca negativo
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      if (!frozen) { clock += dt; spin += dt * 0.32; }
      tiltX += (aimX - tiltX) * 0.06; tiltY += (aimY - tiltY) * 0.06;
      hover += (hoverAim - hover) * 0.12;
      draw();
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const start = () => { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      aimY = (e.clientX / window.innerWidth - 0.5) * 0.6;
      aimX = (e.clientY / window.innerHeight - 0.5) * 0.35;
      mx = e.clientX - rect.left; my = e.clientY - rect.top;
      hoverAim = mx > -40 && my > -40 && mx < rect.width + 40 && my < rect.height + 40 ? 1 : 0;
    };
    const onLeave = () => { hoverAim = 0; aimX = 0; aimY = 0; };

    // atalho de revisão: #hero-at=8 abre a animação no segundo 8 (sem efeito sem o hash)
    const at = /hero-at=([\d.]+)/.exec(window.location.hash);
    if (at) clock = Number(at[1]);
    const frozen = /hero-freeze/.test(window.location.hash);

    resize();
    if (reduce) { clock = HOLD + MORPH + 0.5; draw(); } // parado no "D"

    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { rootMargin: '80px' });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    start();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className={s.orb} role="img" aria-label={label} />;
}
