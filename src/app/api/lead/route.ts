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
    const t = tracking ?? {};

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
      // Colunas da Fase 1 (migration 069): atribuição + score próprio do funil.
      gclid: t.gclid ?? null,
      gbraid: t.gbraid ?? null,
      wbraid: t.wbraid ?? null,
      fbclid: t.fbclid ?? null,
      li_fat_id: t.li_fat_id ?? null,
      msclkid: t.msclkid ?? null,
      ttclid: t.ttclid ?? null,
      utm_source: t.utm_source ?? null,
      utm_medium: t.utm_medium ?? null,
      utm_campaign: t.utm_campaign ?? null,
      utm_content: t.utm_content ?? null,
      utm_term: t.utm_term ?? null,
      landing_page: t.first_landing_page ?? null,
      referrer: t.first_referrer ?? null,
      lead_score: typeof leadScore === 'number' ? leadScore : null,
      is_mql: !!mql,
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
    const leadId = Array.isArray(created) ? created[0]?.id : undefined;

    // Ledger de conversões (migration 069): registra os eventos a enviar p/ as
    // plataformas. Lead sempre; MQL se score >= 6. Só cria quando há click id
    // atribuível. Resiliente: nunca quebra a captura da lead se algo falhar.
    if (leadId) {
      try {
        const googleClick = t.gclid
          ? { id: t.gclid, field: 'gclid' }
          : t.gbraid
            ? { id: t.gbraid, field: 'gbraid' }
            : t.wbraid
              ? { id: t.wbraid, field: 'wbraid' }
              : null;
        const liClick = t.li_fat_id ? { id: t.li_fat_id, field: 'li_fat_id' } : null;
        const googleName: Record<string, string> = { lead: 'Lead', mql: 'MQL' };
        const stages: Array<'lead' | 'mql'> = mql ? ['lead', 'mql'] : ['lead'];

        const events = stages.flatMap((et) => {
          const rows: Record<string, unknown>[] = [];
          if (googleClick) {
            rows.push({
              tenant_id: tenantId, lead_id: leadId, event_type: et, platform: 'google',
              conversion_name: googleName[et], click_id: googleClick.id, click_field: googleClick.field,
              currency: 'BRL',
            });
          }
          if (liClick) {
            rows.push({
              tenant_id: tenantId, lead_id: leadId, event_type: et, platform: 'linkedin',
              click_id: liClick.id, click_field: liClick.field, currency: 'BRL',
            });
          }
          return rows;
        });

        if (events.length) {
          await fetch(`${SUPABASE_URL}/rest/v1/lead_conversion_events`, {
            method: 'POST',
            headers: { ...headers, Prefer: 'resolution=ignore-duplicates' },
            body: JSON.stringify(events),
          });
        }
      } catch {
        /* ledger é best-effort; a lead já foi salva */
      }
    }

    return Response.json({ ok: true, id: leadId });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
