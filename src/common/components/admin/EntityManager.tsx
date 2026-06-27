'use client';

import { uploadImage } from '@/common/supabase/upload';
import { useEffect, useState } from 'react';
import { C, Card, Button, Badge, Icon, Modal, Field, Input, Textarea, Select, PageHeader, ErrorBar, Spinner, table as T } from './ui';

export type FieldType = 'text' | 'textarea' | 'int' | 'bool' | 'image' | 'select';
export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  listCol?: boolean;
}

interface Props {
  entity: string;
  title: string;
  description?: string;
  icon?: string;
  fields: FieldDef[];
  canPublish?: boolean;
}

type Item = Record<string, any> & { id: string; disabled?: boolean };

export function EntityManager({ entity, title, description, icon = 'layers', fields, canPublish = true }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/${entity}`, { cache: 'no-store' });
      setItems(await r.json());
    } catch {
      setError('Falha ao carregar.');
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  function startNew() {
    const blank: Record<string, any> = {};
    fields.forEach((f) => (blank[f.key] = f.type === 'bool' ? true : ''));
    setForm(blank);
    setEditing({ id: '' } as Item);
  }
  function startEdit(item: Item) {
    const f: Record<string, any> = {};
    fields.forEach((fd) => (f[fd.key] = item[fd.key] ?? (fd.type === 'bool' ? false : '')));
    setForm(f);
    setEditing(item);
  }

  async function handleUpload(key: string, file: File) {
    setUploadingKey(key);
    try {
      const url = await uploadImage(file);
      setForm((p) => ({ ...p, [key]: url }));
    } catch (e) {
      setError('Falha no upload: ' + (e as Error).message);
    }
    setUploadingKey(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const isNew = !editing?.id;
      const r = await fetch(`/api/admin/${entity}${isNew ? '' : '/' + editing!.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error((await r.json()).error || 'erro');
      setEditing(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm('Excluir definitivamente?')) return;
    await fetch(`/api/admin/${entity}/${id}`, { method: 'DELETE' });
    await load();
  }
  async function togglePublish(item: Item) {
    await fetch(`/api/admin/${entity}/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disabled: !item.disabled }),
    });
    await load();
  }

  const listCols = fields.filter((f) => f.listCol !== false && f.type !== 'image' && f.type !== 'textarea').slice(0, 3);

  return (
    <div>
      <PageHeader title={title} subtitle={description} icon={icon} actions={<Button variant="primary" icon="plus" onClick={startNew}>Novo</Button>} />

      {error && !editing && <ErrorBar>{error}</ErrorBar>}

      {loading ? (
        <Spinner />
      ) : (
        <table style={T.table}>
          <thead>
            <tr>
              {listCols.map((c) => <th key={c.key} style={T.th}>{c.label}</th>)}
              {canPublish && <th style={T.th}>Status</th>}
              <th style={T.th}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                {listCols.map((c) => (
                  <td key={c.key} style={T.td}>{String(it[c.key] ?? '').replace(/<[^>]+>/g, '').slice(0, 60) || '—'}</td>
                ))}
                {canPublish && (
                  <td style={T.td}>
                    <span onClick={() => togglePublish(it)} style={{ cursor: 'pointer' }}>
                      {it.disabled ? <Badge tone="draft">Rascunho</Badge> : <Badge tone="live">Publicado</Badge>}
                    </span>
                  </td>
                )}
                <td style={{ ...T.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Button variant="ghost" icon="edit" onClick={() => startEdit(it)} style={{ marginRight: 6 }}>Editar</Button>
                  <Button variant="danger" icon="trash" onClick={() => remove(it.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan={6} style={{ ...T.td, color: C.faint }}>Nada cadastrado ainda.</td></tr>}
          </tbody>
        </table>
      )}

      {editing && (
        <Modal
          title={editing.id ? `Editar ${title.toLowerCase()}` : `Novo ${title.toLowerCase()}`}
          width={560}
          onClose={() => setEditing(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</Button>
            </>
          }
        >
          {error && <ErrorBar>{error}</ErrorBar>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.type === 'textarea' ? (
                  <Textarea value={form[f.key] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />
                ) : f.type === 'select' ? (
                  <Select value={form[f.key] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}>
                    <option value="">— selecione —</option>
                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                ) : f.type === 'bool' ? (
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: C.muted }}>
                    <input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))} /> Ativo
                  </label>
                ) : f.type === 'image' ? (
                  <div>
                    {form[f.key] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form[f.key]} alt="" style={{ height: 60, borderRadius: 8, marginBottom: 8, display: 'block' }} />
                    )}
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.06)', border: `1px solid ${C.borderStrong}`, color: C.text, borderRadius: 10, padding: '8px 13px', fontSize: 13, cursor: 'pointer' }}>
                      <Icon name="upload" size={15} /> Enviar imagem
                      <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleUpload(f.key, e.target.files[0])} />
                    </label>
                    {uploadingKey === f.key && <span style={{ fontSize: 12, color: C.muted, marginLeft: 8 }}>enviando…</span>}
                  </div>
                ) : (
                  <Input type={f.type === 'int' ? 'number' : 'text'} value={form[f.key] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />
                )}
              </Field>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
