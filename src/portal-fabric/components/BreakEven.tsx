'use client';

import styled from '@emotion/styled';
import { portalTheme as tk } from '../theme';

/**
 * Gráfico de ponto de equilíbrio: a reta das licenças (cresce com o número de
 * usuários) cruzando a linha da capacidade (fixa). Mostra a partir de quantos
 * usuários o modelo de capacidade passa a ser mais barato, e onde a empresa
 * está hoje. SVG puro, sem biblioteca.
 */

const Wrap = styled.div`
  position: relative;
  width: 100%;

  svg { display: block; width: 100%; height: auto; overflow: visible; }

  /* As cores vêm por CSS (e não por atributo do SVG) porque var() só é resolvido
     em propriedades CSS, num atributo stroke="var(--x)" o navegador ignora. */
  .be-cap-line  { stroke: var(--dd-primary); }
  .be-node      { fill: var(--dd-bg); stroke: #fff; }
  .be-me        { stroke: var(--dd-bg); }
  .be-me.is-saving     { fill: var(--dd-primary); }
  .be-me.is-not-saving { fill: #f87171; }
  .be-grid      { stroke: var(--dd-border); }
  .be-axis      { stroke: var(--dd-border-active); }
  .be-guide     { stroke: var(--dd-text-muted); }
  .be-label     { fill: var(--dd-text-2); }
  .be-me-label  { fill: var(--dd-text); }
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 14px;
  font-family: ${tk.fonts.body};
  font-size: 11.5px;
  color: ${tk.colors.textSecondary};

  span { display: inline-flex; align-items: center; gap: 6px; }
  i { width: 14px; height: 2px; border-radius: 2px; display: inline-block; }
`;

interface BreakEvenLabels {
  equilibrium: string  // "equilíbrio: {n} usuários"
  you: string
  users: string        // "{n} usuários"
  licenses: string     // "Licenças individuais ({price}/usuário)"
  capacity: string
}
interface Props {
  users: number
  licensePrice: number
  capacityCost: number
  breakEvenUsers: number
  fmt: (n: number) => string
  labels: BreakEvenLabels
}
const tpl = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))

export function BreakEven({ users, licensePrice, capacityCost, breakEvenUsers, fmt, labels }: Props) {
  // Janela do eixo X: cobre o ponto de equilíbrio e a posição atual com folga.
  const maxUsers = Math.max(users * 1.6, breakEvenUsers * 2, 40)
  const maxCost  = Math.max(maxUsers * licensePrice, capacityCost * 1.4, 1)

  const W = 560, H = 220, PAD_L = 8, PAD_B = 26, PAD_T = 14

  const x = (u: number) => PAD_L + (u / maxUsers) * (W - PAD_L - 8)
  const y = (c: number) => H - PAD_B - (c / maxCost) * (H - PAD_B - PAD_T)

  const licEnd  = { x: x(maxUsers), y: y(maxUsers * licensePrice) }
  const capY    = y(capacityCost)
  const crossX  = breakEvenUsers <= maxUsers ? x(breakEvenUsers) : null
  const meX     = x(users)
  const meY     = y(users * licensePrice)
  const saving  = users * licensePrice > capacityCost

  return (
    <Wrap>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfico de ponto de equilíbrio">
        <defs>
          <linearGradient id="be-lic" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#f87171"/>
          </linearGradient>
          <linearGradient id="be-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#54da89" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#54da89" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* grade */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} className="be-grid" x1={PAD_L} x2={W - 8}
            y1={y(maxCost * f)} y2={y(maxCost * f)} strokeWidth="1"/>
        ))}
        <line className="be-axis" x1={PAD_L} x2={W - 8} y1={H - PAD_B} y2={H - PAD_B} strokeWidth="1"/>

        {/* área de economia (entre as duas linhas, depois do cruzamento) */}
        {crossX !== null && (
          <polygon
            points={`${crossX},${capY} ${licEnd.x},${licEnd.y} ${licEnd.x},${capY}`}
            fill="url(#be-fill)"
          />
        )}

        {/* linha da capacidade (fixa) */}
        <line className="be-cap-line" x1={PAD_L} x2={W - 8} y1={capY} y2={capY}
          strokeWidth="2.5" strokeLinecap="round"/>

        {/* linha das licenças (cresce com usuários) */}
        <line x1={x(0)} y1={y(0)} x2={licEnd.x} y2={licEnd.y}
          stroke="url(#be-lic)" strokeWidth="2.5" strokeLinecap="round"/>

        {/* ponto de equilíbrio */}
        {crossX !== null && (
          <>
            <line className="be-guide" x1={crossX} x2={crossX} y1={PAD_T} y2={H - PAD_B}
              strokeWidth="1" strokeDasharray="3 4"/>
            <circle className="be-node" cx={crossX} cy={capY} r="5" strokeWidth="2"/>
            <text className="be-label" x={crossX} y={PAD_T - 2} textAnchor="middle"
              fontSize="10.5" fontFamily="system-ui, sans-serif">
              {tpl(labels.equilibrium, { n: breakEvenUsers })}
            </text>
          </>
        )}

        {/* posição atual */}
        <circle className={`be-me ${saving ? 'is-saving' : 'is-not-saving'}`}
          cx={meX} cy={meY} r="6" strokeWidth="2.5"/>
        <text className="be-me-label" x={Math.min(meX, W - 60)} y={Math.max(meY - 13, PAD_T + 10)}
          textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
          {labels.you}
        </text>

        {/* eixo X */}
        <text className="be-label" x={PAD_L} y={H - 8} fontSize="10" fontFamily="system-ui, sans-serif">0</text>
        <text className="be-label" x={W - 8} y={H - 8} textAnchor="end" fontSize="10" fontFamily="system-ui, sans-serif">
          {tpl(labels.users, { n: Math.round(maxUsers) })}
        </text>
      </svg>

      <Legend>
        <span><i style={{ background: '#f87171' }}/> {tpl(labels.licenses, { price: fmt(licensePrice) })}</span>
        <span><i style={{ background: tk.colors.primary }}/> {labels.capacity}</span>
      </Legend>
    </Wrap>
  )
}
