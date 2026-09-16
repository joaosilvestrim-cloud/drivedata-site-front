'use client';

import { type ApplicationStatus, type JobApplicationModel, type JobModel } from '@/common/model/job.model';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button, C, Card, ErrorBar, Modal, PageHeader, Select, Spinner, Textarea, table as T } from './ui';

const STATUS: Record<ApplicationStatus, string> = {
  new: 'Nova',
  reviewing: 'Em análise',
  interview: 'Entrevista',
  approved: 'Aprovada',
  rejected: 'Não seguiu',
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const fmtBytes = (b?: number | null) => (!b ? '' : b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

// Candidaturas: filtro por vaga, status, notas internas e download do currículo.
export function ApplicationsClient() {
  const params = useSearchParams();
  const [jobId, setJobId] = useState(params.get('job') ?? '');
  const [jobs, setJobs] = useState<JobModel[]>([]);
  const [items, setItems] = useState<JobApplicationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [removing, setRemoving] = useState<JobApplicationModel | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [j, a] = await Promise.all([
        fetch('/api/admin/jobs', { cache: 'no-store' }).then((r) => r.json()),
        fetch(`/api/admin/applications${jobId ? `?job=${jobId}` : ''}`, { cache: 'no-store' }).then((r) => r.json()),
      ]);
      setJobs(Array.isArray(j) ? j : []);
      setItems(Array.isArray(a) ? a : []);
    } catch {
      setError('Não conseguimos carregar as candidaturas. Recarregue a página.');
    }
    setLoading(false);
  }, [jobId]);
  useEffect(() => {
    load();
  }, [load]);

  async function patch(a: JobApplicationModel, body: { status?: ApplicationStatus; notes?: string }) {
    try {
      const r = await fetch(`/api/admin/applications/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      setItems((prev) => prev.map((x) => (x.id === a.id ? { ...x, ...body } : x)));
    } catch {
      setError('Não conseguimos salvar a alteração. Tente de novo.');
    }
  }

  async function openCv(a: JobApplicationModel) {
    try {
      const r = await fetch(`/api/admin/applications/${a.id}?cv=1`);
      const j = (await r.json()) as { url?: string };
      if (!j.url) throw new Error();
      window.open(j.url, '_blank', 'noopener');
    } catch {
      setError('Não conseguimos abrir o currículo. Tente de novo em instantes.');
    }
  }

  async function remove() {
    if (!removing) return;
    try {
      await fetch(`/api/admin/applications/${removing.id}`, { method: 'DELETE' });
    } catch {
      setError('Não conseguimos excluir a candidatura. Tente de novo.');
    }
    setRemoving(null);
    await load();
  }

  const novas = items.filter((a) => a.status === 'new').length;

  return (
    <div>
      <PageHeader
        title="Candidaturas"
        subtitle="Quem se candidatou às vagas do site. Abra o currículo, mude o status e anote o que importa."
        icon="users"
        actions={
          <Select value={jobId} onChange={(e) => setJobId(e.target.value)} style={{ width: 280 }}>
            <option value="">Todas as vagas</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}{j.status !== 'open' ? ' (encerrada)' : ''}</option>
            ))}
          </Select>
        }
      />
      {error && <ErrorBar>{error}</ErrorBar>}

      <div style={{ display: 'flex', gap: 14, marginBottom: 16, color: C.muted, fontSize: 13 }}>
        <span><b style={{ color: C.text, fontSize: 18 }}>{items.length}</b> candidatura{items.length === 1 ? '' : 's'}</span>
        <span><b style={{ color: C.green, fontSize: 18 }}>{novas}</b> nova{novas === 1 ? '' : 's'}</span>
      </div>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Card><div style={{ color: C.muted, fontSize: 14 }}>Nenhuma candidatura por aqui ainda.</div></Card>
      ) : (
        <table style={T.table}>
          <thead>
            <tr>
              <th style={T.th}>Candidato</th>
              <th style={T.th}>Vaga</th>
              <th style={T.th}>Recebida</th>
              <th style={T.th}>Currículo</th>
              <th style={T.th}>Status</th>
              <th style={{ ...T.th, textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <Row
                key={a.id}
                a={a}
                open={open === a.id}
                notes={notes}
                setNotes={setNotes}
                onToggle={() => { setOpen(open === a.id ? null : a.id); setNotes(a.notes ?? ''); }}
                onStatus={(s) => patch(a, { status: s })}
                onSaveNotes={() => patch(a, { notes })}
                onCv={() => openCv(a)}
                onRemove={() => setRemoving(a)}
              />
            ))}
          </tbody>
        </table>
      )}

      {removing && (
        <Modal
          title="Excluir candidatura"
          onClose={() => setRemoving(null)}
          width={480}
          footer={
            <>
              <Button onClick={() => setRemoving(null)}>Cancelar</Button>
              <Button variant="danger" onClick={remove}>Excluir</Button>
            </>
          }
        >
          <p style={{ margin: 0, color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
            A candidatura de <b style={{ color: C.text }}>{removing.name}</b> e o currículo serão apagados. Não dá para desfazer.
          </p>
        </Modal>
      )}
    </div>
  );
}

function Row({ a, open, notes, setNotes, onToggle, onStatus, onSaveNotes, onCv, onRemove }: {
  a: JobApplicationModel;
  open: boolean;
  notes: string;
  setNotes: (v: string) => void;
  onToggle: () => void;
  onStatus: (s: ApplicationStatus) => void;
  onSaveNotes: () => void;
  onCv: () => void;
  onRemove: () => void;
}) {
  const link = (href: string | null, label: string) =>
    href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: C.green, textDecoration: 'none', marginRight: 10 }}>
        {label} ↗
      </a>
    ) : null;
  return (
    <>
      <tr>
        <td style={T.td}>
          <div style={{ fontWeight: 600 }}>{a.name}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            <a href={`mailto:${a.email}`} style={{ color: C.muted }}>{a.email}</a>{a.phone ? ` · ${a.phone}` : ''}
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{link(a.linkedinUrl, 'LinkedIn')}{link(a.portfolioUrl, 'Portfólio')}</div>
        </td>
        <td style={T.td}>
          <a href={`/vagas/${a.jobSlug}`} target="_blank" rel="noopener noreferrer" style={{ color: C.text, textDecoration: 'none' }}>{a.jobTitle}</a>
        </td>
        <td style={{ ...T.td, whiteSpace: 'nowrap', color: C.muted, fontSize: 13 }}>{fmt(a.createdAt)}</td>
        <td style={T.td}>
          {a.cvPath ? (
            <Button variant="ghost" icon="doc" onClick={onCv} title={a.cvName ?? 'Currículo'}>
              {fmtBytes(a.cvSize) || 'Abrir'}
            </Button>
          ) : (
            <span style={{ color: C.faint, fontSize: 12 }}>sem arquivo</span>
          )}
        </td>
        <td style={T.td}>
          <Select value={a.status} onChange={(e) => onStatus(e.target.value as ApplicationStatus)} style={{ width: 150, padding: '7px 10px', fontSize: 13 }}>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
        </td>
        <td style={{ ...T.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
          <Button variant="subtle" onClick={onToggle}>{open ? 'Fechar' : a.message || a.notes ? 'Detalhes' : 'Notas'}</Button>
          <Button variant="subtle" icon="trash" title="Excluir" style={{ color: C.danger }} onClick={onRemove} />
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6} style={{ ...T.td, background: C.panel2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <div style={{ fontSize: 11.5, color: C.faint, marginBottom: 6 }}>Mensagem do candidato</div>
                <div style={{ fontSize: 14, whiteSpace: 'pre-wrap', color: a.message ? C.text : C.faint, lineHeight: 1.6 }}>{a.message || 'Não escreveu mensagem.'}</div>
                {a.page && <div style={{ fontSize: 12, color: C.faint, marginTop: 10 }}>Origem: {a.source || 'site'} · {a.page}</div>}
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: C.faint, marginBottom: 6 }}>Notas internas</div>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Só a equipe vê." />
                <div style={{ marginTop: 8, textAlign: 'right' }}>
                  <Button variant="primary" onClick={onSaveNotes}>Salvar notas</Button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
