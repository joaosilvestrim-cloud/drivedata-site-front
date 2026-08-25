// Página pública de verificação de proposta. O cliente acessa
// drivedata.com.br/proposta/<codigo> (via QR/rodapé do documento) e confirma
// que a proposta é autêntica. Lê a proposta no banco do CRM com service role
// (server-side; a chave nunca vai ao navegador), expondo só campos públicos.
import type { Metadata } from 'next';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Verificação de Proposta · DriveData',
  robots: { index: false, follow: false },
};

interface PropostaPublica {
  numero_proposta?: string;
  titulo?: string;
  cliente_nome?: string;
  data_emissao?: string;
  investimento_total?: number;
  moeda?: string;
  validade_proposta?: number;
  status?: string;
  conteudo_hash?: string;
  hash_gerado_em?: string;
}

async function fetchProposta(codigo: string): Promise<PropostaPublica | null> {
  const url = process.env.CRM_SUPABASE_URL;
  const key = process.env.CRM_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const select =
    'numero_proposta,titulo,cliente_nome,data_emissao,investimento_total,moeda,validade_proposta,status,conteudo_hash,hash_gerado_em';
  try {
    const r = await fetch(
      `${url}/rest/v1/com_propostas?codigo_verificacao=eq.${encodeURIComponent(codigo)}&select=${select}&limit=1`,
      { headers, cache: 'no-store' },
    );
    if (!r.ok) return null;
    const rows = (await r.json()) as PropostaPublica[];
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch {
    return null;
  }
}

const money = (n?: number, m = 'BRL') =>
  n == null ? '—' : n.toLocaleString('pt-BR', { style: 'currency', currency: m });
const dataBR = (s?: string) => {
  if (!s) return '—';
  const d = new Date(s + 'T12:00:00');
  return isNaN(d.getTime()) ? s : d.toLocaleDateString('pt-BR');
};
const STATUS: Record<string, string> = {
  rascunho: 'Rascunho', enviada: 'Enviada', em_negociacao: 'Em negociação',
  aceita: 'Aceita', recusada: 'Recusada', expirada: 'Expirada',
};

const NAVY = '#0f2c52', CYAN = '#17a9e0', GREEN = '#16a34a', RED = '#dc2626';

export default async function VerificacaoProposta({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const p = await fetchProposta(codigo);
  const autentica = !!p;

  const wrap: React.CSSProperties = {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#eef6fb 0%,#ffffff 60%)', padding: 24,
    fontFamily: "'Segoe UI',system-ui,Arial,sans-serif", color: NAVY,
  };
  const cardS: React.CSSProperties = {
    width: '100%', maxWidth: 560, background: '#fff', borderRadius: 20,
    boxShadow: '0 20px 60px rgba(15,44,82,.12)', border: '1px solid #e6eef5', overflow: 'hidden',
  };
  const row = (label: string, value: string): React.ReactElement => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid #eef3f8' }}>
      <span style={{ color: '#6c7a8c', fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 14, textAlign: 'right' }}>{value}</span>
    </div>
  );

  return (
    <div style={wrap}>
      <div style={cardS}>
        <div style={{ background: NAVY, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
            Drive<span style={{ color: CYAN }}>Data</span>
          </span>
          <span style={{ marginLeft: 'auto', color: '#9fc4de', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Verificação de proposta
          </span>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, marginBottom: 20,
            background: autentica ? 'rgba(22,163,74,.08)' : 'rgba(220,38,38,.08)',
            color: autentica ? GREEN : RED, fontWeight: 700,
          }}>
            <span style={{ fontSize: 20 }}>{autentica ? '✓' : '✕'}</span>
            {autentica ? 'Documento autêntico, emitido pela DriveData.' : 'Proposta não encontrada para este código.'}
          </div>

          {p ? (
            <>
              {row('Número', p.numero_proposta || '—')}
              {row('Título', p.titulo || '—')}
              {row('Cliente', p.cliente_nome || '—')}
              {row('Emissão', dataBR(p.data_emissao))}
              {row('Investimento', money(p.investimento_total, p.moeda))}
              {row('Validade', p.validade_proposta ? `${p.validade_proposta} dias` : '—')}
              {row('Situação', STATUS[p.status || ''] || p.status || '—')}
              <div style={{ marginTop: 16, fontSize: 11, color: '#9aa7b4', wordBreak: 'break-all' }}>
                Código: {codigo}<br />
                Hash SHA-256: {p.conteudo_hash || '—'}
              </div>
            </>
          ) : (
            <p style={{ color: '#6c7a8c', fontSize: 14, lineHeight: 1.6 }}>
              Verifique o código informado no rodapé do documento. Em caso de dúvida, entre em contato com a DriveData.
            </p>
          )}
        </div>

        <div style={{ padding: '14px 28px', borderTop: '1px solid #eef3f8', fontSize: 12, color: '#9aa7b4', textAlign: 'center' }}>
          www.drivedata.com.br
        </div>
      </div>
    </div>
  );
}
