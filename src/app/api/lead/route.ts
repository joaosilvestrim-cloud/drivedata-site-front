// Endpoint do SITE que recebe a lead do formulário e grava direto na tabela
// `leads` do CRM (Supabase de produção), já com o tenant Brasil — para a lead
// aparecer no módulo Comercial. Roda só no servidor (service_role nunca vai ao
// navegador). Não altera nada do projeto do CRM; apenas insere a linha da lead.
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { name?: string; email?: string; company?: string; message?: string }
      | null;
    if (!body) return Response.json({ error: 'Payload inválido' }, { status: 400 });

    const { name, email, company, message } = body;
    if (!email && !name) {
      return Response.json({ error: 'Informe ao menos nome e e-mail.' }, { status: 422 });
    }

    const SUPABASE_URL = process.env.CRM_SUPABASE_URL;
    const SERVICE_KEY = process.env.CRM_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return Response.json({ error: 'Integração não configurada.' }, { status: 500 });
    }

    const headers = {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    };

    // Resolve o tenant Brasil (a lead precisa de tenant p/ aparecer no CRM via RLS)
    const tRes = await fetch(`${SUPABASE_URL}/rest/v1/tenants?code=eq.BR&select=id`, { headers });
    const tenants = (await tRes.json().catch(() => [])) as Array<{ id: string }>;
    const tenantId = Array.isArray(tenants) && tenants[0]?.id ? tenants[0].id : null;

    const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] || 'Lead';
    const lastName = parts.slice(1).join(' ') || '';

    const lead = {
      tenant_id: tenantId,
      first_name: firstName,
      last_name: lastName,
      email: email ? String(email).toLowerCase().trim() : null,
      company: company || null,
      status: 'new',
      source: 'website',
      score: 50,
      notes: message ? `Site DriveData — ${message}` : 'Lead via site DriveData',
    };

    const iRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify(lead),
    });

    if (!iRes.ok) {
      const detail = await iRes.text();
      return Response.json({ error: 'Falha ao registrar a lead.', detail }, { status: 502 });
    }

    const created = (await iRes.json().catch(() => null)) as Array<{ id: string }> | null;
    return Response.json({ ok: true, id: Array.isArray(created) ? created[0]?.id : undefined });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
