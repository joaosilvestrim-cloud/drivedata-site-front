'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, C, Card, Icon, PageHeader, Spinner } from './ui';

type Platform = 'google' | 'linkedin';
type Counts = Record<Platform, number | null>;

const META: Record<Platform, { label: string; icon: string; hint: string }> = {
  google: {
    label: 'Google Ads',
    icon: 'chart',
    hint: 'Template "Conversões a partir de cliques" (GCLID). Suba em Ferramentas → Conversões → Uploads.',
  },
  linkedin: {
    label: 'LinkedIn Ads',
    icon: 'users',
    hint: 'Inclui li_fat_id e e-mail com hash SHA256. Suba no Campaign Manager (conversões offline) ou via Conversions API.',
  },
};

export function ConversionsClient() {
  const [counts, setCounts] = useState<Counts>({ google: null, linkedin: null });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [g, l] = await Promise.all(
        (['google', 'linkedin'] as Platform[]).map((p) =>
          fetch(`/api/admin/conversions?platform=${p}&format=json`).then((r) => r.json()),
        ),
      );
      setCounts({ google: g?.count ?? 0, linkedin: l?.count ?? 0 });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCounts();
  }, [loadCounts]);

  async function download(platform: Platform, commit: boolean) {
    setBusy(`${platform}-${commit}`);
    setError(null);
    try {
      const res = await fetch(`/api/admin/conversions?platform=${platform}${commit ? '&commit=1' : ''}`);
      if (!res.ok) throw new Error(`Falha ao gerar o CSV (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      a.href = url;
      a.download = `conversoes-${platform}-${stamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      if (commit) await loadCounts();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Conversões (Ads)"
        subtitle="Exporte as conversões offline (Lead, MQL, SQL, Venda) para o Google Ads e o LinkedIn Ads."
        icon="upload"
        actions={
          <Button variant="ghost" icon="refresh" onClick={() => void loadCounts()}>
            Atualizar
          </Button>
        }
      />

      {error && (
        <div style={{ color: C.danger, background: C.dangerBg, padding: '9px 13px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {loading ? (
        <Spinner label="Carregando conversões pendentes…" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {(['google', 'linkedin'] as Platform[]).map((p) => {
            const m = META[p];
            const count = counts[p] ?? 0;
            const empty = count === 0;
            return (
              <Card key={p}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(10,150,236,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green }}>
                    <Icon name={m.icon} size={19} />
                  </span>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{m.label}</div>
                  <div style={{ marginLeft: 'auto' }}>
                    {empty ? <Badge tone="neutral">Nada pendente</Badge> : <Badge tone="live">{count} pendente{count > 1 ? 's' : ''}</Badge>}
                  </div>
                </div>

                <p style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.5, margin: '0 0 14px' }}>{m.hint}</p>

                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                  <Button variant="ghost" icon="doc" disabled={empty || !!busy} onClick={() => download(p, false)}>
                    {busy === `${p}-false` ? 'Gerando…' : 'Baixar CSV (prévia)'}
                  </Button>
                  <Button variant="primary" icon="upload" disabled={empty || !!busy} onClick={() => download(p, true)}>
                    {busy === `${p}-true` ? 'Gerando…' : 'Baixar e marcar enviado'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card style={{ marginTop: 16 }} pad={16}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Como funciona</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.muted, fontSize: 12.5, lineHeight: 1.7 }}>
          <li><b>Baixar CSV (prévia)</b>: gera o arquivo sem alterar nada — bom pra conferir antes.</li>
          <li><b>Baixar e marcar enviado</b>: gera o arquivo e marca as conversões como enviadas (não saem de novo na próxima exportação).</li>
          <li>Só aparecem conversões com identificador de clique (GCLID / li_fat_id). Leads orgânicos/diretos não entram.</li>
          <li>Depois de baixar, suba o arquivo na plataforma correspondente.</li>
        </ul>
      </Card>
    </div>
  );
}
