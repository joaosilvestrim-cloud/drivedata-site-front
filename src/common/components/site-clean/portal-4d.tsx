'use client';

// Cena do topo do Portal Fabric: a história do produto em movimento contínuo.
// À esquerda, a capacidade Fabric (um bloco de CUs que acende quando os dados
// atualizam). No meio, o Portal (dois anéis girando, como um giroscópio). À direita,
// as pessoas, em três áreas. O dado sai da capacidade, atravessa o Portal e chega
// só a quem pode ver: cada área recebe a sua cor (é o RLS em imagem). A quarta
// dimensão é o tempo: de tempos em tempos uma atualização varre o bloco e as
// pessoas recebem o dado novo.
// Mesma técnica da hero-4d: canvas 2D, pontos projetados em perspectiva, câmera
// que balança e inclina com o ponteiro, pausa fora da tela e com a aba oculta.
import { useEffect, useRef } from 'react';
import p from './portal-fabric.module.css';

const GROUPS: [number, number, number][] = [
  [34, 197, 120], // verde da marca
  [8, 172, 228],  // ciano
  [10, 92, 190],  // azul
];
const RING_STOPS = [[34, 197, 120], [8, 172, 228], [10, 92, 190], [8, 172, 228], [34, 197, 120]];
const ringColor = (t: number) => {
  const x = ((t % 1) + 1) % 1 * (RING_STOPS.length - 1), k = Math.floor(x), f = x - k;
  const a = RING_STOPS[k], b = RING_STOPS[k + 1];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
};
const RING_COLORS = Array.from({ length: 24 }, (_, i) => ringColor(i / 24));

function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

const CAP_X = -1.5, PEOPLE_X = 1.45, REFRESH_EVERY = 6.5;
// o anel do portal fica virado em parte para a câmera (senão aparece de lado)
const RING_YAW = 0.85, RCOS = Math.cos(RING_YAW), RSIN = Math.sin(RING_YAW);
// as 12 arestas de um cubo (vértices numerados pelos bits x, y, z)
const EDGES = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];

export type Portal4DLabels = { capacity: string; portal: string; people: string; aria: string };

export function Portal4D({ labels }: { labels: Portal4DLabels }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const textRef = useRef(labels);
  // a cena lê os rótulos a cada quadro: troca de idioma sem reiniciar a animação
  useEffect(() => { textRef.current = labels; }, [labels]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 760px)').matches;
    const r = rng(7);

    // ── capacidade: grade de CUs (cubo de pontos) ──
    const SIDE = small ? 6 : 7, CAP = SIDE * SIDE * SIDE, half = 0.42;
    const cap = new Float32Array(CAP * 3);
    for (let i = 0; i < CAP; i++) {
      const a = i % SIDE, b = Math.floor(i / SIDE) % SIDE, c = Math.floor(i / (SIDE * SIDE));
      cap[i * 3] = (a / (SIDE - 1) - 0.5) * 2 * half;
      cap[i * 3 + 1] = (b / (SIDE - 1) - 0.5) * 2 * half;
      cap[i * 3 + 2] = (c / (SIDE - 1) - 0.5) * 2 * half;
    }

    // ── portal: dois anéis (toro fino) no plano y-z, o dado passa pelo meio ──
    const RING = small ? 420 : 720, R1 = 0.6, R2 = 0.47;
    const ring = new Float32Array(RING * 4); // ângulo maior, ângulo menor, raio, qual anel
    for (let i = 0; i < RING; i++) {
      const outer = i < RING * 0.62;
      ring[i * 4] = r() * Math.PI * 2;
      ring[i * 4 + 1] = r() * Math.PI * 2;
      ring[i * 4 + 2] = outer ? R1 : R2;
      ring[i * 4 + 3] = outer ? 0 : 1;
    }

    // ── pessoas: três áreas (fileiras), quatro pessoas cada, num arco ──
    const PEOPLE: { x: number; y: number; z: number; g: number; pulse: number }[] = [];
    for (let g = 0; g < 3; g++) for (let k = 0; k < 4; k++) {
      const y = 0.62 - g * 0.62, z = (k - 1.5) * 0.44;
      PEOPLE.push({ x: PEOPLE_X - Math.abs(z) * 0.35 + (g === 1 ? 0.12 : 0), y, z, g, pulse: 0 });
    }
    // ── fluxo: cada partícula sai de um CU, atravessa o portal e vai a uma pessoa ──
    const FLOW = small ? 260 : 460;
    const fSrc = new Uint16Array(FLOW), fDst = new Uint8Array(FLOW);
    const fT = new Float32Array(FLOW), fSpeed = new Float32Array(FLOW);
    const fGate = new Float32Array(FLOW * 2); // ponto de passagem dentro do anel
    for (let i = 0; i < FLOW; i++) {
      fSrc[i] = Math.floor(r() * CAP); fDst[i] = Math.floor(r() * PEOPLE.length);
      fT[i] = r(); fSpeed[i] = 0.16 + r() * 0.12;
      const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * R2 * 0.55;
      fGate[i * 2] = Math.cos(a) * rr; fGate[i * 2 + 1] = Math.sin(a) * rr;
    }

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, last = performance.now(), clock = 0;
    let tiltX = 0, tiltY = 0, aimX = 0, aimY = 0, ink = '10,22,40';

    const readInk = () => {
      // a cor do texto do site (troca no tema escuro) vem do CSS do próprio canvas
      const m = /\d+\s*,\s*\d+\s*,\s*\d+/.exec(getComputedStyle(canvas).color);
      if (m) ink = m[0].replace(/\s/g, '');
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readInk();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const t = clock;
      const sc = Math.min(w * 0.232, h * 0.45), cx = w / 2, cy = h * 0.47;
      const yaw = Math.sin(t * 0.22) * 0.38 + tiltY, pitch = 0.2 + Math.sin(t * 0.17) * 0.05 + tiltX;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const proj = (x: number, y: number, z: number, out: number[]) => {
        const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw;
        const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const k = 3.6 / (3.6 - z2);
        out[0] = cx + x1 * sc * k; out[1] = cy - y2 * sc * k; out[2] = z2; out[3] = k;
      };
      const P = [0, 0, 0, 1], Q = [0, 0, 0, 1];
      const depthOf = (z: number) => Math.max(0, Math.min(1, (z + 1.4) / 2.8));

      // atualização: uma varredura atravessa o bloco a cada REFRESH_EVERY segundos
      const cyc = (t % REFRESH_EVERY) / REFRESH_EVERY;
      const sweep = cyc < 0.35 ? -half + (cyc / 0.35) * half * 2.4 : 99;

      // capacidade (gira devagar em torno do próprio eixo)
      const ca = t * 0.25, cca = Math.cos(ca), sca = Math.sin(ca);
      // arestas do bloco, finas, para ele ler como cubo
      const corner = (c: number, out: number[]) => {
        const lx = (c & 1 ? 1 : -1) * half * 1.12, ly = (c & 2 ? 1 : -1) * half * 1.12, lz = (c & 4 ? 1 : -1) * half * 1.12;
        proj(CAP_X + lx * cca - lz * sca, ly, lx * sca + lz * cca, out);
      };
      ctx.strokeStyle = `rgba(${ink},0.22)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [a, b] of EDGES) { corner(a, P); corner(b, Q); ctx.moveTo(P[0], P[1]); ctx.lineTo(Q[0], Q[1]); }
      ctx.stroke();
      for (let i = 0; i < CAP; i++) {
        const lx = cap[i * 3], ly = cap[i * 3 + 1], lz = cap[i * 3 + 2];
        const rx = lx * cca - lz * sca, rz = lx * sca + lz * cca;
        proj(CAP_X + rx, ly, rz, P);
        const d = depthOf(P[2]);
        const lit = Math.max(0, 1 - Math.abs(ly - sweep) / 0.16);
        const size = 1.6 + d * 2;
        if (lit > 0.05) {
          ctx.fillStyle = `rgba(34,197,120,${0.35 + lit * 0.65})`;
          ctx.fillRect(P[0] - size * 0.75, P[1] - size * 0.75, size * 1.5, size * 1.5);
        } else {
          ctx.fillStyle = `rgba(${ink},${0.14 + d * 0.32})`;
          ctx.fillRect(P[0] - size / 2, P[1] - size / 2, size, size);
        }
      }

      // portal: os dois anéis giram em sentidos opostos
      for (let i = 0; i < RING; i++) {
        const a = ring[i * 4], b = ring[i * 4 + 1], R = ring[i * 4 + 2], which = ring[i * 4 + 3];
        const spin = which === 0 ? t * 0.35 : -t * 0.5;
        const tilt = which === 0 ? 0 : 0.5 + Math.sin(t * 0.3) * 0.15;
        const tube = 0.035;
        // círculo no plano y-z, com espessura de tubo
        let y = Math.cos(a + spin) * (R + Math.cos(b) * tube);
        const z = Math.sin(a + spin) * (R + Math.cos(b) * tube);
        const x = Math.sin(b) * tube;
        // o anel de dentro inclina (giroscópio)
        const yt = y * Math.cos(tilt) - x * Math.sin(tilt);
        const xt = y * Math.sin(tilt) + x * Math.cos(tilt);
        y = yt;
        proj(xt * RCOS + z * RSIN, y, -xt * RSIN + z * RCOS, P);
        const d = depthOf(P[2]);
        ctx.fillStyle = RING_COLORS[Math.floor(((a / (Math.PI * 2) + t * 0.05) % 1) * 24) % 24];
        ctx.globalAlpha = 0.3 + d * 0.7;
        const size = 1.3 + d * 2.1;
        ctx.fillRect(P[0] - size / 2, P[1] - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // fluxo: curva em três trechos (CU → boca do portal → pessoa)
      for (let i = 0; i < FLOW; i++) {
        const u = fT[i];
        const s = fSrc[i], person = PEOPLE[fDst[i]];
        const sx = CAP_X + cap[s * 3], sy = cap[s * 3 + 1], sz = cap[s * 3 + 2];
        const gy = fGate[i * 2], gx = fGate[i * 2 + 1] * RSIN, gz = fGate[i * 2 + 1] * RCOS;
        let x: number, y: number, z: number;
        if (u < 0.5) {
          // da capacidade até o portal: converge para o centro
          const k = u / 0.5, e = k * k * (3 - 2 * k);
          x = sx + (gx - sx) * k; y = sy + (gy - sy) * e; z = sz + (gz - sz) * e;
        } else {
          // do portal até a pessoa: abre em leque
          const k = (u - 0.5) / 0.5, e = k * k * (3 - 2 * k);
          x = gx + (person.x - gx) * k; y = gy + (person.y - gy) * e; z = gz + (person.z - gz) * e;
        }
        proj(x, y, z, P);
        const d = depthOf(P[2]);
        // antes do portal o dado é neutro; depois ganha a cor da área de destino
        const g = GROUPS[person.g];
        const colored = Math.max(0, Math.min(1, (u - 0.46) / 0.08));
        const rC = Math.round(g[0] * colored + 120 * (1 - colored));
        const gC = Math.round(g[1] * colored + 140 * (1 - colored));
        const bC = Math.round(g[2] * colored + 165 * (1 - colored));
        const fade = Math.min(1, u / 0.06, (1 - u) / 0.06);
        ctx.fillStyle = `rgba(${rC},${gC},${bC},${(0.45 + d * 0.55) * fade})`;
        const size = 1.8 + d * 2.2;
        ctx.fillRect(P[0] - size / 2, P[1] - size / 2, size, size);
      }

      // pessoas: ícone de pontos voltado para a câmera (cabeça e ombros);
      // cresce um instante quando o dado chega
      for (const person of PEOPLE) {
        const g = GROUPS[person.g];
        proj(person.x, person.y, person.z, P);
        const d = depthOf(P[2]);
        const rad = sc * 0.055 * P[3] * (1 + person.pulse * 0.25);
        const dot = 1.3 + d * 1.2;
        ctx.fillStyle = `rgba(${g[0]},${g[1]},${g[2]},${0.12 + person.pulse * 0.2})`;
        ctx.beginPath(); ctx.arc(P[0], P[1] - rad * 0.55, rad, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${g[0]},${g[1]},${g[2]},${0.55 + d * 0.45})`;
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          ctx.fillRect(P[0] + Math.cos(a) * rad - dot / 2, P[1] - rad * 0.55 + Math.sin(a) * rad - dot / 2, dot, dot);
        }
        for (let i = 0; i < 15; i++) {
          const a = Math.PI + 0.32 + (i / 14) * (Math.PI - 0.64);
          ctx.fillRect(P[0] + Math.cos(a) * rad * 1.75 - dot / 2, P[1] + rad * 2.35 + Math.sin(a) * rad * 1.4 - dot / 2, dot, dot);
        }
      }

      // rótulos sob cada parte
      const L = textRef.current;
      ctx.font = `600 ${small ? 11 : 13}px Inter, ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(${ink},0.62)`;
      // o texto nunca passa da borda do canvas
      const label = (text: string, x: number, y: number) => {
        const half = ctx.measureText(text).width / 2 + 4;
        ctx.fillText(text, Math.max(half, Math.min(w - half, x)), y);
      };
      proj(CAP_X, -0.78, 0, P); label(L.capacity, P[0], P[1]);
      proj(0, -0.9, 0, P); label(L.portal, P[0], P[1]);
      // o das pessoas fica acima da primeira fileira, longe das cabeças de baixo
      proj(PEOPLE_X, 0.98, 0, P); label(L.people, P[0], P[1] - 4);
    };

    const frame = (now: number) => {
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      const speed = reduce ? 0.35 : 1;
      clock += dt * speed;
      for (let i = 0; i < FLOW; i++) {
        fT[i] += dt * speed * fSpeed[i] * 0.55;
        if (fT[i] >= 1) {
          PEOPLE[fDst[i]].pulse = 1;
          fT[i] -= 1;
          fSrc[i] = Math.floor(r() * CAP);
        }
      }
      for (const person of PEOPLE) person.pulse *= 0.9;
      tiltX += (aimX - tiltX) * 0.05; tiltY += (aimY - tiltY) * 0.05;
      draw();
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    const onMove = (e: PointerEvent) => {
      aimY = (e.clientX / window.innerWidth - 0.5) * 0.5;
      aimX = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    const onLeave = () => { aimX = 0; aimY = 0; };

    resize();
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { rootMargin: '80px' });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    // o tema troca a cor do texto: relê na mudança do atributo
    const mo = new MutationObserver(readInk);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-site-theme', 'data-theme'] });
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    start();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className={p.scene} role="img" aria-label={labels.aria} />;
}
