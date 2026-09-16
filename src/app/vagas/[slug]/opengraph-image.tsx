import { SITE_BASE_URL } from '@/common/config/site';
import { CONTRACT_LABEL, WORK_MODEL_LABEL } from '@/common/model/job.model';
import { getOpenJobBySlug } from '@/server/jobs';
import { ImageResponse } from 'next/og';

// Card da vaga para LinkedIn/WhatsApp (og:image 1200×630), gerado na hora.
export const runtime = 'nodejs';
export const alt = 'Vaga na DriveData';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Sora em TTF (o Satori não lê woff2). O Google Fonts devolve TTF para user
// agents antigos; se falhar, cai na fonte padrão e o card continua saindo.
let soraCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;
async function loadSora() {
  if (soraCache) return soraCache;
  const fetchTtf = async (weight: number) => {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Sora:wght@${weight}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:1.0)' },
    }).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+\.ttf)\)/)?.[1];
    if (!url) throw new Error('ttf não encontrado');
    return fetch(url).then((r) => r.arrayBuffer());
  };
  const [regular, bold] = await Promise.all([fetchTtf(400), fetchTtf(800)]);
  soraCache = { regular, bold };
  return soraCache;
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [job, sora] = await Promise.all([
    getOpenJobBySlug(slug).catch(() => null),
    loadSora().catch(() => null),
  ]);
  const title = job?.title ?? 'Vagas na DriveData';
  const chips = job
    ? ([job.area, WORK_MODEL_LABEL[job.workModel], job.location, CONTRACT_LABEL[job.contractType]].filter(Boolean) as string[])
    : [];
  const host = new URL(SITE_BASE_URL).host;
  const fonts = sora
    ? [
        { name: 'Sora', data: sora.regular, weight: 400 as const, style: 'normal' as const },
        { name: 'Sora', data: sora.bold, weight: 800 as const, style: 'normal' as const },
      ]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #070c16 0%, #0b1a2e 60%, #0d2436 100%)',
          color: '#eaf0fb',
          fontFamily: sora ? 'Sora' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, fontWeight: 800 }}>
          <div style={{ width: 14, height: 44, borderRadius: 7, background: 'linear-gradient(180deg, #0a96ec, #54da89)' }} />
          <span>DriveData</span>
          <span style={{ color: 'rgba(234,240,251,0.55)', fontWeight: 400 }}>· Vagas</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontSize: title.length > 48 ? 56 : 68, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>
            {title}
          </div>
          {chips.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {chips.map((c) => (
                <div
                  key={c}
                  style={{
                    fontSize: 24,
                    padding: '10px 20px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.06)',
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: 'rgba(234,240,251,0.6)' }}>
          <span>{host}/vagas</span>
          <span>Candidate-se em 3 minutos</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
