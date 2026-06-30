import { getAdminUser } from '@/server/supabase-server';

// Diagnóstico das integrações de mídia (CRM + tags + ledger de conversões).
// GET /api/admin/integrations → JSON com os checks. Protegido por login admin.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Status = 'ok' | 'warn' | 'error' | 'info';
interface Check { key: string; label: string; status: Status; detail: string }

const TAGS = {
  GTM: 'GTM-PQVNX8CR',
  GA4: 'G-QZHKPT0RDR',
  'Google Ads': 'AW-18203702207',
  'LinkedIn Insight': '10129857',
};

export async function GET(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });

  const checks: Check[] = [];
  const add = (key: string, label: string, status: Status, detail: string) =>
    checks.push({ key, label, status, detail });

  const SUPABASE_URL = process.env.CRM_SUPABASE_URL;
  const SERVICE_KEY = process.env.CRM_SERVICE_ROLE_KEY;
  const headers = {
    apikey: SERVICE_KEY ?? '',
    Authorization: `Bearer ${SERVICE_KEY ?? ''}`,
    'Content-Type': 'application/json',
  };

  // 1) Env do CRM
  const hasEnv = !!SUPABASE_URL && !!SERVICE_KEY;
  add('env', 'Variáveis do CRM configuradas', hasEnv ? 'ok' : 'error',
    hasEnv ? 'CRM_SUPABASE_URL e CRM_SERVICE_ROLE_KEY presentes' : 'Faltando CRM_SUPABASE_URL / CRM_SERVICE_ROLE_KEY');

  let pending = 0, sent = 0, total = 0, errored = 0;

  if (hasEnv) {
    // 2) Conexão com o CRM
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/tenants?select=id&limit=1`, { headers });
      add('crm', 'Conexão com o CRM', r.ok ? 'ok' : 'error', r.ok ? 'CRM acessível (service role)' : `HTTP ${r.status}`);
    } catch (e) {
      add('crm', 'Conexão com o CRM', 'error', (e as Error).message);
    }

    // 3) Colunas de atribuição em leads (migration 069)
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=gclid,lead_score,is_mql&limit=1`, { headers });
      add('leads_cols', 'Colunas de atribuição em leads (069)', r.ok ? 'ok' : 'error',
        r.ok ? 'gclid, lead_score, is_mql presentes' : 'colunas ausentes — aplicar a migration 069');
    } catch (e) {
      add('leads_cols', 'Colunas de atribuição em leads (069)', 'error', (e as Error).message);
    }

    // 4) Tabela de ledger (migration 069)
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/lead_conversion_events?select=id&limit=1`, { headers });
      add('ledger', 'Tabela de conversões / ledger (069)', r.ok ? 'ok' : 'error',
        r.ok ? 'lead_conversion_events acessível' : 'tabela ausente — aplicar a migration 069');
    } catch (e) {
      add('ledger', 'Tabela de conversões / ledger (069)', 'error', (e as Error).message);
    }

    // 5) Contagem de conversões por status
    const count = async (filter: string): Promise<number> => {
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/lead_conversion_events?select=id${filter}`, {
          headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
        });
        const cr = r.headers.get('content-range');
        return cr ? parseInt(cr.split('/')[1] || '0', 10) : 0;
      } catch {
        return 0;
      }
    };
    [total, pending, sent, errored] = await Promise.all([
      count(''),
      count('&status=eq.pending'),
      count('&status=eq.sent'),
      count('&status=eq.error'),
    ]);
    add('events', 'Conversões registradas', 'info',
      `${total} no total · ${pending} pendentes · ${sent} enviadas${errored ? ` · ${errored} com erro` : ''}`);
  }

  // 6) Tags no HTML do site (GTM disparando no servidor)
  try {
    const origin = new URL(req.url).origin;
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 8000);
    const html = await fetch(origin + '/', { signal: ctrl.signal }).then((r) => r.text());
    clearTimeout(to);
    const gtmOk = html.includes(TAGS.GTM);
    add('tags', 'Tag Manager no site (GTM)', gtmOk ? 'ok' : 'warn',
      gtmOk ? `${TAGS.GTM} presente no HTML` : 'GTM não detectado no HTML do site');
  } catch {
    add('tags', 'Tag Manager no site (GTM)', 'warn', 'não foi possível buscar o HTML do site');
  }

  // 7) LinkedIn Conversions API (envio automático)
  const liToken = !!process.env.LINKEDIN_ACCESS_TOKEN;
  const liUrns = ['LINKEDIN_CONV_LEAD', 'LINKEDIN_CONV_MQL', 'LINKEDIN_CONV_SQL', 'LINKEDIN_CONV_WON']
    .filter((k) => process.env[k]).length;
  add('linkedin_capi', 'LinkedIn Conversions API',
    liToken && liUrns === 4 ? 'ok' : liToken || liUrns ? 'warn' : 'info',
    liToken
      ? `token presente · ${liUrns}/4 conversões (URNs) configuradas`
      : 'sem token — defina LINKEDIN_ACCESS_TOKEN + as 4 URNs (LINKEDIN_CONV_*) para o envio automático');

  // 8) Gatilho SQL/Venda (070) — informativo (não verificável via REST)
  add('trigger', 'Gatilho SQL/Venda (070)', 'info', 'Aplicado por migration no CRM (verificável no banco)');

  const summary = {
    ok: checks.filter((c) => c.status === 'ok').length,
    error: checks.filter((c) => c.status === 'error').length,
    warn: checks.filter((c) => c.status === 'warn').length,
  };

  return Response.json({ checks, tags: TAGS, ledger: { total, pending, sent, errored }, summary });
}
