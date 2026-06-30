import { getAdminUser } from '@/server/supabase-server';
import { linkedInUrns, sendLinkedInConversion } from '@/server/linkedin-capi';

// Envia as conversões pendentes do LinkedIn via Conversions API e atualiza o ledger.
// POST /api/admin/conversions/send?platform=linkedin  (protegido por login admin)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Row {
  id: string;
  event_type: string;
  click_id: string | null;
  value: number | null;
  currency: string | null;
  occurred_at: string;
  attempts: number | null;
  leads?: { email: string | null } | null;
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'não autorizado' }, { status: 401 });

  const platform = new URL(req.url).searchParams.get('platform') || 'linkedin';
  if (platform !== 'linkedin') {
    return Response.json({ error: 'Envio por API disponível apenas para o LinkedIn por enquanto.' }, { status: 400 });
  }

  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const version = process.env.LINKEDIN_API_VERSION || '202401';
  const urns = linkedInUrns();
  if (!token) {
    return Response.json({ error: 'LinkedIn não configurado: defina LINKEDIN_ACCESS_TOKEN no ambiente.' }, { status: 400 });
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

  // Pendentes do LinkedIn com identificador de clique (+ e-mail do lead p/ fallback).
  const query =
    `${SUPABASE_URL}/rest/v1/lead_conversion_events` +
    `?platform=eq.linkedin&status=eq.pending&click_id=not.is.null` +
    `&select=id,event_type,click_id,value,currency,occurred_at,attempts,leads(email)` +
    `&order=occurred_at.asc`;
  const res = await fetch(query, { headers });
  if (!res.ok) {
    return Response.json({ error: 'Falha ao ler o ledger.', detail: await res.text() }, { status: 502 });
  }
  const rows = (await res.json().catch(() => [])) as Row[];

  let sent = 0, errors = 0, skipped = 0;
  const details: { id: string; event: string; status: string; msg?: string }[] = [];

  for (const r of rows) {
    const urn = urns[r.event_type];
    if (!urn) {
      skipped++;
      details.push({ id: r.id, event: r.event_type, status: 'skip', msg: `sem URN configurada (LINKEDIN_CONV_${r.event_type.toUpperCase()})` });
      continue;
    }

    const result = await sendLinkedInConversion(
      {
        conversionUrn: urn,
        occurredAtMs: Date.parse(r.occurred_at),
        value: r.value,
        currency: r.currency,
        liFatId: r.click_id,
        email: r.leads?.email ?? null,
      },
      token,
      version,
    );

    const patch = result.ok
      ? { status: 'sent', sent_at: new Date().toISOString(), api_response: 'ok' }
      : { status: 'error', api_response: result.body.slice(0, 800), attempts: (r.attempts ?? 0) + 1 };

    await fetch(`${SUPABASE_URL}/rest/v1/lead_conversion_events?id=eq.${encodeURIComponent(r.id)}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify(patch),
    }).catch(() => undefined);

    if (result.ok) { sent++; details.push({ id: r.id, event: r.event_type, status: 'sent' }); }
    else { errors++; details.push({ id: r.id, event: r.event_type, status: 'error', msg: `${result.status}: ${result.body.slice(0, 160)}` }); }
  }

  return Response.json({ sent, errors, skipped, total: rows.length, details });
}
