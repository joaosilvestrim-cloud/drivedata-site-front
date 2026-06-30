import { getAdminUser } from '@/server/supabase-server';

// Exporta as conversões pendentes do ledger (CRM) no formato de importação
// offline do Google Ads ("Conversões a partir de cliques" / GCLID).
// - GET /api/admin/conversions                 → prévia (não altera nada)
// - GET /api/admin/conversions?commit=1        → baixa o CSV e marca como enviado
// - GET /api/admin/conversions?format=json     → JSON p/ inspeção
// Protegido por login de admin. Lê o ledger via service_role do CRM.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface LedgerRow {
  id: string;
  conversion_name: string | null;
  click_id: string | null;
  value: number | null;
  currency: string | null;
  occurred_at: string;
}

// Formata o timestamp (UTC) para "yyyy-MM-dd HH:mm:ss" no fuso de São Paulo,
// combinando com o cabeçalho Parameters:TimeZone do arquivo.
function fmtSaoPaulo(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
}

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET(req: Request) {
  if (!(await getAdminUser())) {
    return Response.json({ error: 'não autorizado' }, { status: 401 });
  }

  const SUPABASE_URL = process.env.CRM_SUPABASE_URL;
  const SERVICE_KEY = process.env.CRM_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return Response.json({ error: 'Integração com o CRM não configurada.' }, { status: 500 });
  }
  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  const url = new URL(req.url);
  const platform = url.searchParams.get('platform') || 'google';
  const commit = url.searchParams.get('commit') === '1';
  const asJson = url.searchParams.get('format') === 'json';

  // Pendentes da plataforma, com click id atribuível (sem gclid não dá p/ importar).
  const query =
    `${SUPABASE_URL}/rest/v1/lead_conversion_events` +
    `?platform=eq.${encodeURIComponent(platform)}` +
    `&status=eq.pending&click_id=not.is.null` +
    `&select=id,conversion_name,click_id,value,currency,occurred_at` +
    `&order=occurred_at.asc`;

  const res = await fetch(query, { headers });
  if (!res.ok) {
    const detail = await res.text();
    return Response.json({ error: 'Falha ao ler o ledger.', detail }, { status: 502 });
  }
  const rows = ((await res.json().catch(() => [])) as LedgerRow[]).filter((r) => r.click_id);

  if (asJson) return Response.json({ count: rows.length, rows });

  // Monta o CSV no template do Google Ads (cliques/GCLID).
  const lines = [
    'Parameters:TimeZone=America/Sao_Paulo',
    'Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency',
  ];
  for (const r of rows) {
    lines.push(
      [
        csvCell(r.click_id as string),
        csvCell(r.conversion_name || ''),
        fmtSaoPaulo(r.occurred_at),
        String(r.value ?? 0),
        r.currency || 'BRL',
      ].join(','),
    );
  }
  const csv = lines.join('\n');

  // commit=1: marca as linhas exportadas como enviadas (evita reenvio/duplicidade).
  if (commit && rows.length) {
    const ids = rows.map((r) => r.id);
    const patchUrl =
      `${SUPABASE_URL}/rest/v1/lead_conversion_events` +
      `?id=in.(${ids.map((id) => encodeURIComponent(id)).join(',')})`;
    await fetch(patchUrl, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'sent', sent_at: new Date().toISOString() }),
    }).catch(() => undefined);
  }

  const stamp = fmtSaoPaulo(new Date().toISOString()).slice(0, 10).replace(/-/g, '');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="conversoes-${platform}-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
