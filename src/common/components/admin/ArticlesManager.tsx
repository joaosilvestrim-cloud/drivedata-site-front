'use client';

import { uploadImage } from '@/common/supabase/upload';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type Article = {
  id: string;
  title: string;
  subTitle?: string;
  description?: string;
  content?: string;
  categoryId?: string;
  imageUrl?: string;
  disabled?: boolean;
};
type Category = { id: string; name: string };

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
};

export function ArticlesManager() {
  const [items, setItems] = useState<Article[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<Partial<Article>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [a, c] = await Promise.all([
        fetch('/api/admin/article', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/article-category', { cache: 'no-store' }).then((r) => r.json()),
      ]);
      setItems(Array.isArray(a) ? a : []);
      setCats(Array.isArray(c) ? c : []);
    } catch {
      setError('Falha ao carregar.');
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setForm({ title: '', subTitle: '', description: '', content: '', categoryId: '', imageUrl: '' });
    setEditing({ id: '' } as Article);
  }
  function startEdit(a: Article) {
    setForm({ ...a });
    setEditing(a);
  }

  async function handleCover(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((p) => ({ ...p, imageUrl: url }));
    } catch (e) {
      setError('Upload falhou: ' + (e as Error).message);
    }
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const isNew = !editing?.id;
      const r = await fetch(`/api/admin/article${isNew ? '' : '/' + editing!.id}`, {
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
    if (!confirm('Excluir este artigo definitivamente?')) return;
    await fetch(`/api/admin/article/${id}`, { method: 'DELETE' });
    await load();
  }
  async function togglePublish(a: Article) {
    await fetch(`/api/admin/article/${a.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disabled: !a.disabled }),
    });
    await load();
  }

  const catName = (id?: string) => cats.find((c) => c.id === id)?.name ?? '—';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Artigos</h1>
          <p style={{ opacity: 0.65, margin: '4px 0 0' }}>Crie, edite e publique os artigos do blog.</p>
        </div>
        <button onClick={startNew} style={btn.primary}>
          + Novo artigo
        </button>
      </div>

      {error && <div style={S.error}>{error}</div>}

      {loading ? (
        <p style={{ opacity: 0.6, marginTop: 20 }}>Carregando…</p>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Título</th>
              <th style={S.th}>Categoria</th>
              <th style={S.th}>Status</th>
              <th style={S.th}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                <td style={S.td}>{a.title?.slice(0, 70) || '—'}</td>
                <td style={S.td}>{catName(a.categoryId)}</td>
                <td style={S.td}>
                  <button onClick={() => togglePublish(a)} style={a.disabled ? badge.draft : badge.live}>
                    {a.disabled ? 'Rascunho' : 'Publicado'}
                  </button>
                </td>
                <td style={{ ...S.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button onClick={() => startEdit(a)} style={btn.ghost}>
                    Editar
                  </button>
                  <button onClick={() => remove(a.id)} style={btn.danger}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={4} style={{ ...S.td, opacity: 0.5 }}>
                  Nenhum artigo ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editing && (
        <div style={S.backdrop} onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div style={S.modal}>
            <h2 style={{ margin: '0 0 14px', fontSize: 18 }}>{editing.id ? 'Editar artigo' : 'Novo artigo'}</h2>

            <label style={S.label}>Título</label>
            <input style={S.input} value={form.title ?? ''} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />

            <label style={S.label}>Subtítulo</label>
            <input style={S.input} value={form.subTitle ?? ''} onChange={(e) => setForm((p) => ({ ...p, subTitle: e.target.value }))} />

            <label style={S.label}>Resumo (aparece nos cards)</label>
            <textarea
              style={{ ...S.input, minHeight: 70, resize: 'vertical' }}
              value={form.description ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />

            <label style={S.label}>Categoria</label>
            <select style={S.input} value={form.categoryId ?? ''} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
              <option value="">— selecione —</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label style={S.label}>Imagem de capa</label>
            {form.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imageUrl} alt="" style={{ height: 80, borderRadius: 8, marginBottom: 6, display: 'block' }} />
            )}
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleCover(e.target.files[0])} style={{ fontSize: 13 }} />
            {uploading && <span style={{ fontSize: 12, opacity: 0.7 }}> enviando…</span>}

            <label style={{ ...S.label, marginTop: 14 }}>Conteúdo</label>
            <div style={{ background: '#fff', borderRadius: 8, color: '#111' }}>
              <ReactQuill
                theme="snow"
                modules={QUILL_MODULES}
                value={form.content ?? ''}
                onChange={(v: string) => setForm((p) => ({ ...p, content: v }))}
              />
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
  label: { display: 'block', fontSize: 12, opacity: 0.8, margin: '12px 0 5px' },
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
    padding: '40px 20px',
    zIndex: 50,
    overflowY: 'auto',
  },
  modal: { width: '100%', maxWidth: 720, background: '#0d1526', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 24, color: '#fff' },
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
