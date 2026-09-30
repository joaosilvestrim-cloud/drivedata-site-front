'use client';

// Peças reutilizáveis do site "clean".
import type { ReactNode } from 'react';
import { LOGOS, marqueeSpeed } from './content';
import s from './clean.module.css';

export const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/** Faixa contínua de logos de clientes. Pausa no hover/foco; parada com movimento reduzido. */
export function LogoMarquee({ title }: { title: string }) {
  return (
    <div className={s.proof}>
      <h2 className={s.proofTitle}>{title}</h2>
      <div className={s.marquee}>
        <ul className={s.marqueeTrack} style={marqueeSpeed(LOGOS.length)}>
          {[...LOGOS, ...LOGOS].map((l, i) => (
            <li key={`${l.name}-${i}`} aria-hidden={i >= LOGOS.length ? true : undefined}>
              <img src={encodeURI(l.src)} alt={i >= LOGOS.length ? '' : l.name} loading="lazy" style={{ height: l.h }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Cabeçalho de seção: título grande à esquerda e apoio à direita. */
export function SectionHead({ id, title, children }: { id: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className={s.sectionHead} data-reveal>
      <h2 id={id} className={s.h2}>{title}</h2>
      {children && <p className={s.muted}>{children}</p>}
    </div>
  );
}

/** Topo de página interna: título de exibição e texto de apoio, alinhados à esquerda. */
export function PageHero({ title, lead, children }: { title: ReactNode; lead: ReactNode; children?: ReactNode }) {
  return (
    <section className={s.pageHero} aria-labelledby="page-titulo">
      <div className={s.wrap}>
        <h1 id="page-titulo" className={`${s.display} ${s.displayLeft}`}>{title}</h1>
        <div className={s.pageHeroFoot}>
          <p className={s.lead}>{lead}</p>
          {children && <div className={s.actions}>{children}</div>}
        </div>
      </div>
    </section>
  );
}
