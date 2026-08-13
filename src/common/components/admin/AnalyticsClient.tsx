'use client';

import { useEffect, useState } from 'react';
import { C, Card, Icon, PageHeader, Spinner } from './ui';

type Row = { n: number };
type Stats = {
  views: { total: number; last30: number; prev30: number; sessions30: number };
  viewsByDay: { day: string; n: number }[];
  topArticles: { id: string; title: string; views: number }[];
  byCountry: ({ country: string } & Row)[];
  byReferrer: ({ src: string } & Row)[];
  byChannel: ({ channel: string } & Row)[];
  byLang: ({ lang: string } & Row)[];
  topPages: ({ path: string } & Row)[];
  byWeekday: ({ dow: number } & Row)[];
  counts: Record<string, number>;
};
type DayStats = {
  day: string; views: number; sessions: number;
  pages: ({ path: string } & Row)[];
  countries: ({ country: string } & Row)[];
  channels: ({ channel: string } & Row)[];
};

const fmt = (n: number) => new Intl.NumberFormat('pt-BR').format(n || 0);
const parseDay = (s: string) => new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T00:00:00` : s);
const FLAG: Record<string, string> = { BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', FR: '🇫🇷', CA: '🇨🇦', ES: '🇪🇸', GB: '🇬🇧', DE: '🇩🇪', AR: '🇦🇷', AL: '🇦🇱', AE: '🇦🇪', AF: '🇦🇫', AM: '🇦🇲', '??': '🌐' };
const CHANNEL_EMOJI: Record<string, string> = { 'Direto': '➡️', 'Busca orgânica': '🔍', 'Social': '💬', 'IA': '🤖', 'Interno / Compartilhado': '🔗', 'Referência': '🌐' };
const LANG_META: Record<string, { flag: string; name: string }> = { pt: { flag: '🇧🇷', name: 'Português' }, en: { flag: '🇺🇸', name: 'English' }, es: { flag: '🇪🇸', name: 'Español' }, fr: { flag: '🇫🇷', name: 'Français' }, '??': { flag: '🌐', name: 'Outro' } };
const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function AnalyticsClient() {
  const [s, setS] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selDay, setSelDay] = useState<string | null>(null);
  const [day, setDay] = useState<DayStats | null>(null);
  const [dayLoading, setDayLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' }).then((r) => r.json()).then(setS).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function pickDay(d: string) {
    if (selDay === d) { setSelDay(null); setDay(null); return; }
    setSelDay(d); setDayLoading(true); setDay(null);
    fetch(`/api/admin/stats/day?date=${d}`, { cache: 'no-store' })
      .then((r) => r.json()).then(setDay).catch(() => {}).finally(() => setDayLoading(false));
  }

  if (loading) return <Spinner />;
  if (!s) return <Card><div style={{ color: C.faint, padding: 20 }}>Sem dados.</div></Card>;

  const max = Math.max(...(s.viewsByDay || []).map((d) => d.n), 1);
  const avg = s.viewsByDay?.length ? Math.round(s.views.last30 / s.viewsByDay.length) : 0;
  const trend = s.views.prev30 > 0 ? Math.round(((s.views.last30 - s.views.prev30) / s.views.prev30) * 100) : null;
  const pagesPerSession = s.views.sessions30 > 0 ? (s.views.last30 / s.views.sessions30).toFixed(1) : '—';
  const bestDow = (s.byWeekday || []).slice().sort((a, b) => b.n - a.n)[0];

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Audiência, origem do tráfego e comportamento no site." icon="chart" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 14, marginBottom: 16 }}>
        <Mini label="Visitas totais" value={fmt(s.views.total)} hint="Visitas de página desde o início do rastreamento." />
        <Mini label="Últimos 30 dias" value={fmt(s.views.last30)} trend={trend} hint="Comparado aos 30 dias anteriores." />
        <Mini label="Sessões (30d)" value={fmt(s.views.sessions30)} hint={`≈ ${pagesPerSession} páginas por sessão.`} />
        <Mini label="Média diária (30d)" value={fmt(avg)} hint="Visitas por dia no período." />
        <Mini label="Artigos publicados" value={fmt(s.counts?.published || 0)} hint="Artigos ativos no blog." />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <h3 style={h3}>Visitas por dia (30 dias)</h3>
          <span style={{ fontSize: 11.5, color: C.faint }}>
            {(s.viewsByDay || []).length > 0 && <>pico: {fmt(max)}/dia</>}
            {bestDow && <> · melhor dia: {WEEKDAYS[bestDow.dow]}</>}
            {(s.viewsByDay || []).length > 0 && <> · clique numa barra para o detalhe</>}
          </span>
        </div>
        {(s.viewsByDay || []).length === 0 ? (
          <div style={{ color: C.faint, padding: 16 }}>Ainda sem visitas registradas. O rastreamento começa assim que o site recebe acessos.</div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 200, paddingTop: 10 }}>
              {s.viewsByDay.map((d) => {
                const on = selDay === d.day;
                return (
                  <div key={d.day} onClick={() => pickDay(d.day)}
                    title={`${parseDay(d.day).toLocaleDateString('pt-BR')}: ${d.n} visitas`}
                    style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'pointer' }}>
                    <div style={{ height: `${(d.n / max) * 100}%`, minHeight: d.n ? 4 : 0, background: C.gradient, borderRadius: 4, outline: on ? `2px solid ${C.green}` : 'none', outlineOffset: 2, opacity: selDay && !on ? 0.5 : 1, transition: 'opacity .15s' }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 3, marginTop: 6, borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>
              {s.viewsByDay.map((d) => (
                <div key={d.day} style={{ flex: 1, textAlign: 'center', fontSize: 9.5, color: selDay === d.day ? C.green : C.faint, fontWeight: selDay === d.day ? 700 : 400, fontVariantNumeric: 'tabular-nums' }}>
                  {parseDay(d.day).getDate()}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 10.5, color: C.faint, marginTop: 4 }}>Dia do mês</div>
          </>
        )}
      </Card>

      {/* Detalhe do dia selecionado */}
      {selDay && (
        <Card style={{ marginBottom: 16, borderColor: C.green }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ ...h3, margin: 0 }}>📅 Detalhe de {parseDay(selDay).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</h3>
            <button onClick={() => { setSelDay(null); setDay(null); }} style={{ background: 'none', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>Fechar</button>
          </div>
          {dayLoading || !day ? <Spinner /> : (
            <>
              <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                <div><div style={{ color: C.muted, fontSize: 12 }}>Visitas</div><div style={{ fontSize: 24, fontWeight: 800 }}>{fmt(day.views)}</div></div>
                <div><div style={{ color: C.muted, fontSize: 12 }}>Sessões</div><div style={{ fontSize: 24, fontWeight: 800 }}>{fmt(day.sessions)}</div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div><h4 style={h4}>Páginas</h4><BarList items={(day.pages || []).map((p) => ({ label: p.path, n: p.n }))} /></div>
                <div><h4 style={h4}>Países</h4><BarList items={(day.countries || []).map((c) => ({ label: `${FLAG[c.country] || '🌐'} ${c.country}`, n: c.n }))} /></div>
                <div><h4 style={h4}>Origem</h4><BarList items={(day.channels || []).map((c) => ({ label: `${CHANNEL_EMOJI[c.channel] || '🌐'} ${c.channel}`, n: c.n }))} /></div>
              </div>
            </>
          )}
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
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
          <h3 style={h3}>🧭 Origem do tráfego</h3>
          <BarList pct items={(s.byChannel || []).map((x) => ({ label: `${CHANNEL_EMOJI[x.channel] || '🌐'} ${x.channel}`, n: x.n }))} />
        </Card>

        <Card>
          <h3 style={h3}><Icon name="globe" size={15} /> Países</h3>
          <BarList items={(s.byCountry || []).map((x) => ({ label: `${FLAG[x.country] || '🌐'} ${x.country}`, n: x.n }))} />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.3fr', gap: 16 }}>
        <Card>
          <h3 style={h3}>🌎 Idiomas</h3>
          <BarList pct items={(s.byLang || []).map((x) => ({ label: `${(LANG_META[x.lang] || LANG_META['??']).flag} ${(LANG_META[x.lang] || LANG_META['??']).name}`, n: x.n }))} />
        </Card>

        <Card>
          <h3 style={h3}><Icon name="external" size={15} /> Sites de origem</h3>
          <BarList items={(s.byReferrer || []).map((x) => ({ label: x.src, n: x.n }))} />
        </Card>

        <Card>
          <h3 style={h3}>📄 Páginas mais vistas</h3>
          <BarList items={(s.topPages || []).map((x) => ({ label: x.path, n: x.n }))} />
        </Card>
      </div>
    </div>
  );
}

function Mini({ label, value, hint, trend }: { label: string; value: string; hint?: string; trend?: number | null }) {
  const up = (trend ?? 0) >= 0;
  return (
    <Card>
      <div style={{ color: C.muted, fontSize: 12.5 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
        {typeof trend === 'number' && (
          <span style={{ fontSize: 12.5, fontWeight: 700, color: up ? C.green : '#f87171' }}>{up ? '▲' : '▼'} {Math.abs(trend)}%</span>
        )}
      </div>
      {hint && <div style={{ color: C.faint, fontSize: 11, marginTop: 6, lineHeight: 1.4 }}>{hint}</div>}
    </Card>
  );
}

function BarList({ items, pct = false }: { items: { label: string; n: number }[]; pct?: boolean }) {
  if (!items.length) return <Empty />;
  const max = Math.max(...items.map((i) => i.n), 1);
  const total = items.reduce((a, b) => a + b.n, 0) || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3, gap: 8 }}>
            <span style={{ color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
            <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(it.n)}{pct && <span style={{ color: C.faint, fontWeight: 400 }}> · {Math.round((it.n / total) * 100)}%</span>}</span>
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
const h4: React.CSSProperties = { fontSize: 12, fontWeight: 700, margin: '0 0 10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '.04em' };
