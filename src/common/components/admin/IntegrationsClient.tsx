'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, C, Card, Icon, PageHeader, Spinner } from './ui';

type Status = 'ok' | 'warn' | 'error' | 'info';
interface Check { key: string; label: string; status: Status; detail: string }
interface Health {
  checks: Check[];
  tags: Record<string, string>;
  ledger: { total: number; pending: number; sent: number; errored: number };
  summary: { ok: number; error: number; warn: number };
}

const TONE: Record<Status, { color: string; bg: string; icon: string }> = {
  ok: { color: C.green, bg: 'rgba(84,218,137,.14)', icon: 'check' },
  error: { color: C.danger, bg: C.dangerBg, icon: 'x' },
  warn: { color: C.warn, bg: 'rgba(246,196,85,.14)', icon: 'alert' },
  info: { color: '#6cc4ff', bg: 'rgba(10,150,236,.14)', icon: 'doc' },
};

export function IntegrationsClient() {
  const [data, setData] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/integrations');
      if (!res.ok) throw new Error(`Falha ao validar (${res.status})`);
      setData(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <div>
      <PageHeader
        title="Integrações"
        subtitle="Diagnóstico das integrações de mídia: CRM, tags, ledger de conversões e funil."
        icon="server"
        actions={<Button variant="ghost" icon="refresh" onClick={() => void load()}>Revalidar</Button>}
      />

      {error && (
        <div style={{ color: C.danger, background: C.dangerBg, padding: '9px 13px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>{error}</div>
      )}

      {loading ? (
        <Spinner label="Validando integrações…" />
      ) : data ? (
        <>
          {/* Resumo */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <Pill color={C.green} label={`${data.summary.ok} OK`} />
            {data.summary.warn > 0 && <Pill color={C.warn} label={`${data.summary.warn} aviso${data.summary.warn > 1 ? 's' : ''}`} />}
            {data.summary.error > 0 && <Pill color={C.danger} label={`${data.summary.error} erro${data.summary.error > 1 ? 's' : ''}`} />}
            {data.summary.error === 0 && data.summary.warn === 0 && (
              <span style={{ color: C.green, fontSize: 13, alignSelf: 'center', fontWeight: 600 }}>Tudo certo nas integrações.</span>
            )}
          </div>

          {/* Checks */}
          <Card pad={0} style={{ overflow: 'hidden', marginBottom: 16 }}>
            {data.checks.map((c, i) => {
              const t = TONE[c.status];
              return (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderTop: i ? `1px solid ${C.border}` : undefined }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: t.bg, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={t.icon} size={16} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{c.detail}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.status}</span>
                </div>
              );
            })}
          </Card>

          {/* Conversões */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
            <Stat label="Conversões (total)" value={data.ledger.total} />
            <Stat label="Pendentes" value={data.ledger.pending} color={C.warn} />
            <Stat label="Enviadas" value={data.ledger.sent} color={C.green} />
            <Stat label="Com erro" value={data.ledger.errored} color={data.ledger.errored ? C.danger : undefined} />
          </div>

          {/* Tags configuradas */}
          <Card pad={16}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Tags configuradas</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(data.tags).map(([name, id]) => (
                <span key={name} style={{ display: 'inline-flex', gap: 6, alignItems: 'center', background: 'rgba(255,255,255,.05)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>
                  <span style={{ color: C.muted }}>{name}</span>
                  <code style={{ color: C.text, fontSize: 11.5 }}>{id}</code>
                </span>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: C.faint, marginTop: 10, lineHeight: 1.5 }}>
              GA4, Google Ads e LinkedIn Insight são disparados via GTM. A tag do LinkedIn pode ser confirmada com a extensão “LinkedIn Insight Tag Checker”.
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function Pill({ color, label }: { color: string; label: string }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.05)', border: `1px solid ${C.border}`, borderRadius: 999, padding: '5px 12px', fontSize: 12.5, fontWeight: 600, color }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} /> {label}
  </span>;
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <Card pad={14}>
      <div style={{ fontSize: 24, fontWeight: 800, color: color ?? C.text }}>{value}</div>
      <div style={{ fontSize: 11.5, color: C.faint, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 }}>{label}</div>
    </Card>
  );
}
