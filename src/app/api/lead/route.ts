// Endpoint do SITE que recebe a lead do formulário e grava direto na tabela
// `leads` do CRM (Supabase de produção), já com o tenant Brasil — para a lead
// aparecer no módulo Comercial. Roda só no servidor (service_role nunca vai ao
// navegador). Não altera nada do projeto do CRM; apenas insere a linha da lead.
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          name?: string; email?: string; phone?: string; company?: string;
          message?: string; revenue?: string; segment?: string;
          role?: string; urgency?: string; leadScore?: number; mql?: boolean;
          origin?: string; page?: string;
          tracking?: Record<string, string | undefined>;
        }
      | null;
    if (!body) return Response.json({ error: 'Payload inválido' }, { status: 400 });

    const { name, email, phone, company, message, revenue, segment, role, urgency, leadScore, mql, origin, page, tracking } = body;
    if (!email && !name && !phone) {
      return Response.json({ error: 'Informe ao menos nome, e-mail ou telefone.' }, { status: 422 });
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

    // Origem detalhada vai nas notes (o CRM mostra no detalhe da lead).
    const noteLines = [
      `🌐 Origem: ${origin || 'Site DriveData'}`,
      `📄 Página: ${page || '/'}`,
    ];
    if (typeof leadScore === 'number') {
      noteLines.push(`⭐ Lead Score: ${leadScore}/10 ${mql ? '→ MQL ✅' : '→ não-MQL'}`);
    }
    if (role) noteLines.push(`👤 Cargo: ${role}`);
    if (revenue) noteLines.push(`💰 Faturamento anual: ${revenue}`);
    if (segment) noteLines.push(`🏷️ Segmento: ${segment}`);
    if (urgency) noteLines.push(`⏱️ Urgência: ${urgency}`);
    if (message) noteLines.push(`💬 Desafio de dados: ${message}`);

    // Atribuição de mídia paga (GCLID/UTM). Por ora gravamos nas notes; na Fase 1
    // viram colunas próprias em `leads` para o upload de conversões offline.
    if (tracking && typeof tracking === 'object') {
      const t = tracking;
      const clickIds = ['gclid', 'gbraid', 'wbraid', 'li_fat_id', 'fbclid', 'msclkid', 'ttclid']
        .filter((k) => t[k])
        .map((k) => `${k}=${t[k]}`);
      const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
        .filter((k) => t[k])
        .map((k) => `${k}=${t[k]}`);
      const attrLines: string[] = [];
      if (clickIds.length) attrLines.push(`🔑 Click IDs: ${clickIds.join(' | ')}`);
      if (utms.length) attrLines.push(`📈 UTM: ${utms.join(' | ')}`);
      if (t.first_landing_page) attrLines.push(`🛬 Entrada: ${t.first_landing_page}`);
      if (t.first_referrer) attrLines.push(`↩️ Referrer: ${t.first_referrer}`);
      if (attrLines.length) {
        noteLines.push('—', '🎯 Atribuição:', ...attrLines);
      }
    }

    const lead = {
      tenant_id: tenantId,
      first_name: firstName,
      last_name: lastName,
      email: email ? String(email).toLowerCase().trim() : null,
      phone: phone || null,
      company: company || null,
      status: 'new',
      source: 'website',
      // Lead Score 0–10 (spec DALT) mapeado p/ a escala 0–100 do campo do CRM.
      // Sem scoring (ex.: formulário simples) mantém o neutro 50.
      score: typeof leadScore === 'number' ? leadScore * 10 : 50,
      notes: noteLines.join('\n'),
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
