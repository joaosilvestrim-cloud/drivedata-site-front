'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { C, Card, Icon, Spinner, Badge, PageHeader } from './ui';

type Stats = {
  counts: Record<string, number>;
  views: { total: number; last30: number };
  viewsByDay: { day: string; n: number }[];
  topArticles: { id: string; title: string; views: number }[];
  byCountry: { country: string; n: number }[];
  byReferrer: { src: string; n: number }[];
  scheduled: { id: string; title: string; scheduledAt: string }[];
  storage: { files: number; bytes: number; images: number; documents: number };
};
type Health = {
  db: { ok: boolean };
  integrations: { key: string; label: string; ok: boolean }[];
  errors24h: number;
  scheduledDue: number;
};

const fmt = (n: number) => new Intl.NumberFormat('pt-BR').format(n || 0);
const fmtBytes = (b: number) => {
  if (!b) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), u.length - 1);
  return `${(b / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
};
const FLAG: Record<string, string> = { BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', FR: '🇫🇷', CA: '🇨🇦', ES: '🇪🇸', GB: '🇬🇧', DE: '🇩🇪', '??': '🌐' };

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  const loadHealth = useCallback(async () => {
    try {
      const h = await fetch('/api/admin/health', { cache: 'no-store' }).then((r) => r.json());
      setHealth(h);
      setLive(!!h?.db?.ok);
    } catch {
      setLive(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetch('/api/admin/stats', { cache: 'no-store' }).then((r) => r.json());
        setStats(s);
      } catch {
        /* noop */
      }
      setLoading(false);
    })();
    loadHealth();
    const id = setInterval(loadHealth, 30_000);
    return () => clearInterval(id);
  }, [loadHealth]);

  const alerts: { tone: 'danger' | 'scheduled' | 'live'; text: string }[] = [];
  if (health && !health.db.ok) alerts.push({ tone: 'danger', text: 'Banco de dados inacessível.' });
  if (health?.errors24h) alerts.push({ tone: 'danger', text: `${health.errors24h} erro(s) nas últimas 24h.` });
  if (health?.scheduledDue) alerts.push({ tone: 'scheduled', text: `${health.scheduledDue} artigo(s) agendado(s) vencido(s) aguardando publicação.` });
  (health?.integrations || []).filter((i) => !i.ok).forEach((i) => alerts.push({ tone: 'scheduled', text: `Integração desativada: ${i.label}.` }));

  const c = stats?.counts || {};

  return (
    <div>
      <PageHeader
        title="Painel de governança"
        subtitle="Visão geral do conteúdo, audiência e saúde da plataforma."
        icon="dashboard"
        actions={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: live ? C.green : C.faint, background: 'rgba(255,255,255,.04)', border: `1px solid ${C.border}`, borderRadius: 999, padding: '6px 12px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: live ? C.green : C.faint, boxShadow: live ? `0 0 8px ${C.green}` : 'none' }} />
            {live ? 'Tempo real · ativo' : 'Conectando…'}
          </span>
        }
      />

      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, padding: '10px 14px', borderRadius: 11, background: a.tone === 'danger' ? C.dangerBg : 'rgba(10,150,236,.1)', color: a.tone === 'danger' ? C.danger : '#7cc6ff', border: `1px solid ${a.tone === 'danger' ? 'rgba(255,80,80,.25)' : 'rgba(10,150,236,.25)'}` }}>
              <Icon name="alert" size={15} /> {a.text}
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 16 }}>
            <Stat icon="article" label="Artigos publicados" value={fmt(c.published || 0)} sub={`${fmt(c.drafts || 0)} rascunhos · ${fmt(c.scheduled || 0)} agendados`} href="/admin/articles" />
            <Stat icon="eye" label="Visitas (total)" value={fmt(stats?.views.total || 0)} sub={`${fmt(stats?.views.last30 || 0)} nos últimos 30 dias`} href="/admin/analytics" />
            <Stat icon="image" label="Mídia armazenada" value={fmt(stats?.storage.files || 0)} sub={fmtBytes(stats?.storage.bytes || 0)} href="/admin/media" />
            <Stat icon="layers" label="Conteúdo do site" value={fmt((c.solutions || 0) + (c.testimonials || 0) + (c.faqs || 0))} sub={`${fmt(c.solutions || 0)} soluções · ${fmt(c.faqs || 0)} FAQ`} href="/admin/solutions" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, alignItems: 'start' }}>
            {/* Views chart */}
            <Card>
              <CardTitle icon="chart" title="Visitas — últimos 30 dias" right={<Link href="/admin/analytics" style={linkStyle}>Ver detalhes →</Link>} />
              <ViewsChart data={stats?.viewsByDay || []} />
            </Card>

            {/* Health */}
            <Card>
              <CardTitle icon="server" title="Saúde do sistema" />
              <HealthRow label="Banco de dados" ok={!!health?.db.ok} />
              {(health?.integrations || []).map((i) => (
                <HealthRow key={i.key} label={i.label} ok={i.ok} />
              ))}
              <HealthRow label="Erros (24h)" ok={!health?.errors24h} value={fmt(health?.errors24h || 0)} />
              <Link href="/admin/system" style={{ ...linkStyle, display: 'inline-block', marginTop: 10 }}>Abrir central de sistema →</Link>
            </Card>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            {/* Top posts */}
            <Card>
              <CardTitle icon="star" title="Posts mais vistos" />
              {(stats?.topArticles || []).filter((a) => a.views > 0).length === 0 ? (
                <Empty>Sem visitas registradas ainda.</Empty>
              ) : (
                (stats?.topArticles || []).slice(0, 6).map((a) => (
                  <div key={a.id} style={rowStyle}>
                    <Link href={`/admin/articles`} style={{ color: C.text, textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title || '—'}</Link>
                    <Badge tone="neutral">{fmt(a.views)}</Badge>
                  </div>
                ))
              )}
            </Card>

            {/* Origin country */}
            <Card>
              <CardTitle icon="globe" title="Origem dos visitantes" />
              {(stats?.byCountry || []).length === 0 ? <Empty>Sem dados.</Empty> : (
                <BarList items={(stats?.byCountry || []).map((x) => ({ label: `${FLAG[x.country] || '🌐'} ${x.country}`, n: x.n }))} />
              )}
            </Card>

            {/* Referrers */}
            <Card>
              <CardTitle icon="external" title="Canais de tráfego" />
              {(stats?.byReferrer || []).length === 0 ? <Empty>Sem dados.</Empty> : (
                <BarList items={(stats?.byReferrer || []).map((x) => ({ label: x.src, n: x.n }))} />
              )}
            </Card>
          </div>

          {/* Scheduled */}
          {(stats?.scheduled || []).length > 0 && (
            <Card style={{ marginTop: 16 }}>
              <CardTitle icon="calendar" title="Publicações agendadas" />
              {(stats?.scheduled || []).map((s) => (
                <div key={s.id} style={rowStyle}>
                  <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title || '—'}</span>
                  <Badge tone="scheduled"><Icon name="clock" size={12} /> {new Date(s.scheduledAt).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</Badge>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ icon, label, value, sub, href }: { icon: string; label: string; value: string; sub?: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Card style={{ transition: 'border-color .15s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ color: C.muted, fontSize: 12.5 }}>{label}</span>
          <span style={{ color: C.green }}><Icon name={icon} size={18} /></span>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8, color: C.text }}>{value}</div>
        {sub && <div style={{ fontSize: 11.5, color: C.faint, marginTop: 3 }}>{sub}</div>}
      </Card>
    </Link>
  );
}

function CardTitle({ icon, title, right }: { icon: string; title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
        <span style={{ color: C.green }}><Icon name={icon} size={16} /></span> {title}
      </div>
      {right}
    </div>
  );
}

function ViewsChart({ data }: { data: { day: string; n: number }[] }) {
  if (!data.length) return <Empty>Sem visitas nos últimos 30 dias.</Empty>;
  const max = Math.max(...data.map((d) => d.n), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 150, paddingTop: 8 }}>
      {data.map((d) => (
        <div key={d.day} title={`${d.day}: ${d.n}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
          <div style={{ height: `${(d.n / max) * 100}%`, minHeight: d.n ? 3 : 0, background: C.gradient, borderRadius: 4, opacity: 0.9 }} />
        </div>
      ))}
    </div>
  );
}

function BarList({ items }: { items: { label: string; n: number }[] }) {
  const max = Math.max(...items.map((i) => i.n), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.slice(0, 6).map((it, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3 }}>
            <span style={{ color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{it.label}</span>
            <span style={{ color: C.text, fontWeight: 600 }}>{fmt(it.n)}</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(it.n / max) * 100}%`, height: '100%', background: C.gradient }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HealthRow({ label, ok, value }: { label: string; ok: boolean; value?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 13, color: C.muted }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: ok ? C.green : C.danger, fontWeight: 600 }}>
        {value ?? (ok ? 'OK' : 'Falha')}
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: ok ? C.green : C.danger }} />
      </span>
    </div>
  );
}

const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderTop: `1px solid ${C.border}` };
const linkStyle: React.CSSProperties = { color: C.green, fontSize: 12.5, textDecoration: 'none', fontWeight: 600 };
function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ color: C.faint, fontSize: 13, padding: '12px 0' }}>{children}</div>;
}
