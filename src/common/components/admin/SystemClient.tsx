'use client';

import { useCallback, useEffect, useState } from 'react';
import { C, Card, Button, Icon, PageHeader, Spinner, Badge } from './ui';

type Health = {
  db: { ok: boolean; now?: string; error?: string };
  integrations: { key: string; label: string; ok: boolean }[];
  errors24h: number;
  scheduledDue: number;
  checkedAt: string;
};
type Log = { id: string; created_at: string; level: string; source: string; message: string; stack?: string };
type Storage = { files: number; bytes: number; images: number; documents: number };

const fmtBytes = (b: number) => {
  if (!b) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), u.length - 1);
  return `${(b / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
};

export function SystemClient() {
  const [health, setHealth] = useState<Health | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [storage, setStorage] = useState<Storage | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [h, l, s] = await Promise.all([
      fetch('/api/admin/health', { cache: 'no-store' }).then((r) => r.json()).catch(() => null),
      fetch('/api/admin/logs?limit=100', { cache: 'no-store' }).then((r) => r.json()).catch(() => []),
      fetch('/api/admin/stats', { cache: 'no-store' }).then((r) => r.json()).then((d) => d.storage).catch(() => null),
    ]);
    setHealth(h);
    setLogs(Array.isArray(l) ? l : []);
    setStorage(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  async function clearLogs() {
    if (!confirm('Limpar todos os logs de erro?')) return;
    await fetch('/api/admin/logs', { method: 'DELETE' });
    await load();
  }
  async function runPublish() {
    await fetch('/api/cron/publish', { cache: 'no-store' });
    await load();
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Sistema & Saúde"
        subtitle="Monitoramento, integrações, armazenamento e logs."
        icon="server"
        actions={<Button variant="ghost" icon="refresh" onClick={load}>Atualizar</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <h3 style={h3}><Icon name="server" size={15} /> Status dos serviços</h3>
          <Row label="Banco de dados" ok={!!health?.db?.ok} detail={health?.db?.ok ? 'Conectado' : health?.db?.error || 'Falha'} />
          {(health?.integrations || []).map((i) => (
            <Row key={i.key} label={i.label} ok={i.ok} detail={i.ok ? 'Configurada' : 'Não configurada'} />
          ))}
          <Row label="Erros (24h)" ok={!health?.errors24h} detail={`${health?.errors24h ?? 0} ocorrência(s)`} />
          <div style={{ fontSize: 11, color: C.faint, marginTop: 10 }}>Última verificação: {health?.checkedAt ? new Date(health.checkedAt).toLocaleTimeString('pt-BR') : '—'}</div>
        </Card>

        <Card>
          <h3 style={h3}><Icon name="image" size={15} /> Armazenamento</h3>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{fmtBytes(storage?.bytes || 0)}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{storage?.files || 0} arquivos · {storage?.images || 0} imagens · {storage?.documents || 0} documentos</div>

          <h3 style={{ ...h3, marginTop: 22 }}><Icon name="calendar" size={15} /> Publicação agendada</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ color: C.muted, fontSize: 13 }}>{health?.scheduledDue ? `${health.scheduledDue} artigo(s) vencido(s) aguardando` : 'Nenhum agendamento vencido'}</span>
            <Button variant="ghost" icon="refresh" onClick={runPublish}>Publicar agora</Button>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ ...h3, margin: 0 }}><Icon name="alert" size={15} /> Logs de erro</h3>
          {logs.length > 0 && <Button variant="danger" icon="trash" onClick={clearLogs}>Limpar logs</Button>}
        </div>
        {logs.length === 0 ? (
          <div style={{ color: C.green, fontSize: 13, padding: '10px 0', display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="check" size={15} /> Nenhum erro registrado. Tudo certo!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {logs.map((l) => (
              <div key={l.id} style={{ borderTop: `1px solid ${C.border}`, padding: '10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: l.stack ? 'pointer' : 'default' }} onClick={() => l.stack && setOpen(open === l.id ? null : l.id)}>
                  <Badge tone={l.level === 'error' ? 'danger' : 'neutral'}>{l.level}</Badge>
                  <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.message}</span>
                  <span style={{ fontSize: 11.5, color: C.faint }}>{l.source}</span>
                  <span style={{ fontSize: 11.5, color: C.faint }}>{new Date(l.created_at).toLocaleString('pt-BR')}</span>
                </div>
                {open === l.id && l.stack && (
                  <pre style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, fontSize: 11.5, color: C.muted, overflowX: 'auto', marginTop: 8 }}>{l.stack}</pre>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Row({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 13.5 }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: ok ? C.green : C.danger, fontWeight: 600 }}>
        {detail}
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: ok ? C.green : C.danger, boxShadow: ok ? `0 0 7px ${C.green}` : 'none' }} />
      </span>
    </div>
  );
}
const h3: React.CSSProperties = { fontSize: 14, fontWeight: 700, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 };
