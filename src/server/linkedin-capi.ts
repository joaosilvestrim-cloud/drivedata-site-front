import { createHash } from 'crypto';

// Cliente da Conversions API do LinkedIn (envio de conversões offline server-side).
// Doc: POST https://api.linkedin.com/rest/conversionEvents
// Casa o membro por li_fat_id (1st-party) e/ou e-mail com hash SHA256.

const ENDPOINT = 'https://api.linkedin.com/rest/conversionEvents';

export interface LinkedInEvent {
  conversionUrn: string; // urn da regra de conversão (ex.: urn:lla:llpConversion:123456)
  occurredAtMs: number; // quando a conversão aconteceu (epoch ms)
  value?: number | null;
  currency?: string | null;
  liFatId?: string | null;
  email?: string | null;
}

export interface SendResult {
  ok: boolean;
  status: number;
  body: string;
}

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function sendLinkedInConversion(
  ev: LinkedInEvent,
  token: string,
  version: string,
): Promise<SendResult> {
  const userIds: { idType: string; idValue: string }[] = [];
  if (ev.liFatId) userIds.push({ idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID', idValue: ev.liFatId });
  if (ev.email) userIds.push({ idType: 'SHA256_EMAIL', idValue: sha256(ev.email) });
  if (userIds.length === 0) {
    return { ok: false, status: 0, body: 'sem identificador de membro (li_fat_id ou e-mail)' };
  }

  const body: Record<string, unknown> = {
    conversion: ev.conversionUrn,
    conversionHappenedAt: ev.occurredAtMs,
    user: { userIds },
  };
  if (ev.value != null) {
    body.conversionValue = { currencyCode: ev.currency || 'BRL', amount: String(ev.value) };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': version,
        'X-RestLi-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => '');
    return { ok: res.ok, status: res.status, body: text || (res.ok ? 'ok' : `erro ${res.status}`) };
  } catch (e) {
    return { ok: false, status: 0, body: (e as Error).message };
  }
}

// Mapa de event_type → URN da regra de conversão (vem das env vars).
export function linkedInUrns(): Record<string, string | undefined> {
  return {
    lead: process.env.LINKEDIN_CONV_LEAD,
    mql: process.env.LINKEDIN_CONV_MQL,
    sql: process.env.LINKEDIN_CONV_SQL,
    won: process.env.LINKEDIN_CONV_WON,
  };
}
