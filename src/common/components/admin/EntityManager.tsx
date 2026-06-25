'use client';

import { uploadImage } from '@/common/supabase/upload';
import { useEffect, useState } from 'react';

export type FieldType = 'text' | 'textarea' | 'int' | 'bool' | 'image' | 'select';
export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  listCol?: boolean; // mostrar na tabela
}

interface Props {
  entity: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  canPublish?: boolean; // mostra status publicado/rascunho
}

type Item = Record<string, any> & { id: string; disabled?: boolean };

export function EntityManager({ entity, title, description, fields, canPublish = true }: Props) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{title}</h1>
          {description && <p style={{ opacity: 0.65, margin: '4px 0 0' }}>{description}</p>}
        </div>
        <button onClick={startNew} style={btn.primary}>
          + Novo
        </button>
      </div>

      {error && <div style={S.error}>{error}</div>}

      {loading ? (
        <p style={{ opacity: 0.6, marginTop: 20 }}>Carregando…</p>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              {listCols.map((c) => (
                <th key={c.key} style={S.th}>
                  {c.label}
                </th>
              ))}
              {canPublish && <th style={S.th}>Status</th>}
              <th style={S.th}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                {listCols.map((c) => (
                  <td key={c.key} style={S.td}>
                    {String(it[c.key] ?? '').replace(/<[^>]+>/g, '').slice(0, 60) || '—'}
                  </td>
                ))}
                {canPublish && (
                  <td style={S.td}>
                    <button onClick={() => togglePublish(it)} style={it.disabled ? badge.draft : badge.live}>
                      {it.disabled ? 'Rascunho' : 'Publicado'}
                    </button>
                  </td>
                )}
                <td style={{ ...S.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button onClick={() => startEdit(it)} style={btn.ghost}>
                    Editar
                  </button>
                  <button onClick={() => remove(it.id)} style={btn.danger}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={6} style={{ ...S.td, opacity: 0.5 }}>
                  Nada cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editing && (
        <div style={S.backdrop} onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div style={S.modal}>
            <h2 style={{ margin: '0 0 14px', fontSize: 18 }}>{editing.id ? 'Editar' : 'Novo'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {fields.map((f) => (
                <div key={f.key}>
                  <label style={S.label}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      style={{ ...S.input, minHeight: 90, resize: 'vertical' }}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      style={S.input}
                    >
                      <option value="">— selecione —</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'bool' ? (
                    <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
                      <input
                        type="checkbox"
                        checked={!!form[f.key]}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))}
                      />
                      Ativo
                    </label>
                  ) : f.type === 'image' ? (
                    <div>
                      {form[f.key] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form[f.key]} alt="" style={{ height: 54, borderRadius: 6, marginBottom: 6, display: 'block' }} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleUpload(f.key, e.target.files[0])}
                        style={{ fontSize: 13 }}
                      />
                      {uploadingKey === f.key && <span style={{ fontSize: 12, opacity: 0.7 }}> enviando…</span>}
                    </div>
                  ) : (
                    <input
                      type={f.type === 'int' ? 'number' : 'text'}
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      style={S.input}
                    />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={btn.ghost}>
                Cancelar
              </button>
              <button onClick={save} disabled={saving} style={{ ...btn.primary, opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  error: { color: '#ff8a8a', background: 'rgba(255,80,80,.1)', padding: '8px 12px', borderRadius: 8, marginTop: 14, fontSize: 13 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 18, background: '#0d1526', borderRadius: 12, overflow: 'hidden' },
  th: { textAlign: 'left', padding: '11px 14px', fontSize: 12, opacity: 0.6, fontWeight: 600 },
  td: { padding: '11px 14px', fontSize: 14 },
  label: { display: 'block', fontSize: 12, opacity: 0.8, marginBottom: 5 },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,255,255,.14)',
    borderRadius: 9,
    padding: '10px 12px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.6)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '50px 20px',
    zIndex: 50,
    overflowY: 'auto',
  },
  modal: { width: '100%', maxWidth: 560, background: '#0d1526', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 24, color: '#fff' },
};

const btn: Record<string, React.CSSProperties> = {
  primary: { background: 'linear-gradient(120deg,#0a96ec,#54da89)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
  ghost: { background: 'rgba(255,255,255,.07)', color: '#fff', border: '1px solid rgba(255,255,255,.14)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 13, marginLeft: 6 },
  danger: { background: 'rgba(255,80,80,.12)', color: '#ff8a8a', border: '1px solid rgba(255,80,80,.3)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 13, marginLeft: 6 },
};

const badge: Record<string, React.CSSProperties> = {
  live: { background: 'rgba(84,218,137,.15)', color: '#54da89', border: 'none', borderRadius: 999, padding: '4px 10px', fontSize: 12, cursor: 'pointer' },
  draft: { background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.7)', border: 'none', borderRadius: 999, padding: '4px 10px', fontSize: 12, cursor: 'pointer' },
};
