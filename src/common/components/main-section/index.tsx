'use client';

import { useTypebot } from '@/common/providers/TypebotProvider';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import {
  DashBars,
  DashHead,
  DashKpis,
  Eyebrow,
  FloatChip,
  GhostButton,
  GlobeCanvas,
  GlobeTerms,
  HeroCanvas,
  HeroDash,
  HeroLeft,
  HighlightedText,
  MainActions,
  MainContainer,
  MainContent,
  MainTitle,
  Ticker,
} from './styles';
import { MainSectionProps } from './types';

const BAR_HEIGHTS = [45, 62, 50, 78, 66, 90, 72, 58];

const TICKER = [
  { l: 'Receita prevista', v: '+42,3%', c: 'up' },
  { l: 'Custo operacional', v: '-31,0%', c: 'dn' },
  { l: 'Pipeline do trimestre', v: '+18,0%', c: 'up' },
  { l: 'Acurácia do modelo', v: '94%', c: 'b' },
  { l: 'Fontes conectadas', v: '12', c: 'b' },
  { l: 'Disponibilidade', v: '99,9%', c: 'b' },
];

// Termos de Dados e IA que aparecem e somem em volta do globo.
const TERMS = [
  { t: 'Machine Learning', top: '11%', left: '28%', dl: 0, du: 7, c: '#54da89' },
  { t: 'Big Data', top: '21%', left: '60%', dl: 2, du: 8, c: '#22d3ee' },
  { t: 'Redes Neurais', top: '39%', left: '5%', dl: 4, du: 7.5, c: '#54da89' },
  { t: 'ETL · Pipelines', top: '56%', left: '63%', dl: 1, du: 8.5, c: '#22d3ee' },
  { t: 'IA Generativa', top: '70%', left: '31%', dl: 3, du: 7, c: '#54da89' },
  { t: 'Data Lake', top: '31%', left: '43%', dl: 5, du: 8, c: '#22d3ee' },
  { t: 'Predição', top: '82%', left: '55%', dl: 2.5, du: 7.5, c: '#54da89' },
  { t: 'Analytics', top: '7%', left: '52%', dl: 6, du: 8, c: '#22d3ee' },
  { t: 'Governança', top: '62%', left: '14%', dl: 0.5, du: 8.5, c: '#54da89' },
  { t: 'Deep Learning', top: '47%', left: '48%', dl: 3.5, du: 7, c: '#22d3ee' },
];

export const MainSection = ({ className }: MainSectionProps) => {
  const { t } = useTranslation();
  const { openTypebot } = useTypebot();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<HTMLCanvasElement>(null);

  // Constelação animada de fundo do hero.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let pts: { x: number; y: number; vx: number; vy: number }[] = [];
    let raf = 0;

    const resize = () => {
      const p = c.parentElement;
      if (!p) return;
      W = c.width = p.offsetWidth;
      H = c.height = p.offsetHeight;
      const n = Math.min(70, Math.floor(W / 26));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(84,218,137,${0.11 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(34,211,238,.45)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Globo/rede 3D girando (data-sphere).
  useEffect(() => {
    const c = globeRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const N = 200;
    const gold = Math.PI * (3 - Math.sqrt(5));
    const base: [number, number, number][] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = gold * i;
      base.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    const edges: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = base[i];
        const b = base[j];
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        if (dx * dx + dy * dy + dz * dz < 0.16) edges.push([i, j]);
      }
    }

    const size = 620;
    c.width = size;
    c.height = size;
    const R = size * 0.38;
    const cx = size / 2;
    const cy = size / 2;
    const tilt = 0.42;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    let angle = 0;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      angle += 0.0022;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const proj: { sx: number; sy: number; d: number }[] = new Array(N);
      for (let i = 0; i < N; i++) {
        const p = base[i];
        const x1 = p[0] * cosA - p[2] * sinA;
        const z1 = p[0] * sinA + p[2] * cosA;
        const y2 = p[1] * cosT - z1 * sinT;
        const z2 = p[1] * sinT + z1 * cosT;
        proj[i] = { sx: cx + x1 * R, sy: cy + y2 * R, d: (z2 + 1) / 2 };
      }
      for (let e = 0; e < edges.length; e++) {
        const a = proj[edges[e][0]];
        const b = proj[edges[e][1]];
        const d = (a.d + b.d) / 2;
        if (d < 0.32) continue;
        ctx.strokeStyle = `rgba(84,218,137,${0.14 * d})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
      for (let i = 0; i < N; i++) {
        const a = proj[i];
        ctx.fillStyle = `rgba(34,211,238,${0.22 + a.d * 0.6})`;
        ctx.beginPath();
        ctx.arc(a.sx, a.sy, 0.7 + a.d * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  const handleDemoClick = () => {
    openTypebot();
  };

  const scrollToSolutions = () => {
    document.getElementById('solucoes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainContainer className={className}>
      <HeroCanvas ref={canvasRef} />
      <GlobeCanvas ref={globeRef} />
      <GlobeTerms>
        {TERMS.map((x, i) => (
          <span
            key={i}
            style={{
              top: x.top,
              left: x.left,
              color: x.c,
              animationDelay: `${x.dl}s`,
              animationDuration: `${x.du}s`,
            }}
          >
            {x.t}
          </span>
        ))}
      </GlobeTerms>

      <MainContent>
        <HeroLeft>
          <Eyebrow>
            <span className="dot" />
            {t('mainSection.eyebrow', 'Inteligência de Dados · BI · IA')}
          </Eyebrow>

          <MainTitle>
            {t('mainSection.title')}{' '}
            <HighlightedText>{t('mainSection.titleHighlight')}</HighlightedText>
          </MainTitle>

          <MainActions>
            <Button size="lg" onClick={handleDemoClick}>
              {t('mainSection.button')}
            </Button>
            <GhostButton onClick={scrollToSolutions}>
              {t('mainSection.secondary', 'Ver soluções')}
            </GhostButton>
          </MainActions>
        </HeroLeft>

        <HeroDash>
          <FloatChip className="top">
            <span className="ic">IA</span>
            <div>
              <b>Previsão de demanda</b>
              <div className="s">acurácia 94%</div>
            </div>
          </FloatChip>

          <DashHead>
            <span className="t">Cockpit Executivo · tempo real</span>
            <span className="live">● ao vivo</span>
          </DashHead>

          <DashKpis>
            <div className="kpi">
              <div className="n up">+42%</div>
              <div className="l">eficiência</div>
            </div>
            <div className="kpi">
              <div className="n bl">-31%</div>
              <div className="l">custo op.</div>
            </div>
            <div className="kpi">
              <div className="n">R$8,4M</div>
              <div className="l">impacto</div>
            </div>
          </DashKpis>

          <DashBars>
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="bar"
                style={{ height: `${h}%`, opacity: 0.55 + h / 260, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </DashBars>

          <FloatChip className="bot">
            <span className="ic bl">◲</span>
            <div>
              <b>Pipeline saudável</b>
              <div className="s">+18% no trimestre</div>
            </div>
          </FloatChip>
        </HeroDash>
      </MainContent>

      <Ticker>
        <div className="track">
          {[...TICKER, ...TICKER].map((it, i) => (
            <span className="it" key={i}>
              <span className="d" />
              {it.l}{' '}
              <span className={it.c}>{it.v}</span>
            </span>
          ))}
        </div>
      </Ticker>
    </MainContainer>
  );
};
