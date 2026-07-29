/**
 * Modelo de preços do simulador de economia (Portal DriveData sobre Fabric).
 *
 * Base real da Microsoft: a capacidade Fabric é cobrada em USD por CU/hora
 * (US$ 0,18 por CU/h em East US) e convertida para a moeda local — por isso o
 * simulador calcula em USD e aplica a cotação. Já a licença Power BI Pro/PPU é
 * precificada POR MERCADO (não é conversão), então cada país tem o seu valor.
 *
 * ⚠️ Números para conferir com a Microsoft antes de tratar como oficial:
 *    - REGIONS[].mult de Canada Central e West Europe são estimativas.
 *      Brazil South (US$ 0,23/CU/h) e East US (US$ 0,18) têm fonte.
 *    - FX (cotação) é fixa aqui; atualize quando variar muito.
 */

export type Country = 'BR' | 'CA'

// ── Constantes da Microsoft ───────────────────────────────────
export const USD_PER_CU_HOUR = 0.18   // East US, pay-as-you-go
export const HOURS_PER_MONTH = 730
export const RESERVED_FACTOR = 0.59   // reserva de 1 ano ≈ 41% de desconto

export interface Sku { id: string; cu: number; hint: string }
export const SKUS: Sku[] = [
  { id: 'F2',  cu: 2,  hint: 'times pequenos, poucos relatórios' },
  { id: 'F4',  cu: 4,  hint: 'operação enxuta' },
  { id: 'F8',  cu: 8,  hint: 'o mais comum em médias empresas' },
  { id: 'F16', cu: 16, hint: 'muitos relatórios e refresh pesado' },
  { id: 'F32', cu: 32, hint: 'operação grande' },
  { id: 'F64', cu: 64, hint: 'porte enterprise' },
]

export interface Region { id: string; label: string; mult: number; sourced: boolean }
export const REGIONS: Region[] = [
  { id: 'eastus',   label: 'East US',        mult: 1.00, sourced: true  },
  { id: 'brazil',   label: 'Brazil South',   mult: 1.28, sourced: true  },
  { id: 'canada',   label: 'Canada Central', mult: 1.06, sourced: false },
  { id: 'westeu',   label: 'West Europe',    mult: 1.22, sourced: false },
]

// Agenda da capacidade (só faz diferença no pay-as-you-go, que pode ser pausado).
export interface Schedule { id: string; label: string; hours: number }
export const SCHEDULES: Schedule[] = [
  { id: '24x7',      label: 'Ligada 24/7',              hours: 730 },
  { id: 'comercial', label: 'Horário comercial (12h)',  hours: 261 },  // 12h × 21,7 dias úteis
  { id: 'reduzida',  label: 'Jornada (8h úteis)',       hours: 174 },  // 8h × 21,7
]

// ── Parâmetros por país ───────────────────────────────────────
export interface CountryPricing {
  currency: string
  locale: string
  fx: number              // 1 USD em moeda local
  fxLabel: string
  proPrice: number        // Power BI Pro por usuário/mês (preço de mercado local)
  ppuPrice: number        // Power BI Premium Per User
  defaultRegion: string
  defaultUsers: number
}

export const COUNTRY: Record<Country, CountryPricing> = {
  BR: {
    currency: 'R$', locale: 'pt-BR',
    fx: 5.14, fxLabel: 'R$ 5,14',
    proPrice: 80, ppuPrice: 137,
    defaultRegion: 'brazil', defaultUsers: 200,
  },
  CA: {
    currency: 'CA$', locale: 'en-CA',
    fx: 1.37, fxLabel: 'CA$ 1,37',
    proPrice: 13.6, ppuPrice: 23.3,
    defaultRegion: 'canada', defaultUsers: 200,
  },
}

// ── Cálculo ───────────────────────────────────────────────────
export interface SimInput {
  users: number
  licensePrice: number      // por usuário/mês, na moeda local
  skuId: string
  regionId: string
  billing: 'reserved' | 'payg'
  scheduleId: string
  fx: number
}

export interface SimResult {
  licenseCost: number       // custo atual com licenças (moeda local)
  capacityCost: number      // custo da capacidade (moeda local)
  savings: number           // por mês
  savingsPct: number        // 0–100
  annualSavings: number
  breakEvenUsers: number    // a partir de quantos usuários a capacidade compensa
  capacityUsd: number       // capacidade em USD (transparência)
}

export function simulate(i: SimInput): SimResult {
  const sku    = SKUS.find(s => s.id === i.skuId) ?? SKUS[0]
  const region = REGIONS.find(r => r.id === i.regionId) ?? REGIONS[0]
  const sched  = SCHEDULES.find(s => s.id === i.scheduleId) ?? SCHEDULES[0]

  const usdPerHour = USD_PER_CU_HOUR * region.mult * sku.cu
  // A reserva é sempre 24/7 (o desconto exige compromisso); o PAYG segue a agenda.
  const capacityUsd = i.billing === 'reserved'
    ? usdPerHour * HOURS_PER_MONTH * RESERVED_FACTOR
    : usdPerHour * sched.hours

  const capacityCost = capacityUsd * i.fx
  const licenseCost  = Math.max(0, i.users) * Math.max(0, i.licensePrice)
  const savings      = licenseCost - capacityCost
  const savingsPct   = licenseCost > 0 ? (savings / licenseCost) * 100 : 0
  const breakEven    = i.licensePrice > 0 ? Math.ceil(capacityCost / i.licensePrice) : 0

  return {
    licenseCost, capacityCost, savings,
    savingsPct: Math.max(-999, savingsPct),
    annualSavings: savings * 12,
    breakEvenUsers: breakEven,
    capacityUsd,
  }
}

/** SKU sugerido pelo porte (regra de bolso — o dimensionamento real depende do uso). */
export function recommendSku(users: number): Sku {
  if (users < 50)   return SKUS[0]  // F2
  if (users < 150)  return SKUS[1]  // F4
  if (users < 400)  return SKUS[2]  // F8
  if (users < 900)  return SKUS[3]  // F16
  if (users < 2000) return SKUS[4]  // F32
  return SKUS[5]                    // F64
}

// ── Níveis (gamificação) ──────────────────────────────────────
// hex = tema escuro · hexLight = mesma cor fechada, para ter contraste no claro.
export interface Level { idx: number; key: string; label: string; min: number; hex: string; hexLight: string }
export const LEVELS: Level[] = [
  { idx: 0, key: 'none',    label: 'Ainda não compensa', min: -Infinity, hex: '#f87171', hexLight: '#b91c1c' },
  { idx: 1, key: 'balance', label: 'Empate técnico',     min: 0,  hex: '#fbbf24', hexLight: '#b45309' },
  { idx: 2, key: 'good',    label: 'Economia real',      min: 25, hex: '#38bdf8', hexLight: '#0369a1' },
  { idx: 3, key: 'high',    label: 'Economia alta',      min: 50, hex: '#54da89', hexLight: '#15803d' },
  { idx: 4, key: 'max',     label: 'Economia máxima',    min: 75, hex: '#22d3ee', hexLight: '#0e7490' },
]

export function levelOf(pct: number): Level {
  let out = LEVELS[0]
  for (const l of LEVELS) if (pct >= l.min) out = l
  return out
}

/** Quantos usuários faltam pra chegar no próximo nível (null se já está no topo). */
export function usersToNextLevel(i: SimInput, current: Level): { users: number; level: Level } | null {
  const next = LEVELS.find(l => l.idx === current.idx + 1)
  if (!next || i.licensePrice <= 0) return null
  const r = simulate(i)
  // custo fixo → pct = 1 - (cap / (users × preço)). Isola users para pct alvo.
  const target = next.min / 100
  const needed = Math.ceil(r.capacityCost / (i.licensePrice * (1 - target)))
  const delta = needed - i.users
  return delta > 0 ? { users: delta, level: next } : null
}
