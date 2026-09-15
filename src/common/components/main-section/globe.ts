/**
 * Globo de dados do hero.
 *
 * Esfera de nós em wireframe (espiral de Fibonacci) com:
 *  - rotas: arcos entre nós com um pulso viajando e uma onda ao chegar;
 *  - graticule (paralelos/meridianos) só na face visível;
 *  - anéis orbitais quebrados com um ponto correndo;
 *  - halo de atmosfera.
 *
 * Câmera com rotação + inclinação + parallax do mouse, projeção em perspectiva,
 * canvas em alta resolução (DPR), pausa fora da tela e com a aba oculta, e
 * respeito a prefers-reduced-motion (pinta um quadro parado). Esses pontos
 * vieram do motor "Horizon 4D"; o conteúdo é o globo do site.
 */

type Vec3 = [number, number, number];

export interface GlobeHandle {
  stop: () => void;
  /** Parallax: x/y em [-0.5, 0.5] relativos ao hero. */
  setPointer: (x: number, y: number) => void;
}

const TAU = Math.PI * 2;

// PRNG determinístico (mulberry32): as rotas nascem iguais a cada carga.
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Interpolação esférica entre dois pontos unitários. `lift` ergue o meio do
// trajeto acima da superfície, como uma rota de voo.
function slerp(a: Vec3, b: Vec3, t: number, lift: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const so = Math.sin(omega) || 1e-6;
  const wa = Math.sin((1 - t) * omega) / so;
  const wb = Math.sin(t * omega) / so;
  const r = 1 + lift * Math.sin(t * Math.PI);
  return [(a[0] * wa + b[0] * wb) * r, (a[1] * wa + b[1] * wb) * r, (a[2] * wa + b[2] * wb) * r];
}

const isLightTheme = () =>
  typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light';

// Tinta por tema (canvas não enxerga variável CSS). No claro os tons fecham,
// senão o desenho some sobre o fundo branco.
const inkFor = (light: boolean) =>
  light
    ? { line: '13,110,80', dot: '14,116,144', arc: '2,132,199', pulse: '5,150,105', halo: '13,148,136' }
    : { line: '84,218,137', dot: '34,211,238', arc: '56,189,248', pulse: '110,231,183', halo: '20,184,166' };

type Projected = { x: number; y: number; d: number; s: number };

export function startGlobe(canvas: HTMLCanvasElement): GlobeHandle {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { stop: () => {}, setPointer: () => {} };

  // ── Geometria fixa ───────────────────────────────────────────────────────
  const N = 260;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes: Vec3[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    nodes.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  const edges: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      const dz = nodes[i][2] - nodes[j][2];
      if (dx * dx + dy * dy + dz * dz < 0.125) edges.push([i, j]);
    }
  }

  // Paralelos e meridianos (pontos na esfera; só a face da frente é traçada).
  const ringPts = (fn: (k: number) => Vec3, n = 72): Vec3[] => Array.from({ length: n + 1 }, (_, k) => fn(k / n));
  const graticule: Vec3[][] = [
    ...[-0.5, 0, 0.5].map((lat) =>
      ringPts((u) => {
        const rr = Math.sqrt(1 - lat * lat);
        return [Math.cos(u * TAU) * rr, lat, Math.sin(u * TAU) * rr] as Vec3;
      }),
    ),
    ...[0, 1, 2, 3].map((m) =>
      ringPts((u) => {
        const phi = (m * Math.PI) / 4;
        const a = u * TAU;
        return [Math.cos(a) * Math.cos(phi), Math.sin(a), Math.cos(a) * Math.sin(phi)] as Vec3;
      }),
    ),
  ];

  // ── Hubs, rotas (arcos com pulso) e sinais ──────────────────────────────
  const rand = rng(20260915);
  // Seis nós-concentradores espalhados pela esfera: as rotas partem deles,
  // então a rede converge em pontos em vez de virar linhas soltas.
  const HUBS = Array.from({ length: 6 }, (_, k) => Math.round(((k + 0.5) * N) / 6));
  const ROUTES = 7;
  type Route = { a: number; b: number; t: number; speed: number; ripple: number };
  const pickPair = (): [number, number] => {
    for (;;) {
      const a = HUBS[Math.floor(rand() * HUBS.length)];
      const b = rand() < 0.3 ? HUBS[Math.floor(rand() * HUBS.length)] : Math.floor(rand() * N);
      const d = nodes[a][0] * nodes[b][0] + nodes[a][1] * nodes[b][1] + nodes[a][2] * nodes[b][2];
      // Nem vizinhos (arco curto demais) nem antípodas (arco passa por trás).
      if (a !== b && d < 0.55 && d > -0.6) return [a, b];
    }
  };
  const routes: Route[] = Array.from({ length: ROUTES }, (_, i) => {
    const [a, b] = pickPair();
    return { a, b, t: i / ROUTES, speed: 0.22 + rand() * 0.16, ripple: 0 };
  });
  // Sinais: um nó acende por um instante (evento de dado chegando), com uma
  // pausa aleatória entre um e outro.
  type Signal = { node: number; t: number; wait: number };
  const signals: Signal[] = Array.from({ length: 4 }, (_, i) => ({
    node: Math.floor(rand() * N),
    t: 1,
    wait: i * 0.4,
  }));

  // ── Estado da câmera / loop ──────────────────────────────────────────────
  let width = 0;
  let height = 0;
  let raf = 0;
  let prev = 0;
  let yaw = 0;
  let time = 0;
  let visible = true;
  let disposed = false;
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const render = (stamp: number) => {
    raf = 0;
    if (disposed || document.hidden || !visible) {
      prev = 0;
      return;
    }
    const dt = prev ? Math.min((stamp - prev) / 1000, 0.05) : 0;
    prev = stamp;
    const moving = !reduced.matches;

    if (moving) {
      yaw += dt * 0.11;
      time += dt;
      for (const s of signals) {
        if (s.wait > 0) {
          s.wait -= dt;
          continue;
        }
        s.t += dt / 1.4;
        if (s.t >= 1) {
          s.t = 0;
          s.node = Math.floor(rand() * N);
          s.wait = 0.3 + rand() * 1.2;
        }
      }
      for (const r of routes) {
        r.t += dt * r.speed;
        r.ripple = Math.max(0, r.ripple - dt * 0.9);
        if (r.t >= 1) {
          r.t = 0;
          r.ripple = 1;
          [r.a, r.b] = pickPair();
        }
      }
      eased.x += (pointer.x - eased.x) * 0.06;
      eased.y += (pointer.y - eased.y) * 0.06;
    }

    const light = isLightTheme();
    const c = inkFor(light);
    ctx.clearRect(0, 0, width, height);

    const R = Math.min(width, height) * 0.36;
    const cx = width / 2;
    const cy = height / 2;
    const cosY = Math.cos(yaw + eased.x * 0.35);
    const sinY = Math.sin(yaw + eased.x * 0.35);
    // Respiração: a inclinação oscila devagar, então o globo parece vivo
    // mesmo sem o mouse por perto.
    const tilt = 0.42 + eased.y * 0.25 + Math.sin(time * 0.35) * 0.05;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    // Rotação (yaw) → inclinação → perspectiva. d ∈ [0,1]: 0 atrás, 1 na frente.
    const project = (p: Vec3): Projected => {
      const x1 = p[0] * cosY - p[2] * sinY;
      const z1 = p[0] * sinY + p[2] * cosY;
      const y2 = p[1] * cosT - z1 * sinT;
      const z2 = p[1] * sinT + z1 * cosT;
      const s = 3.2 / (3.2 - z2);
      return { x: cx + x1 * R * s, y: cy + y2 * R * s, d: (z2 + 1) / 2, s };
    };

    // Traça uma polilinha só nos trechos da frente, com alpha pela profundidade.
    const frontPath = (pts: Vec3[], rgb: string, alpha: number, lineWidth: number, minDepth = 0.5) => {
      let a = project(pts[0]);
      for (let i = 1; i < pts.length; i++) {
        const b = project(pts[i]);
        const d = (a.d + b.d) / 2;
        if (d > minDepth) {
          ctx.strokeStyle = `rgba(${rgb},${alpha * (d - minDepth) / (1 - minDepth)})`;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        a = b;
      }
    };

    // Halo de atmosfera.
    const halo = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R * 1.35);
    halo.addColorStop(0, `rgba(${c.halo},${light ? 0.1 : 0.16})`);
    halo.addColorStop(1, `rgba(${c.halo},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.35, 0, TAU);
    ctx.fill();

    // Graticule.
    for (const ring of graticule) frontPath(ring, c.line, 0.14, 1);

    // Arestas e nós.
    const proj: Projected[] = new Array(N);
    for (let i = 0; i < N; i++) proj[i] = project(nodes[i]);
    for (let e = 0; e < edges.length; e++) {
      const a = proj[edges[e][0]];
      const b = proj[edges[e][1]];
      const d = (a.d + b.d) / 2;
      if (d < 0.32) continue;
      ctx.strokeStyle = `rgba(${c.line},${0.16 * d})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    for (let i = 0; i < N; i++) {
      const p = proj[i];
      ctx.fillStyle = `rgba(${c.dot},${0.2 + p.d * 0.65})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, (0.7 + p.d * 1.9) * p.s, 0, TAU);
      ctx.fill();
    }

    // Hubs: anel fino em volta dos concentradores.
    for (const h of HUBS) {
      const p = proj[h];
      if (p.d < 0.4) continue;
      ctx.strokeStyle = `rgba(${c.dot},${0.55 * p.d})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5 * p.s, 0, TAU);
      ctx.stroke();
    }

    // Sinais: anel que se expande e some, com o nó aceso no centro.
    for (const s of signals) {
      if (s.wait > 0 || s.t >= 1) continue;
      const p = proj[s.node];
      if (p.d < 0.4) continue;
      ctx.strokeStyle = `rgba(${c.pulse},${(1 - s.t) * 0.55})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, (R * 0.012 + s.t * R * 0.07) * p.s, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = `rgba(${c.pulse},${(1 - s.t) * 0.9})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2 * p.s, 0, TAU);
      ctx.fill();
    }

    // Rotas: arco tênue, pulso com rastro e onda no destino.
    for (const r of routes) {
      const A = nodes[r.a];
      const B = nodes[r.b];
      const arc = ringPts((u) => slerp(A, B, u, 0.22), 28);
      frontPath(arc, c.arc, 0.3, 1, 0.35);

      const trail = ringPts((u) => slerp(A, B, Math.max(0, r.t - 0.1) + u * Math.min(0.1, r.t), 0.22), 6);
      frontPath(trail, c.pulse, 0.9, 2, 0.35);

      const head = project(slerp(A, B, r.t, 0.22));
      if (head.d > 0.35) {
        ctx.shadowColor = `rgb(${c.pulse})`;
        ctx.shadowBlur = 12;
        ctx.fillStyle = `rgba(${c.pulse},0.95)`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.6 * head.s, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (r.ripple > 0) {
        const dst = proj[r.b];
        if (dst.d > 0.35) {
          ctx.strokeStyle = `rgba(${c.pulse},${r.ripple * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(dst.x, dst.y, (R * 0.02 + (1 - r.ripple) * R * 0.09) * dst.s, 0, TAU);
          ctx.stroke();
        }
      }
    }

    // Anéis orbitais quebrados (do motor 4D), cada um com um ponto correndo.
    for (let orbit = 0; orbit < 2; orbit++) {
      const rad = 1.16 + orbit * 0.14;
      const ang0 = yaw * (orbit ? -0.8 : 0.6) + orbit * 2;
      const lift = orbit ? 0.18 : -0.14;
      const ring = ringPts((u) => {
        const a = ang0 + u * TAU * 0.78;
        return [Math.cos(a) * rad, Math.sin(a) * 0.12 + lift, Math.sin(a) * rad] as Vec3;
      }, 80);
      frontPath(ring, c.line, orbit ? 0.16 : 0.24, 1, 0.25);
      const dot = project(ring[0]);
      if (dot.d > 0.25) {
        ctx.fillStyle = `rgba(${c.dot},0.9)`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2 * dot.s, 0, TAU);
        ctx.fill();
      }
    }

    if (moving) raf = requestAnimationFrame(render);
  };

  const schedule = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(render);
  };
  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    prev = 0;
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    schedule();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else pause();
  });
  intersection.observe(canvas);
  const onVisibility = () => (document.hidden ? pause() : schedule());
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', schedule);
  // Troca de tema é um atributo no <html>; repinta um quadro (conta no modo
  // reduzido, onde não há loop rodando).
  const themeObserver = new MutationObserver(schedule);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  resize();

  return {
    stop() {
      disposed = true;
      pause();
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', schedule);
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
  };
}
