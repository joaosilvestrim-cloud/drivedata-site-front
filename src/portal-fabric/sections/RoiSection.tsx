'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { SITE_COUNTRY } from '@/common/config/site';
import { useThemeMode } from '@/common/theme/useThemeMode';
import { portalTheme as tk } from '../theme';
import { Section, Inner, Glow, SectionTitle, Subtitle, HeadCentered } from '../components/primitives';
import { BreakEven } from '../components/BreakEven';
import { usePortal } from '../usePortal';
import {
  COUNTRY, SKUS, REGIONS, SCHEDULES, LEVELS,
  simulate, levelOf, usersToNextLevel, recommendSku,
  USD_PER_CU_HOUR, type Country,
} from '../pricing';

// ── contador animado ──────────────────────────────────────────
function useCountUp(value: number, ms = 700) {
  const [display, setDisplay] = useState(value)
  const from = useRef(value)
  const raf  = useRef<number | null>(null)

  useEffect(() => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { from.current = value; setDisplay(value); return }

    const start = performance.now()
    const a = from.current
    let done = false
    const finish = () => { if (!done) { done = true; from.current = value; setDisplay(value) } }

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(a + (value - a) * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else finish()
    }
    raf.current = requestAnimationFrame(tick)

    // Rede de segurança: com a aba em segundo plano o requestAnimationFrame não
    // roda e o número ficaria congelado no valor antigo. O timer garante o final.
    const safety = setTimeout(finish, ms + 150)

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      clearTimeout(safety)
    }
  }, [value, ms])

  return display
}

// ── estilos ───────────────────────────────────────────────────
const pulse = keyframes`
  0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(84,218,137,0.5); }
  50%  { transform: scale(1.04); box-shadow: 0 0 0 16px rgba(84,218,137,0); }
  100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(84,218,137,0); }
`;

const Board = styled.div<{ accent: string }>`
  position: relative;
  border-radius: 24px;
  border: 1px solid ${({ accent }) => accent}55;
  background:
    radial-gradient(120% 100% at 50% 0%, ${({ accent }) => accent}1f 0%, transparent 60%),
    ${tk.colors.bgCard};
  backdrop-filter: blur(16px);
  padding: 34px 28px;
  text-align: center;
  overflow: hidden;
  transition: border-color .5s ${tk.easing};

  @media (max-width: 640px) { padding: 26px 18px; }
`;

const LevelPill = styled.div<{ accent: string; celebrate: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid ${({ accent }) => accent}66;
  background: ${({ accent }) => accent}1a;
  color: ${({ accent }) => accent};
  font-family: ${tk.fonts.heading};
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  animation: ${({ celebrate }) => celebrate ? pulse : 'none'} 0.9s ${tk.easing};
`;

const Meter = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
`;

const Seg = styled.span<{ isOn: boolean; accent: string }>`
  width: 44px;
  height: 5px;
  border-radius: 999px;
  background: ${({ isOn, accent }) => isOn ? accent : tk.colors.surfaceStrong};
  box-shadow: ${({ isOn, accent }) => isOn ? `0 0 12px ${accent}88` : 'none'};
  transition: background .4s ${tk.easing}, box-shadow .4s ${tk.easing};

  @media (max-width: 480px) { width: 30px; }
`;

const BigLabel = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${tk.colors.textMuted};
  margin-top: 22px;
`;

const Big = styled.p<{ accent: string }>`
  font-family: ${tk.fonts.heading};
  font-size: clamp(44px, 8vw, 76px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -2px;
  margin-top: 6px;
  color: ${({ accent }) => accent};
  font-variant-numeric: tabular-nums;
`;

const SubLine = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 14.5px;
  color: ${tk.colors.textSecondary};
  margin-top: 10px;

  strong { color: ${tk.colors.textPrimary}; font-variant-numeric: tabular-nums; }
`;

const NextGoal = styled.div`
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${tk.fonts.body};
  font-size: 12.5px;
  color: ${tk.colors.textSecondary};
  background: ${tk.colors.surfaceSubtle};
  border: 1px solid ${tk.colors.border};
  border-radius: 999px;
  padding: 7px 15px;

  b { color: ${tk.colors.textPrimary}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 22px;
  margin-top: 22px;
  align-items: start;

  @media (max-width: 940px) { grid-template-columns: 1fr; }
`;

const Panel = styled.div`
  border-radius: 20px;
  border: 1px solid ${tk.colors.border};
  background: ${tk.colors.bgCard};
  backdrop-filter: blur(14px);
  padding: 24px;
`;

const PanelTitle = styled.h3`
  font-family: ${tk.fonts.heading};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${tk.colors.textMuted};
  margin-bottom: 20px;
`;

const Field = styled.div`
  margin-bottom: 20px;

  &:last-of-type { margin-bottom: 0; }
`;

const FLabel = styled.label`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  font-family: ${tk.fonts.body};
  font-size: 12.5px;
  font-weight: 600;
  color: ${tk.colors.textSecondary};
  margin-bottom: 9px;

  b {
    font-family: ${tk.fonts.heading};
    font-size: 17px;
    color: ${tk.colors.textPrimary};
    font-variant-numeric: tabular-nums;
  }
`;

const Range = styled.input`
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: ${tk.colors.surfaceStrong};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: ${tk.gradients.brand};
    border: 3px solid ${tk.colors.bg};
    box-shadow: 0 0 0 1px ${tk.colors.borderActive}, 0 2px 10px rgba(0,0,0,.5);
    cursor: grab;
  }
  &::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.1); }
  &::-moz-range-thumb {
    width: 20px; height: 20px; border-radius: 50%;
    background: #54da89; border: 3px solid ${tk.colors.bg}; cursor: grab;
  }
`;

const Segmented = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 6px;
  padding: 4px;
  border-radius: 12px;
  background: ${tk.colors.surfaceSubtle};
  border: 1px solid ${tk.colors.border};
`;

const SegBtn = styled.button<{ isOn: boolean }>`
  padding: 9px 8px;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  font-family: ${tk.fonts.heading};
  font-size: 12.5px;
  font-weight: 700;
  transition: all .2s ${tk.easing};
  background: ${({ isOn }) => isOn ? tk.gradients.brand : 'transparent'};
  color: ${({ isOn }) => isOn ? tk.colors.onBrand : tk.colors.textSecondary};

  &:hover { color: ${({ isOn }) => isOn ? tk.colors.onBrand : tk.colors.textPrimary}; }
`;

const SkuRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;

  @media (max-width: 420px) { grid-template-columns: repeat(3, 1fr); }
`;

const SkuBtn = styled.button<{ isOn: boolean; rec: boolean }>`
  position: relative;
  padding: 11px 4px;
  border-radius: 11px;
  cursor: pointer;
  font-family: ${tk.fonts.heading};
  font-size: 13px;
  font-weight: 700;
  transition: all .2s ${tk.easing};
  border: 1px solid ${({ isOn, rec }) => isOn ? 'transparent' : rec ? tk.colors.borderActive : tk.colors.border};
  background: ${({ isOn }) => isOn ? tk.gradients.brand : tk.colors.surfaceSubtle};
  color: ${({ isOn }) => isOn ? tk.colors.onBrand : tk.colors.textSecondary};

  &:hover { border-color: ${({ isOn }) => isOn ? 'transparent' : tk.colors.borderActive}; }

  &::after {
    content: ${({ rec, isOn }) => rec && !isOn ? "'★'" : "''"};
    position: absolute;
    top: -6px; right: -4px;
    font-size: 10px;
    color: ${tk.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  appearance: none;
  background: ${tk.colors.surfaceSubtle};
  border: 1px solid ${tk.colors.border};
  border-radius: 11px;
  padding: 11px 14px;
  color: ${tk.colors.textPrimary};
  font-family: ${tk.fonts.heading};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline: none;

  &:focus { border-color: ${tk.colors.borderActive}; }
  option { background: ${tk.colors.bg}; color: ${tk.colors.textPrimary}; }
`;

const NumInput = styled.input`
  width: 100%;
  background: ${tk.colors.surfaceSubtle};
  border: 1px solid ${tk.colors.border};
  border-radius: 11px;
  padding: 11px 14px;
  color: ${tk.colors.textPrimary};
  font-family: ${tk.fonts.heading};
  font-size: 15px;
  font-weight: 700;
  outline: none;
  font-variant-numeric: tabular-nums;

  &:focus { border-color: ${tk.colors.borderActive}; }
`;

const Hint = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 11px;
  color: ${tk.colors.textMuted};
  margin-top: 7px;
  line-height: 1.5;
`;

const Rows = styled.div`
  margin-top: 20px;
  border-top: 1px solid ${tk.colors.border};
`;

const Row = styled.div<{ strong?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid ${tk.colors.border};
  font-family: ${tk.fonts.body};
  font-size: 13.5px;
  color: ${tk.colors.textSecondary};

  b {
    font-family: ${tk.fonts.heading};
    font-size: ${({ strong }) => strong ? '17px' : '15px'};
    color: ${({ strong }) => strong ? tk.colors.primary : tk.colors.textPrimary};
    font-variant-numeric: tabular-nums;
  }
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 22px;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const EqCard = styled.div`
  border-radius: 14px;
  border: 1px solid ${tk.colors.border};
  background: ${tk.colors.surfaceSubtle};
  padding: 16px;

  strong {
    display: block;
    font-family: ${tk.fonts.heading};
    font-size: 21px;
    font-weight: 800;
    color: ${tk.colors.primary};
    font-variant-numeric: tabular-nums;
  }
  span {
    display: block;
    font-family: ${tk.fonts.body};
    font-size: 12px;
    line-height: 1.5;
    color: ${tk.colors.textSecondary};
    margin-top: 6px;
  }
`;

const Foot = styled.p`
  font-family: ${tk.fonts.body};
  font-size: 11px;
  line-height: 1.6;
  color: ${tk.colors.textMuted};
  margin-top: 20px;
  text-align: center;
`;

const CtaWrap = styled.div`
  text-align: center;
  margin-top: 26px;
`;

const Cta = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 15px 32px;
  border: none;
  border-radius: 999px;
  background: ${tk.gradients.brand};
  color: ${tk.colors.onBrand};
  font-family: ${tk.fonts.heading};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${tk.shadows.glow};
  transition: transform .2s ${tk.easing}, box-shadow .2s ${tk.easing};

  &:hover { transform: translateY(-2px); box-shadow: ${tk.shadows.glowStrong}; }
`;

// ── seção ─────────────────────────────────────────────────────
export function RoiSection() {
  const { copy } = usePortal()
  const { openTypebot } = useTypebot()
  const r = copy.roi
  const cfg = COUNTRY[SITE_COUNTRY as Country] ?? COUNTRY.BR

  const [users, setUsers]       = useState(cfg.defaultUsers)
  const [licenseKind, setKind]  = useState<'pro' | 'ppu'>('pro')
  const [licensePrice, setLic]  = useState(cfg.proPrice)
  const [regionId, setRegion]   = useState(cfg.defaultRegion)
  const [skuId, setSku]         = useState('F8')
  const [billing, setBilling]   = useState<'reserved' | 'payg'>('reserved')
  const [scheduleId, setSched]  = useState('24x7')

  const fmt = useMemo(() => (n: number) =>
    `${cfg.currency} ${new Intl.NumberFormat(cfg.locale, { maximumFractionDigits: 0 }).format(Math.round(n))}`,
  [cfg])

  const input = { users, licensePrice, skuId, regionId, billing, scheduleId, fx: cfg.fx }
  const sim   = useMemo(() => simulate(input), [users, licensePrice, skuId, regionId, billing, scheduleId, cfg.fx]) // eslint-disable-line react-hooks/exhaustive-deps
  const level = levelOf(sim.savingsPct)
  const { mode } = useThemeMode()
  // No claro o verde/ciano da marca perdem contraste, usa a variante fechada.
  const accentOf = (l: typeof level) => (mode === 'light' ? l.hexLight : l.hex)
  const accent = accentOf(level)
  const next  = usersToNextLevel(input, level)
  const rec   = recommendSku(users)
  const region = REGIONS.find(x => x.id === regionId)!
  const sku    = SKUS.find(x => x.id === skuId)!

  // Comemora quando sobe de nível.
  const [celebrate, setCelebrate] = useState(false)
  const prevLevel = useRef(level.idx)
  useEffect(() => {
    if (level.idx > prevLevel.current) {
      setCelebrate(true)
      const id = setTimeout(() => setCelebrate(false), 1000)
      prevLevel.current = level.idx
      return () => clearTimeout(id)
    }
    prevLevel.current = level.idx
  }, [level.idx])

  const shown = useCountUp(Math.max(0, sim.savings))
  const positive = sim.savings > 0

  // Troca o preço quando muda Pro ↔ PPU (mantém edição manual se o usuário mexeu).
  function switchKind(k: 'pro' | 'ppu') {
    setKind(k)
    setLic(k === 'pro' ? cfg.proPrice : cfg.ppuPrice)
  }

  const proYear = sim.annualSavings > 0 && licensePrice > 0
    ? Math.floor(sim.annualSavings / (licensePrice * 12)) : 0
  const capMonths = sim.annualSavings > 0 && sim.capacityCost > 0
    ? Math.floor(sim.annualSavings / sim.capacityCost) : 0

  return (
    <Section id="roi">
      <Glow y="-10%" x="60%" />
      <Inner>
        <HeadCentered>
          <SectionTitle>{r.title}</SectionTitle>
          <Subtitle>{r.subtitle}</Subtitle>
        </HeadCentered>

        {/* Placar */}
        <Board accent={accent}>
          <LevelPill accent={accent} celebrate={celebrate}>
            Nível {Math.max(level.idx, 0)} · {level.label}
          </LevelPill>

          <Meter>
            {LEVELS.filter(l => l.idx > 0).map(l => (
              <Seg key={l.key} isOn={level.idx >= l.idx} accent={accent}/>
            ))}
          </Meter>

          <BigLabel>{positive ? r.monthlyLabel : 'Diferença mensal'}</BigLabel>
          <Big accent={accent}>
            {positive ? fmt(shown) : `− ${fmt(Math.abs(sim.savings))}`}
          </Big>
          <SubLine>
            {positive ? (
              <>
                <strong>{Math.round(sim.savingsPct)}%</strong> de redução ·{' '}
                <strong>{fmt(sim.annualSavings)}</strong> por ano
              </>
            ) : (
              <>Neste cenário a capacidade ainda custa mais que as licenças.</>
            )}
          </SubLine>

          {next && (
            <NextGoal>
              <span style={{ color: accentOf(next.level) }}>▲</span>
              Mais <b>{next.users}</b> usuário{next.users !== 1 ? 's' : ''} e você chega em <b>{next.level.label}</b>
            </NextGoal>
          )}
          {!next && positive && (
            <NextGoal><span style={{ color: accent }}>★</span> Você está no nível máximo de economia</NextGoal>
          )}
        </Board>

        <Grid>
          {/* Controles */}
          <Panel>
            <PanelTitle>Seu cenário</PanelTitle>

            <Field>
              <FLabel htmlFor="pf-users">
                {r.usersLabel} <b>{users}</b>
              </FLabel>
              <Range id="pf-users" type="range" min={10} max={3000} step={10}
                value={users} onChange={e => setUsers(Number(e.target.value))}/>
              <Hint>Quantas pessoas só consomem relatórios (não criam).</Hint>
            </Field>

            <Field>
              <FLabel>Licença que você paga hoje</FLabel>
              <Segmented>
                <SegBtn isOn={licenseKind === 'pro'} onClick={() => switchKind('pro')}>Power BI Pro</SegBtn>
                <SegBtn isOn={licenseKind === 'ppu'} onClick={() => switchKind('ppu')}>Premium (PPU)</SegBtn>
              </Segmented>
              <div style={{ marginTop: 10 }}>
                <NumInput type="number" min={0} step={1} value={licensePrice}
                  onChange={e => setLic(Math.max(0, Number(e.target.value) || 0))}/>
              </div>
              <Hint>{cfg.currency} por usuário/mês. Preço de mercado do seu país, dá pra ajustar pelo seu contrato.</Hint>
            </Field>

            <Field>
              <FLabel>Capacidade Fabric (SKU)</FLabel>
              <SkuRow>
                {SKUS.map(s => (
                  <SkuBtn key={s.id} isOn={skuId === s.id} rec={rec.id === s.id}
                    onClick={() => setSku(s.id)} title={s.hint}>
                    {s.id}
                  </SkuBtn>
                ))}
              </SkuRow>
              <Hint>
                {rec.id === skuId
                  ? <>★ Recomendado para {users} usuários, {sku.hint}.</>
                  : <>★ Para {users} usuários, o mais comum é o <strong style={{ color: tk.colors.primary }}>{rec.id}</strong>. O dimensionamento final depende do seu uso real.</>}
              </Hint>
            </Field>

            <Field>
              <FLabel>Região do Azure</FLabel>
              <Select value={regionId} onChange={e => setRegion(e.target.value)}>
                {REGIONS.map(x => (
                  <option key={x.id} value={x.id}>
                    {x.label}{x.mult === 1 ? ' · base' : ` · +${Math.round((x.mult - 1) * 100)}%`}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <FLabel>Forma de contratação</FLabel>
              <Segmented>
                <SegBtn isOn={billing === 'reserved'} onClick={() => setBilling('reserved')}>Reserva 1 ano</SegBtn>
                <SegBtn isOn={billing === 'payg'} onClick={() => setBilling('payg')}>Pago pelo uso</SegBtn>
              </Segmented>
              <Hint>
                {billing === 'reserved'
                  ? 'Compromisso de 1 ano, ligada 24/7, com ~41% de desconto.'
                  : 'Sem compromisso e pode pausar, você paga só as horas ligadas.'}
              </Hint>
            </Field>

            {billing === 'payg' && (
              <Field>
                <FLabel>Capacidade ligada</FLabel>
                <Select value={scheduleId} onChange={e => setSched(e.target.value)}>
                  {SCHEDULES.map(s => <option key={s.id} value={s.id}>{s.label}, {s.hours}h/mês</option>)}
                </Select>
                <Hint>Pausar a capacidade fora do expediente derruba bastante a conta.</Hint>
              </Field>
            )}
          </Panel>

          {/* Resultado + gráfico */}
          <Panel>
            <PanelTitle>Ponto de equilíbrio</PanelTitle>
            <BreakEven
              users={users}
              licensePrice={licensePrice}
              capacityCost={sim.capacityCost}
              breakEvenUsers={sim.breakEvenUsers}
              fmt={fmt}
            />

            <Rows>
              <Row>
                Hoje · {users} × {fmt(licensePrice)}
                <b>{fmt(sim.licenseCost)}</b>
              </Row>
              <Row>
                Portal DriveData · {sku.id} em {region.label}
                <b>{fmt(sim.capacityCost)}</b>
              </Row>
              <Row strong>
                {positive ? 'Você economiza' : 'Diferença'}
                <b style={{ color: accent }}>
                  {positive ? fmt(sim.savings) : `− ${fmt(Math.abs(sim.savings))}`}
                </b>
              </Row>
            </Rows>

            <Hint style={{ marginTop: 14 }}>
              A capacidade custa o mesmo com 10 ou 10.000 usuários. Acima de{' '}
              <strong style={{ color: tk.colors.primary }}>{sim.breakEvenUsers} usuários</strong> ela já sai mais barata que as licenças.
            </Hint>
          </Panel>
        </Grid>

        {/* Equivalências */}
        {positive && (
          <Cards>
            <EqCard>
              <strong>{cfg.currency} 0</strong>
              <span>é quanto custa cada novo usuário no portal. Hoje, cada um custa {fmt(licensePrice)}/mês.</span>
            </EqCard>
            <EqCard>
              <strong>{proYear}</strong>
              <span>licenças {licenseKind === 'pro' ? 'Pro' : 'PPU'} por um ano inteiro é o que sua economia anual paga.</span>
            </EqCard>
            <EqCard>
              <strong>{capMonths} meses</strong>
              <span>de capacidade {sku.id} saem de graça com o que você economiza em um ano.</span>
            </EqCard>
          </Cards>
        )}

        <Foot>
          Base do cálculo: capacidade Fabric a US$ {USD_PER_CU_HOUR.toFixed(2)} por CU/hora em East US
          {region.mult !== 1 && <> (+{Math.round((region.mult - 1) * 100)}% em {region.label})</>},
          {billing === 'reserved' ? ' reserva de 1 ano com ~41% de desconto' : ` ${SCHEDULES.find(s => s.id === scheduleId)?.hours}h ligadas no mês`},
          convertida a {cfg.fxLabel} por dólar. {r.note}
        </Foot>

        <CtaWrap>
          <Cta type="button" onClick={openTypebot}>
            Quero validar esse cenário com um especialista →
          </Cta>
        </CtaWrap>
      </Inner>
    </Section>
  )
}
