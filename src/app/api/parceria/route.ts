// Solicitação pública de parceria (Portal do Parceiro). JSON simples, sem anexo.
// Honeypot + limite por IP contra spam; validação repetida no servidor.
import { logError } from '@/server/content-db';
import { createPartnerApplication } from '@/server/partnerships';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Limite simples por IP (por instância): 5 envios a cada 10 minutos.
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const url = (v: string) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v);

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return Response.json({ error: 'Envio inválido.' }, { status: 400 });

    // Honeypot: bots preenchem; humanos não veem o campo. Responde ok sem gravar.
    if (str(body.website2)) return Response.json({ ok: true });

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'anon';
    if (tooMany(ip)) {
      return Response.json({ error: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' }, { status: 429 });
    }

    const company = str(body.company, 160);
    const contactName = str(body.contactName, 160);
    const email = str(body.email, 200).toLowerCase();
    if (company.length < 2 || contactName.length < 2 || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'Preencha empresa, seu nome e um e-mail válido.' }, { status: 422 });
    }
    if (body.consent !== true) {
      return Response.json({ error: 'Precisamos do seu aceite para guardar os dados do contato.' }, { status: 422 });
    }

    await createPartnerApplication({
      partnershipType: str(body.partnershipType, 30) || 'indicacao',
      company,
      cnpj: str(body.cnpj, 30) || null,
      website: url(str(body.website, 300)) || null,
      linkedinUrl: url(str(body.linkedinUrl, 300)) || null,
      contactName,
      contactRole: str(body.contactRole, 120) || null,
      email,
      phone: str(body.phone, 40) || null,
      region: str(body.region, 160) || null,
      segment: str(body.segment, 160) || null,
      companySize: str(body.companySize, 20) || null,
      dataMaturity: str(body.dataMaturity, 30) || null,
      message: str(body.message, 3000) || null,
      howHeard: str(body.howHeard, 30) || null,
      source: str(body.source, 120) || null,
      page: str(body.page, 300) || null,
    });

    return Response.json({ ok: true });
  } catch (e) {
    await logError({ source: 'api/parceria', message: (e as Error).message }).catch(() => {});
    return Response.json({ error: 'Não conseguimos enviar seu contato. Tente novamente em instantes.' }, { status: 500 });
  }
}
