// Candidatura pública a uma vaga (multipart). Valida, sobe o currículo no bucket
// privado job-cvs (pelo servidor, com a chave anon + policy só de INSERT) e grava
// a candidatura pelo pg. Honeypot + limite por IP contra spam.
import { createApplication, getOpenJobBySlug } from '@/server/jobs';
import { logError } from '@/server/content-db';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const BUCKET = 'job-cvs';
const MAX_BYTES = 5 * 1024 * 1024;
// O bucket job-cvs só aceita estes três tipos (ver migration 006). O navegador
// nem sempre informa o tipo, então resolvemos pela extensão: o que sobe para o
// storage é sempre um tipo que o bucket aceita, senão ele recusa o arquivo.
const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const ALLOWED_MIME = new Set(Object.values(MIME_BY_EXT));
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

const str = (v: FormDataEntryValue | null, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const url = (v: string) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v);

export async function POST(req: Request) {
  try {
    const form = await req.formData().catch(() => null);
    if (!form) return Response.json({ error: 'Envio inválido.' }, { status: 400 });

    // Honeypot: bots preenchem; humanos não veem o campo. Responde ok sem gravar.
    if (str(form.get('website'))) return Response.json({ ok: true });

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'anon';
    if (tooMany(ip)) {
      return Response.json({ error: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' }, { status: 429 });
    }

    const job = await getOpenJobBySlug(str(form.get('jobSlug'), 120));
    if (!job) return Response.json({ error: 'Esta vaga não está mais aberta.' }, { status: 404 });
    if (job.applyUrl) return Response.json({ error: 'Esta vaga recebe candidaturas em outro site.' }, { status: 400 });

    const name = str(form.get('name'), 160);
    const email = str(form.get('email'), 200).toLowerCase();
    const consent = str(form.get('consent')) === 'true';
    if (name.length < 2 || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'Preencha seu nome e um e-mail válido.' }, { status: 422 });
    }
    if (!consent) {
      return Response.json({ error: 'Precisamos do seu aceite para guardar os dados da candidatura.' }, { status: 422 });
    }

    const cv = form.get('cv');
    if (!(cv instanceof File) || !cv.size) {
      return Response.json({ error: 'Anexe seu currículo em PDF ou Word (até 5 MB).' }, { status: 422 });
    }
    const ext = (cv.name.split('.').pop() || '').toLowerCase();
    // Tipo que vamos gravar: o do navegador quando o bucket aceita, senão o da extensão.
    const contentType = ALLOWED_MIME.has(cv.type) ? cv.type : MIME_BY_EXT[ext];
    if (!contentType || cv.size > MAX_BYTES) {
      return Response.json({ error: 'O currículo precisa ser PDF ou Word, com até 5 MB.' }, { status: 422 });
    }

    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!sbUrl || !sbKey) return Response.json({ error: 'Envio indisponível no momento.' }, { status: 500 });

    const sb = createClient(sbUrl, sbKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const path = `cv/${job.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'pdf'}`;
    const bytes = Buffer.from(await cv.arrayBuffer());
    const { error: upErr } = await sb.storage.from(BUCKET).upload(path, bytes, {
      contentType,
      upsert: false,
    });
    if (upErr) {
      await logError({ source: 'api/vagas/candidatar', message: `upload: ${upErr.message}` });
      return Response.json({ error: 'Não conseguimos receber o currículo. Tente novamente em instantes.' }, { status: 500 });
    }

    try {
      await createApplication({
        jobId: job.id,
        name,
        email,
        phone: str(form.get('phone'), 40) || null,
        linkedinUrl: url(str(form.get('linkedin'), 300)) || null,
        portfolioUrl: url(str(form.get('portfolio'), 300)) || null,
        message: str(form.get('message'), 3000) || null,
        cvPath: path,
        cvName: cv.name.slice(0, 200),
        cvMime: contentType,
        cvSize: cv.size,
        source: str(form.get('source'), 120) || null,
        page: str(form.get('page'), 300) || null,
        consent: true,
      });
    } catch (e) {
      // Sem a linha no banco o arquivo fica órfão no bucket: desfaz o upload.
      await sb.storage.from(BUCKET).remove([path]).catch(() => {});
      throw e;
    }

    return Response.json({ ok: true });
  } catch (e) {
    await logError({ source: 'api/vagas/candidatar', message: (e as Error).message }).catch(() => {});
    return Response.json({ error: 'Não conseguimos enviar sua candidatura. Tente novamente em instantes.' }, { status: 500 });
  }
}
