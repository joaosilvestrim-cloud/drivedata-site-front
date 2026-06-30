import { createHash } from 'crypto';
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
  event_type: string;
  conversion_name: string | null;
  click_id: string | null;
  value: number | null;
  currency: string | null;
  occurred_at: string;
  // embed do lead p/ o CSV do LinkedIn (casa por e-mail com hash + dados do membro)
  leads?: {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    company: string | null;
    job_title: string | null;
  } | null;
}

const LI_EVENT_NAME: Record<string, string> = { lead: 'Lead', mql: 'MQL', sql: 'SQL', won: 'Venda' };

// SHA256 do e-mail normalizado (formato exigido pelo LinkedIn p/ casar membro).
function sha256Email(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
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
  const eventFilter = url.searchParams.get('event'); // opcional: lead|mql|sql|won

  // Pendentes da plataforma. LinkedIn traz os dados do lead (embed) p/ o CSV
  // (casa por e-mail com hash SHA256 + nome/empresa/cargo).
  const selectCols =
    platform === 'linkedin'
      ? 'id,event_type,conversion_name,click_id,value,currency,occurred_at,leads(email,first_name,last_name,company,job_title)'
      : 'id,event_type,conversion_name,click_id,value,currency,occurred_at';
  const query =
    `${SUPABASE_URL}/rest/v1/lead_conversion_events` +
    `?platform=eq.${encodeURIComponent(platform)}` +
    `&status=eq.pending&click_id=not.is.null` +
    (eventFilter ? `&event_type=eq.${encodeURIComponent(eventFilter)}` : '') +
    `&select=${selectCols}` +
    `&order=occurred_at.asc`;

  const res = await fetch(query, { headers });
  if (!res.ok) {
    const detail = await res.text();
    return Response.json({ error: 'Falha ao ler o ledger.', detail }, { status: 502 });
  }
  const rows = ((await res.json().catch(() => [])) as LedgerRow[]).filter((r) => r.click_id);

  if (asJson) return Response.json({ count: rows.length, rows });

  const exportedIds: string[] = [];
  let lines: string[];
  if (platform === 'linkedin') {
    // LinkedIn: template oficial de conversões offline (casa por e-mail SHA256).
    lines = ['email,firstName,lastName,employeecompany,title,country,timestamp,eventtype,amount,currency'];
    for (const r of rows) {
      const lead = r.leads;
      const email = lead?.email ? sha256Email(lead.email) : '';
      if (!email) continue; // sem e-mail não há como casar o membro no CSV
      exportedIds.push(r.id);
      lines.push(
        [
          email,
          csvCell(lead?.first_name || ''),
          csvCell(lead?.last_name || ''),
          csvCell(lead?.company || ''),
          csvCell(lead?.job_title || ''),
          'BR',
          String(Date.parse(r.occurred_at)),
          csvCell(LI_EVENT_NAME[r.event_type] || r.event_type),
          r.value != null ? String(r.value) : '',
          (r.currency || 'BRL').toLowerCase(),
        ].join(','),
      );
    }
  } else {
    // Google Ads: template "Conversões a partir de cliques" (GCLID).
    lines = [
      'Parameters:TimeZone=America/Sao_Paulo',
      'Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency',
    ];
    for (const r of rows) {
      exportedIds.push(r.id);
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
  }
  const csv = lines.join('\n');

  // commit=1: marca como enviadas só as linhas realmente exportadas (evita reenvio).
  if (commit && exportedIds.length) {
    const ids = exportedIds;
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
