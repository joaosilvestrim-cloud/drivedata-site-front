// Captura e persiste os identificadores de atribuição de mídia paga (GCLID,
// demais click ids e UTMs) em cookie 1st-party. Esses dados viajam junto com a
// lead até o CRM (/api/lead) e, depois, alimentam o upload de conversões
// offline (Google Ads / LinkedIn Conversions API).
//
// Modelo: last-touch para os identificadores (o gclid que importa p/ a conversão
// é o do clique mais recente antes do lead), preservando o contexto do PRIMEIRO
// contato (first_landing_page / first_referrer / first_seen) para relatório.

const COOKIE = 'dd_attr';
const MAX_AGE = 60 * 60 * 24 * 90; // 90 dias

const CLICK_PARAMS = [
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'li_fat_id',
  'msclkid',
  'ttclid',
] as const;

const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export interface Attribution {
  // identificadores de clique (last-touch)
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  li_fat_id?: string;
  msclkid?: string;
  ttclid?: string;
  // utms (last-touch)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  // contexto do primeiro contato
  first_landing_page?: string;
  first_referrer?: string;
  first_seen?: string;
  last_seen?: string;
}

function readCookie(): Attribution {
  if (typeof document === 'undefined') return {};
  const m = document.cookie.match(/(?:^|;)\s*dd_attr=([^;]+)/);
  if (!m) return {};
  try {
    return JSON.parse(decodeURIComponent(m[1])) as Attribution;
  } catch {
    return {};
  }
}

function writeCookie(data: Attribution) {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify(data));
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
  try {
    localStorage.setItem(COOKIE, JSON.stringify(data));
  } catch {
    /* localStorage indisponível (modo privado) — cookie já cobre */
  }
}

// Roda no carregamento de cada página: se a URL trouxer click-id/UTM, atualiza
// (last-touch). Sempre mantém o contexto do primeiro contato.
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const next: Attribution = { ...readCookie() };
  const params = new URLSearchParams(window.location.search);

  for (const key of [...CLICK_PARAMS, ...UTM_PARAMS]) {
    const v = params.get(key);
    if (v) (next as Record<string, string>)[key] = v;
  }

  const nowIso = new Date().toISOString();
  if (!next.first_seen) {
    next.first_seen = nowIso;
    next.first_landing_page = window.location.pathname + window.location.search;
    next.first_referrer = document.referrer || '(direct)';
  }
  next.last_seen = nowIso;

  writeCookie(next);
  return next;
}

export function getAttribution(): Attribution {
  const fromCookie = readCookie();
  if (Object.keys(fromCookie).length > 0) return fromCookie;
  if (typeof localStorage !== 'undefined') {
    try {
      const ls = localStorage.getItem(COOKIE);
      if (ls) return JSON.parse(ls) as Attribution;
    } catch {
      /* ignore */
    }
  }
  return {};
}
