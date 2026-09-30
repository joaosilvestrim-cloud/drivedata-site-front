'use client';

// Peças reutilizáveis do site "clean".
import type { ReactNode } from 'react';
import { LOGOS, marqueeSpeed, optLogo } from './content';
import s from './clean.module.css';

export const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export type WallLogo = { src: string; name: string };

/**
 * Parede de clientes: logos coloridos em plaquinhas brancas, em duas fileiras que
 * andam em sentidos opostos. Pausa no hover/foco; com movimento reduzido fica
 * parada e mostra tudo. As cópias que fecham o laço ficam fora do leitor de tela.
 */
export function LogoWall({ title, logos = LOGOS }: { title: string; logos?: WallLogo[] }) {
  const rows = [logos.filter((_, i) => i % 2 === 0), logos.filter((_, i) => i % 2 === 1)].filter((r) => r.length);
  return (
    <div className={s.proof}>
      <h2 className={s.proofTitle}>{title}</h2>
      <div className={s.wall}>
        {rows.map((row, r) => {
          // fileira curta repete até cobrir a tela; depois dobra para o laço
          const reps = Math.max(1, Math.ceil(10 / row.length));
          const lap = Array.from({ length: reps }).flatMap(() => row);
          return (
            <div key={r} className={s.wallRow}>
              <ul className={`${s.wallTrack} ${r % 2 ? s.wallReverse : ''}`} style={marqueeSpeed(lap.length * 1.2)}>
                {[...lap, ...lap].map((l, i) => (
                  <li key={`${l.src}-${i}`} className={s.wallTile} aria-hidden={i >= row.length ? true : undefined}>
                    <img src={encodeURI(optLogo(l.src))} alt={i >= row.length ? '' : l.name} loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
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
