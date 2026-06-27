'use client';

import { useEffect, useState } from 'react';
import { C, Card, Icon, PageHeader, Spinner } from './ui';

type Stats = {
  views: { total: number; last30: number };
  viewsByDay: { day: string; n: number }[];
  topArticles: { id: string; title: string; views: number }[];
  byCountry: { country: string; n: number }[];
  byReferrer: { src: string; n: number }[];
  counts: Record<string, number>;
};
const fmt = (n: number) => new Intl.NumberFormat('pt-BR').format(n || 0);
const FLAG: Record<string, string> = { BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', FR: '🇫🇷', CA: '🇨🇦', ES: '🇪🇸', GB: '🇬🇧', DE: '🇩🇪', '??': '🌐' };

export function AnalyticsClient() {
  const [s, setS] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' }).then((r) => r.json()).then(setS).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!s) return <Card><div style={{ color: C.faint, padding: 20 }}>Sem dados.</div></Card>;

  const max = Math.max(...(s.viewsByDay || []).map((d) => d.n), 1);
  const avg = s.viewsByDay?.length ? Math.round(s.views.last30 / s.viewsByDay.length) : 0;

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Audiência do site nos últimos períodos." icon="chart" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 14, marginBottom: 16 }}>
        <Mini label="Visitas totais" value={fmt(s.views.total)} />
        <Mini label="Últimos 30 dias" value={fmt(s.views.last30)} />
        <Mini label="Média diária (30d)" value={fmt(avg)} />
        <Mini label="Artigos publicados" value={fmt(s.counts?.published || 0)} />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <h3 style={h3}>Visitas por dia (30 dias)</h3>
        {(s.viewsByDay || []).length === 0 ? (
          <div style={{ color: C.faint, padding: 16 }}>Ainda sem visitas registradas. O rastreamento começa assim que o site recebe acessos.</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 200, paddingTop: 10 }}>
            {s.viewsByDay.map((d) => (
              <div key={d.day} title={`${new Date(d.day).toLocaleDateString('pt-BR')}: ${d.n} visitas`} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ height: `${(d.n / max) * 100}%`, minHeight: d.n ? 4 : 0, background: C.gradient, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        )}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={h3}><Icon name="star" size={15} /> Posts mais vistos</h3>
          {(s.topArticles || []).filter((a) => a.views > 0).length === 0 ? <Empty /> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {s.topArticles.filter((a) => a.views > 0).map((a, i) => (
                  <tr key={a.id} style={{ borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                    <td style={{ padding: '9px 0', fontSize: 13, color: C.faint, width: 24 }}>{i + 1}</td>
                    <td style={{ padding: '9px 0', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{a.title}</td>
                    <td style={{ padding: '9px 0', fontSize: 13, fontWeight: 700, color: C.green, textAlign: 'right' }}>{fmt(a.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          <h3 style={h3}><Icon name="globe" size={15} /> Países</h3>
          <BarList items={(s.byCountry || []).map((x) => ({ label: `${FLAG[x.country] || '🌐'} ${x.country}`, n: x.n }))} />
        </Card>

        <Card>
          <h3 style={h3}><Icon name="external" size={15} /> Canais</h3>
          <BarList items={(s.byReferrer || []).map((x) => ({ label: x.src, n: x.n }))} />
        </Card>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <div style={{ color: C.muted, fontSize: 12.5 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{value}</div>
    </Card>
  );
}
function BarList({ items }: { items: { label: string; n: number }[] }) {
  if (!items.length) return <Empty />;
  const max = Math.max(...items.map((i) => i.n), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3 }}>
            <span style={{ color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>{it.label}</span>
            <span style={{ fontWeight: 600 }}>{new Intl.NumberFormat('pt-BR').format(it.n)}</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(it.n / max) * 100}%`, height: '100%', background: C.gradient }} />
          </div>
        </div>
      ))}
    </div>
  );
}
const Empty = () => <div style={{ color: C.faint, fontSize: 13, padding: '10px 0' }}>Sem dados ainda.</div>;
const h3: React.CSSProperties = { fontSize: 14, fontWeight: 700, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 };
