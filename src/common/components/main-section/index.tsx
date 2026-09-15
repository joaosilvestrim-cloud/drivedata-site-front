'use client';

import { useTypebot } from '@/common/providers/TypebotProvider';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import { startGlobe, type GlobeHandle } from './globe';
import {
  GhostButton,
  GlobeStage,
  GlobeTerms,
  HeroCanvas,
  HeroLeft,
  HighlightedText,
  MainActions,
  MainContainer,
  MainContent,
  MainTitle,
  Ticker,
} from './styles';
import { MainSectionProps } from './types';

// Os rótulos vêm do i18n pela chave `k`. Antes o texto era fixo em português e
// aparecia sem traduzir no site do Canadá (página em inglês, painel em PT).
const TICKER = [
  { k: 'revenue', v: '+42,3%', c: 'up' },
  { k: 'cost', v: '-31,0%', c: 'dn' },
  { k: 'pipeline', v: '+18,0%', c: 'up' },
  { k: 'accuracy', v: '94%', c: 'b' },
  { k: 'sources', v: '12', c: 'b' },
  { k: 'uptime', v: '99,9%', c: 'b' },
];

// Termos de Dados e IA que aparecem e somem em volta do globo.
const TERMS = [
  { k: 'ml', top: '11%', left: '28%', dl: 0, du: 7, c: 'var(--dd-primary)' },
  { k: 'bigData', top: '21%', left: '60%', dl: 2, du: 8, c: 'var(--dd-cyan)' },
  { k: 'neural', top: '39%', left: '5%', dl: 4, du: 7.5, c: 'var(--dd-primary)' },
  { k: 'etl', top: '56%', left: '63%', dl: 1, du: 8.5, c: 'var(--dd-cyan)' },
  { k: 'genai', top: '70%', left: '31%', dl: 3, du: 7, c: 'var(--dd-primary)' },
  { k: 'dataLake', top: '31%', left: '43%', dl: 5, du: 8, c: 'var(--dd-cyan)' },
  { k: 'prediction', top: '82%', left: '55%', dl: 2.5, du: 7.5, c: 'var(--dd-primary)' },
  { k: 'analytics', top: '7%', left: '52%', dl: 6, du: 8, c: 'var(--dd-cyan)' },
  { k: 'governance', top: '62%', left: '14%', dl: 0.5, du: 8.5, c: 'var(--dd-primary)' },
  { k: 'deepLearning', top: '47%', left: '48%', dl: 3.5, du: 7, c: 'var(--dd-cyan)' },
];

export const MainSection = ({ className }: MainSectionProps) => {
  const { t } = useTranslation();
  const { openTypebot } = useTypebot();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<HTMLCanvasElement>(null);
  const globe = useRef<GlobeHandle | null>(null);

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
      const light = isLightTheme();
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
            ctx.strokeStyle = lineInk(light, 0.11 * (1 - d / 130));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = dotInk(light, 0.45);
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

  // Globo de dados (motor em ./globe.ts).
  useEffect(() => {
    const c = globeRef.current;
    if (!c) return;
    globe.current = startGlobe(c);
    return () => {
      globe.current?.stop();
      globe.current = null;
    };
  }, []);

  const handleDemoClick = () => {
    openTypebot();
  };

  const scrollToSolutions = () => {
    document.getElementById('solucoes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainContainer
      className={className}
      onPointerMove={(event) => {
        // Parallax só com mouse; no toque o globo segue sozinho.
        if (event.pointerType !== 'mouse') return;
        globe.current?.setPointer(
          event.clientX / window.innerWidth - 0.5,
          event.clientY / window.innerHeight - 0.5,
        );
      }}
      onPointerLeave={() => globe.current?.setPointer(0, 0)}
    >
      <HeroCanvas ref={canvasRef} />

      <GlobeStage aria-hidden="true">
        <canvas ref={globeRef} />
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
              {t(`mainSection.terms.${x.k}`)}
            </span>
          ))}
        </GlobeTerms>
      </GlobeStage>

      <MainContent>
        <HeroLeft>
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
      </MainContent>

      <Ticker>
        <div className="track">
          {[...TICKER, ...TICKER].map((it, i) => (
            <span className="it" key={i}>
              <span className="d" />
              {t(`mainSection.ticker.${it.k}`)}{' '}
              <span className={it.c}>{it.v}</span>
            </span>
          ))}
        </div>
      </Ticker>
    </MainContainer>
  );
};

// A constelação é pintada em canvas, onde variável CSS não chega. Estas
// funções devolvem o traço certo para o tema em uso: no claro o verde e o
// ciano fecham, senão o desenho sumiria sobre o fundo branco.
const isLightTheme = () =>
  typeof document !== 'undefined' &&
  document.documentElement.getAttribute('data-theme') === 'light';

const lineInk = (light: boolean, alpha: number) =>
  light ? `rgba(13,110,80,${alpha})` : `rgba(84,218,137,${alpha})`;

const dotInk = (light: boolean, alpha: number) =>
  light ? `rgba(14,116,144,${alpha})` : `rgba(34,211,238,${alpha})`;
