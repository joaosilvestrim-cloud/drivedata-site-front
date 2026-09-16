'use client';

import {
  CONTRACT_LABEL,
  WORK_MODEL_LABEL,
  type JobModel,
  type JobStatus,
} from '@/common/model/job.model';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { Badge, Button, C, Card, ErrorBar, Field, Input, Modal, PageHeader, Select, Spinner, Textarea, table as T } from './ui';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const STATUS: Record<JobStatus, { label: string; tone: 'live' | 'draft' | 'neutral' }> = {
  draft: { label: 'Rascunho', tone: 'draft' },
  open: { label: 'Aberta', tone: 'live' },
  closed: { label: 'Encerrada', tone: 'neutral' },
};

const quillModules = {
  toolbar: [[{ header: [2, 3, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
};

type Draft = Partial<JobModel>;

const blank = (): Draft => ({
  title: '', slug: '', area: '', location: '', workModel: 'remoto', contractType: 'clt', seniority: '',
  summary: '', description: '', requirements: '', benefits: '', status: 'draft', locale: 'pt', applyUrl: '', closesAt: '',
});

// Vagas: lista, editor, publicar/encerrar e compartilhar no LinkedIn.
export function JobsManager() {
  const [items, setItems] = useState<JobModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<JobModel | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/admin/jobs', { cache: 'no-store' });
      if (!r.ok) throw new Error();
      setItems(await r.json());
    } catch {
      setError('Não conseguimos carregar as vagas. Recarregue a página.');
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const publicUrl = (j: JobModel) => `${window.location.origin}/vagas/${j.slug}`;
  const shareLinkedIn = (j: JobModel) =>
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl(j))}`,
      '_blank',
      'noopener,width=640,height=580',
    );
  const copyLink = async (j: JobModel) => {
    try {
      await navigator.clipboard.writeText(publicUrl(j));
      setCopied(j.id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* sem clipboard */
    }
  };

  const set = <K extends keyof JobModel>(k: K, v: JobModel[K]) => setEditing((p) => ({ ...(p ?? {}), [k]: v }));

  async function save() {
    if (!editing) return;
    if (!editing.title?.trim()) {
      setFormError('Dê um título à vaga.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const isNew = !editing.id;
      const r = await fetch(isNew ? '/api/admin/jobs' : `/api/admin/jobs/${editing.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (!r.ok) throw new Error();
      setEditing(null);
      await load();
    } catch {
      setFormError('Não conseguimos salvar. Confira os campos e tente de novo.');
    }
    setSaving(false);
  }

  async function setStatus(j: JobModel, status: JobStatus) {
    try {
      await fetch(`/api/admin/jobs/${j.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      setError('Não conseguimos mudar o status. Tente de novo.');
    }
    await load();
  }

  async function remove() {
    if (!removing) return;
    try {
      await fetch(`/api/admin/jobs/${removing.id}`, { method: 'DELETE' });
    } catch {
      setError('Não conseguimos excluir a vaga. Tente de novo.');
    }
    setRemoving(null);
    await load();
  }

  const dateInput = (iso?: string | null) => (iso ? iso.slice(0, 10) : '');

  return (
    <div>
      <PageHeader
        title="Vagas"
        subtitle="Abra oportunidades, publique e compartilhe no LinkedIn. As candidaturas chegam em Candidaturas."
        icon="briefcase"
        actions={
          <Button variant="primary" icon="plus" onClick={() => { setFormError(null); setEditing(blank()); }}>
            Nova vaga
          </Button>
        }
      />
      {error && <ErrorBar>{error}</ErrorBar>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Card>
          <div style={{ color: C.muted, fontSize: 14 }}>Nenhuma vaga ainda. Crie a primeira em “Nova vaga”.</div>
        </Card>
      ) : (
        <table style={T.table}>
          <thead>
            <tr>
              <th style={T.th}>Vaga</th>
              <th style={T.th}>Modelo</th>
              <th style={T.th}>Status</th>
              <th style={T.th}>Candidaturas</th>
              <th style={{ ...T.th, textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((j) => (
              <tr key={j.id}>
                <td style={T.td}>
                  <div style={{ fontWeight: 600 }}>{j.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    {[j.area, j.location, CONTRACT_LABEL[j.contractType]].filter(Boolean).join(' · ')}
                  </div>
                </td>
                <td style={T.td}>{WORK_MODEL_LABEL[j.workModel]}</td>
                <td style={T.td}>
                  <Badge tone={STATUS[j.status].tone}>{STATUS[j.status].label}</Badge>
                </td>
                <td style={T.td}>
                  <a href={`/admin/candidaturas?job=${j.id}`} style={{ color: C.green, fontWeight: 600, textDecoration: 'none' }}>
                    {j.applications ?? 0}
                  </a>
                </td>
                <td style={{ ...T.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {j.status === 'open' ? (
                    <Button variant="subtle" onClick={() => setStatus(j, 'closed')}>Encerrar</Button>
                  ) : (
                    <Button variant="subtle" onClick={() => setStatus(j, 'open')}>Publicar</Button>
                  )}
                  <Button variant="subtle" onClick={() => copyLink(j)}>{copied === j.id ? 'Copiado' : 'Copiar link'}</Button>
                  <Button
                    variant="subtle"
                    onClick={() => shareLinkedIn(j)}
                    disabled={j.status !== 'open'}
                    title={j.status !== 'open' ? 'Publique a vaga antes de compartilhar' : 'Compartilhar no LinkedIn'}
                  >
                    LinkedIn
                  </Button>
                  <Button variant="subtle" icon="external" title="Abrir página" onClick={() => window.open(`/vagas/${j.slug}`, '_blank')} />
                  <Button variant="subtle" icon="edit" title="Editar" onClick={() => { setFormError(null); setEditing({ ...j }); }} />
                  <Button variant="subtle" icon="trash" title="Excluir" style={{ color: C.danger }} onClick={() => setRemoving(j)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <Modal
          title={editing.id ? 'Editar vaga' : 'Nova vaga'}
          onClose={() => setEditing(null)}
          width={880}
          footer={
            <>
              <Button onClick={() => setEditing(null)}>Cancelar</Button>
              <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</Button>
            </>
          }
        >
          {formError && <ErrorBar>{formError}</ErrorBar>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Título">
                <Input value={editing.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Ex.: Engenheiro(a) de Dados Pleno" />
              </Field>
            </div>
            <Field label="Área">
              <Input value={editing.area ?? ''} onChange={(e) => set('area', e.target.value)} placeholder="Engenharia de Dados" />
            </Field>
            <Field label="Local">
              <Input value={editing.location ?? ''} onChange={(e) => set('location', e.target.value)} placeholder="Barueri/SP · Brasil" />
            </Field>
            <Field label="Modelo de trabalho">
              <Select value={editing.workModel ?? 'remoto'} onChange={(e) => set('workModel', e.target.value as JobModel['workModel'])}>
                {Object.entries(WORK_MODEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
            <Field label="Contrato">
              <Select value={editing.contractType ?? 'clt'} onChange={(e) => set('contractType', e.target.value as JobModel['contractType'])}>
                {Object.entries(CONTRACT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
            <Field label="Senioridade">
              <Input value={editing.seniority ?? ''} onChange={(e) => set('seniority', e.target.value)} placeholder="Júnior · Pleno · Sênior" />
            </Field>
            <Field label="Inscrições até" hint="Opcional. Depois desta data a vaga sai do site sozinha.">
              <Input type="date" value={dateInput(editing.closesAt)} onChange={(e) => set('closesAt', e.target.value)} />
            </Field>
            <Field label="Status" hint="Só vagas abertas aparecem no site.">
              <Select value={editing.status ?? 'draft'} onChange={(e) => set('status', e.target.value as JobStatus)}>
                <option value="draft">Rascunho</option>
                <option value="open">Aberta</option>
                <option value="closed">Encerrada</option>
              </Select>
            </Field>
            <Field label="Idioma da vaga">
              <Select value={editing.locale ?? 'pt'} onChange={(e) => set('locale', e.target.value)}>
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </Select>
            </Field>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Resumo" hint="Uma ou duas frases. Aparece na lista e no card do LinkedIn.">
                <Textarea value={editing.summary ?? ''} onChange={(e) => set('summary', e.target.value)} style={{ minHeight: 70 }} />
              </Field>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Sobre a vaga">
                <div className="job-quill">
                  <ReactQuill theme="snow" modules={quillModules} value={editing.description ?? ''} onChange={(v: string) => set('description', v)} />
                </div>
              </Field>
            </div>
            <Field label="O que esperamos" hint="Um item por linha.">
              <Textarea value={editing.requirements ?? ''} onChange={(e) => set('requirements', e.target.value)} style={{ minHeight: 130 }} />
            </Field>
            <Field label="O que oferecemos" hint="Um item por linha.">
              <Textarea value={editing.benefits ?? ''} onChange={(e) => set('benefits', e.target.value)} style={{ minHeight: 130 }} />
            </Field>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Link externo de candidatura" hint="Opcional. Se preenchido, o botão da vaga leva para este link em vez do formulário do site.">
                <Input value={editing.applyUrl ?? ''} onChange={(e) => set('applyUrl', e.target.value)} placeholder="https://" />
              </Field>
            </div>
            {editing.id && (
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Endereço (slug)" hint="Muda o link público. Evite trocar depois de compartilhar.">
                  <Input value={editing.slug ?? ''} onChange={(e) => set('slug', e.target.value)} />
                </Field>
              </div>
            )}
          </div>
          <style>{`
            .job-quill .ql-toolbar{border-color:${C.borderStrong};border-radius:10px 10px 0 0;background:rgba(255,255,255,.04)}
            .job-quill .ql-container{border-color:${C.borderStrong};border-radius:0 0 10px 10px;color:${C.text};font-family:inherit;font-size:14px}
            .job-quill .ql-editor{min-height:180px}
            .job-quill .ql-snow .ql-stroke{stroke:${C.muted}} .job-quill .ql-snow .ql-fill{fill:${C.muted}}
            .job-quill .ql-picker-label{color:${C.muted}} .job-quill .ql-editor.ql-blank::before{color:${C.faint}}
          `}</style>
        </Modal>
      )}

      {removing && (
        <Modal
          title="Excluir vaga"
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
            A vaga <b style={{ color: C.text }}>{removing.title}</b> e todas as candidaturas dela serão apagadas. Não dá para desfazer.
          </p>
        </Modal>
      )}
    </div>
  );
}
