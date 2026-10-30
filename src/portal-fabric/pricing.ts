/**
 * Modelo de preços do simulador de economia (Portal DriveData sobre Fabric).
 *
 * Base real da Microsoft: a capacidade Fabric é cobrada em USD por CU/hora
 * (US$ 0,18 por CU/h em East US) e convertida para a moeda local — por isso o
 * simulador calcula em USD e aplica a cotação. Já a licença Power BI Pro/PPU é
 * precificada POR MERCADO (não é conversão), então cada país tem o seu valor.
 *
 * Conferido em 30/09/2026 na API pública de preços do Azure
 * (prices.azure.com, serviceName 'Microsoft Fabric', pay-as-you-go por CU/hora):
 * East US US$ 0,18 · Brazil South US$ 0,28 · Canada Central US$ 0,20 ·
 * West Europe US$ 0,22. Reserva de 1 ano: US$ 938 por CU/ano em East US,
 * ou seja 0,595 do pay-as-you-go. Licenças Pro/PPU: páginas oficiais de preço
 * do Power BI no Brasil e no Canadá. A cotação é fixa; atualize quando variar muito.
 *
 * Auditoria de 30/10/2026: a comparação passou a ser a mesma das propostas. De um
 * lado, Pro para todos. Do outro, a mensalidade do Portal por usuário + as contas
 * Pro de quem publica (elas continuam necessárias) + a capacidade. Antes o lado do
 * portal só tinha a capacidade e a economia saía maior que a real. Cotação BR
 * ajustada para a da tabela da Microsoft (R$ 5,22 em 29/10/2026: Brazil South
 * R$ 1,4614 por CU/hora e R$ 7.609,89 por CU/ano reservado).
 */

export type Country = 'BR' | 'CA'

// ── Constantes da Microsoft ───────────────────────────────────
export const USD_PER_CU_HOUR = 0.18   // East US, pay-as-you-go
export const HOURS_PER_MONTH = 730
export const RESERVED_FACTOR = 0.595  // reserva de 1 ano ≈ 40% de desconto (938 / 12 / (0,18 × 730))

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
  { id: 'eastus',   label: 'East US',        mult: 1,           sourced: true },
  { id: 'brazil',   label: 'Brazil South',   mult: 0.28 / 0.18, sourced: true },
  { id: 'canada',   label: 'Canada Central', mult: 0.20 / 0.18, sourced: true },
  { id: 'westeu',   label: 'West Europe',    mult: 0.22 / 0.18, sourced: true },
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
  portalFee: number | null  // mensalidade do Portal por usuário, sem impostos (null = ainda sem preço publicado)
  defaultRegion: string
  defaultUsers: number
}

export const COUNTRY: Record<Country, CountryPricing> = {
  BR: {
    currency: 'R$', locale: 'pt-BR',
    fx: 5.22, fxLabel: 'R$ 5,22',
    proPrice: 80.2, ppuPrice: 137.4, portalFee: 5,
    defaultRegion: 'brazil', defaultUsers: 200,
  },
  CA: {
    currency: 'CA$', locale: 'en-CA',
    fx: 1.42, fxLabel: 'CA$ 1.42',
    proPrice: 19, ppuPrice: 32.6, portalFee: null,
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
  portalFee: number         // mensalidade do Portal por usuário (0 quando não publicada)
  publishers: number        // contas Pro de quem publica relatórios
  publisherPrice: number    // preço da conta Pro de quem publica
}

export interface SimResult {
  licenseCost: number       // custo atual com licenças (moeda local)
  capacityCost: number      // custo da capacidade (moeda local)
  portalCost: number        // mensalidade do Portal (usuários × tarifa)
  publisherCost: number     // contas Pro de quem publica
  fixedCost: number         // o que não depende de usuários: capacidade + contas de quem publica
  totalPortal: number       // tudo do lado do portal
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

  const users         = Math.max(0, i.users)
  const capacityCost  = capacityUsd * i.fx
  const licenseCost   = users * Math.max(0, i.licensePrice)
  const portalCost    = users * Math.max(0, i.portalFee)
  const publisherCost = Math.max(0, i.publishers) * Math.max(0, i.publisherPrice)
  const fixedCost     = capacityCost + publisherCost
  const totalPortal   = fixedCost + portalCost
  const savings       = licenseCost - totalPortal
  const savingsPct    = licenseCost > 0 ? (savings / licenseCost) * 100 : 0
  // cada usuário economiza (licença − tarifa); o fixo se paga a partir daí
  const margin        = i.licensePrice - i.portalFee
  const breakEven     = margin > 0 ? Math.ceil(fixedCost / margin) : 0

  return {
    licenseCost, capacityCost, portalCost, publisherCost, fixedCost, totalPortal, savings,
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
  // pct = 1 − (fixo + tarifa × u) / (u × licença). Isola u para o pct alvo.
  const target = next.min / 100
  const perUser = i.licensePrice * (1 - target) - i.portalFee
  if (perUser <= 0) return null
  const needed = Math.ceil(r.fixedCost / perUser)
  const delta = needed - i.users
  return delta > 0 ? { users: delta, level: next } : null
}

// ── Dimensionamento da capacidade ─────────────────────────────
// Limites por modelo semântico da Microsoft (Fabric, "Power BI Premium capacity
// limits" por SKU): memória máxima por modelo, conexões DirectQuery por modelo e
// atualizações em paralelo.
export interface SkuLimits { memoryGb: number; dqConnections: number; parallelRefresh: number }
export const SKU_LIMITS: Record<string, SkuLimits> = {
  F2:  { memoryGb: 3,  dqConnections: 5,  parallelRefresh: 1 },
  F4:  { memoryGb: 3,  dqConnections: 5,  parallelRefresh: 2 },
  F8:  { memoryGb: 3,  dqConnections: 10, parallelRefresh: 5 },
  F16: { memoryGb: 5,  dqConnections: 10, parallelRefresh: 10 },
  F32: { memoryGb: 10, dqConnections: 10, parallelRefresh: 20 },
  F64: { memoryGb: 25, dqConnections: 50, parallelRefresh: 40 },
}

// Premissas do cálculo (as mesmas das propostas). O consumo real sai da medição no
// Capacity Metrics; aqui é a estimativa para escolher por onde começar.
export const SIZING = {
  pagesPerOpen: 1.8,        // páginas vistas por abertura de relatório
  cuSecPerPage: 15,         // CU-segundos por página (faixa típica 5 a 30)
  peakFactor: 3,            // pico = 3 vezes a média da janela de uso
  refreshCuSec: { light: 500, medium: 1000, heavy: 2000 } as Record<RefreshWeight, number>,
  target: 0.7,              // acima de 70% de uso, a recomendação sobe um tamanho
  refreshMemoryFactor: 2,   // ao atualizar, o modelo ocupa cerca do dobro
}
export type RefreshWeight = 'light' | 'medium' | 'heavy'

export interface SizingInput {
  people: number
  opensPerPerson: number    // aberturas por pessoa por dia útil
  hoursPerDay: number       // janela em que as pessoas usam
  models: number            // modelos semânticos que atualizam
  refreshesPerDay: number   // atualizações por dia de cada modelo
  weight: RefreshWeight
  largestModelGb: number
  directQuery: boolean
}
export interface SkuFit {
  sku: Sku
  peakPct: number           // ocupação no pico de consulta
  dailyPct: number          // ocupação do dia (atualização + consulta) sobre a capacidade de 24 h
  memoryOk: boolean
  dqOk: boolean
  fits: boolean             // cabe (até 100%)
  comfortable: boolean      // cabe com folga (até 70%)
}
export interface SizingResult {
  opensPerDay: number
  peakCuSecPerMin: number
  refreshCuSecPerDay: number
  queryCuSecPerDay: number
  fits: SkuFit[]
  minimum: Sku | null       // menor que cabe
  recommended: Sku | null   // menor com folga
  driver: 'refresh' | 'query' | 'memory' | 'directquery'
}

export function sizeCapacity(i: SizingInput): SizingResult {
  const opensPerDay = Math.max(0, i.people) * Math.max(0, i.opensPerPerson)
  const minutes = Math.max(1, i.hoursPerDay) * 60
  const peakCuSecPerMin = (opensPerDay / minutes) * SIZING.peakFactor * SIZING.pagesPerOpen * SIZING.cuSecPerPage
  const queryCuSecPerDay = opensPerDay * SIZING.pagesPerOpen * SIZING.cuSecPerPage
  const refreshCuSecPerDay = Math.max(0, i.models) * Math.max(0, i.refreshesPerDay) * SIZING.refreshCuSec[i.weight]
  const memoryNeed = Math.max(0, i.largestModelGb) * SIZING.refreshMemoryFactor

  const fits: SkuFit[] = SKUS.map(sku => {
    const lim = SKU_LIMITS[sku.id]
    const peakPct = (peakCuSecPerMin / (sku.cu * 60)) * 100
    const dailyPct = ((refreshCuSecPerDay + queryCuSecPerDay) / (sku.cu * 86_400)) * 100
    const memoryOk = memoryNeed <= lim.memoryGb
    // DirectQuery: a partir de 10 conexões por modelo (F8) para não enfileirar consultas
    const dqOk = !i.directQuery || lim.dqConnections >= 10
    const fits = peakPct <= 100 && dailyPct <= 100 && memoryOk && dqOk
    const comfortable = fits && peakPct <= SIZING.target * 100 && dailyPct <= SIZING.target * 100
    return { sku, peakPct, dailyPct, memoryOk, dqOk, fits, comfortable }
  })
  const minimum = fits.find(f => f.fits)?.sku ?? null
  const recommended = fits.find(f => f.comfortable)?.sku ?? null

  // o que mais pesou para chegar no tamanho recomendado
  // (o tamanho logo abaixo do recomendado: o que o impediu de servir)
  const recIdx = fits.findIndex(f => f.sku.id === recommended?.id)
  const below = recIdx > 0 ? fits[recIdx - 1] : recIdx === 0 ? fits[0] : fits[fits.length - 1]
  const driver: SizingResult['driver'] = recIdx !== 0 && !below.memoryOk ? 'memory'
    : recIdx !== 0 && !below.dqOk ? 'directquery'
    : below.peakPct >= below.dailyPct ? 'query' : 'refresh'

  return { opensPerDay, peakCuSecPerMin, refreshCuSecPerDay, queryCuSecPerDay, fits, minimum, recommended, driver }
}

/** Custo mensal de um SKU na região, reservado e por uso 24/7 (moeda local). */
export function skuMonthlyCost(skuId: string, regionId: string, fx: number) {
  const sku    = SKUS.find(s => s.id === skuId) ?? SKUS[0]
  const region = REGIONS.find(r => r.id === regionId) ?? REGIONS[0]
  const perHour = USD_PER_CU_HOUR * region.mult * sku.cu * fx
  return { reserved: perHour * HOURS_PER_MONTH * RESERVED_FACTOR, payg: perHour * HOURS_PER_MONTH }
}
