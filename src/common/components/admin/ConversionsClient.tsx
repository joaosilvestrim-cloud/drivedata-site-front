'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, C, Card, Icon, PageHeader, Spinner } from './ui';

function StepsCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <Card pad={16}>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 12 }}>{title}</div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {steps.map((s, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: C.gradient, color: '#06121f', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
            <span style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.55 }}>{s}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

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

      {/* Introdução pra quem opera (marketing) */}
      <div style={{ background: 'rgba(10,150,236,.10)', border: `1px solid rgba(10,150,236,.25)`, borderRadius: C.radius, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
          <Icon name="help" size={18} color={C.blue} />
          <strong style={{ fontSize: 14 }}>Para que serve esta página</strong>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          Aqui você baixa as <b>conversões</b> que o site e o CRM já registraram (quando uma lead vira
          <b> Lead, MQL, oportunidade (SQL) ou Venda</b>) e <b>sobe nos anúncios</b> do Google e do LinkedIn.
          Isso ensina as plataformas a buscar <b>mais gente parecida com quem realmente vira cliente</b> — e não
          só quem clica. Faça isso <b>1x por semana</b> (ou quando tiver muitas pendentes).
        </p>
      </div>

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

      {/* Diferença entre os botões */}
      <Card style={{ marginTop: 16 }} pad={16}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>Entenda os 2 botões</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          <div style={{ display: 'flex', gap: 9 }}>
            <Icon name="doc" size={16} color={C.muted} />
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
              <b style={{ color: C.text }}>Baixar CSV (prévia)</b><br />
              Só baixa o arquivo pra você conferir. <b>Não marca nada</b> — as conversões continuam pendentes.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <Icon name="upload" size={16} color={C.green} />
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
              <b style={{ color: C.text }}>Baixar e marcar enviado</b><br />
              Baixa <b>e</b> marca como enviado, pra <b>não sair de novo</b> na próxima vez. Use este quando for
              realmente subir o arquivo na plataforma.
            </div>
          </div>
        </div>
      </Card>

      {/* Passo a passo por plataforma */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginTop: 16 }}>
        <StepsCard
          title="Como subir no Google Ads"
          steps={[
            'Aqui no painel, clique em "Baixar e marcar enviado" no card do Google Ads.',
            'Abra o Google Ads e clique no ícone de chave inglesa (Ferramentas e configurações), no topo.',
            'Em "Medição", clique em "Conversões".',
            'Abra a aba "Uploads" e clique no botão "+".',
            'Escolha "Enviar um arquivo" e selecione o CSV que você baixou.',
            'Clique em "Visualizar" e depois em "Aplicar arquivo". Pronto!',
          ]}
        />
        <StepsCard
          title="Como subir no LinkedIn"
          steps={[
            'Aqui no painel, clique em "Baixar e marcar enviado" no card do LinkedIn Ads.',
            'Abra o LinkedIn Campaign Manager.',
            'No menu, vá em "Analyze" → "Conversion tracking" (Conversões).',
            'Use a opção de conversões offline / upload de arquivo e selecione o CSV.',
            'Se pedir pra mapear colunas, use o "li_fat_id" ou o e-mail (hash). Confirme.',
          ]}
        />
      </div>

      {/* Observações importantes */}
      <Card style={{ marginTop: 16 }} pad={16}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 8 }}>Importante</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.muted, fontSize: 12.5, lineHeight: 1.8 }}>
          <li><b>"Nada pendente"</b> = não há nada novo pra enviar agora. É normal — quando entrar lead vinda de anúncio, o número sobe.</li>
          <li>Só entram conversões de quem <b>clicou num anúncio</b> (têm o código de rastreio). Leads orgânicos ou diretos não aparecem aqui — é o esperado.</li>
          <li>O número aparece nas conversões conforme o <b>comercial movimenta as leads no CRM</b> (qualifica, cria oportunidade, marca venda).</li>
          <li>Pode rodar quantas vezes quiser. O <b>"marcar enviado"</b> evita enviar a mesma conversão duas vezes.</li>
        </ul>
      </Card>
    </div>
  );
}
