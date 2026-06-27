'use client';

import { uploadAsset } from '@/common/supabase/upload';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { C, Card, Button, Badge, Icon, Modal, Field, Input, Textarea, Select, PageHeader, ErrorBar, Spinner, table as T } from './ui';
import { MediaPicker } from './MediaPicker';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type I18n = Record<string, string>;
type DocAsset = { name: string; url: string; mime?: string; size?: number };
type Article = {
  id: string;
  title: I18n; subTitle: I18n; description: I18n; content: I18n; seoTitle: I18n; seoDescription: I18n;
  categoryId?: string; imageUrl?: string; slug?: string; author?: string;
  tags?: string[]; documents?: DocAsset[];
  status?: 'draft' | 'published' | 'scheduled'; scheduledAt?: string; publishedAt?: string;
  views?: number; createdAt?: string; disabled?: boolean;
};
type Category = { id: string; name: string };

const LANGS = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];
const I18N_KEYS = ['title', 'subTitle', 'description', 'content', 'seoTitle', 'seoDescription'] as const;

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

const slugify = (s: string) =>
  (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const toLocalInput = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
};
const stripHtml = (s: string) => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function emptyForm(): Article {
  const blank: I18n = {};
  return { id: '', title: { ...blank }, subTitle: {}, description: {}, content: {}, seoTitle: {}, seoDescription: {}, categoryId: '', imageUrl: '', slug: '', author: '', tags: [], documents: [], status: 'draft' };
}

export function ArticlesManager() {
  const [items, setItems] = useState<Article[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<Article>(emptyForm());
  const [lang, setLang] = useState('pt');
  const [tab, setTab] = useState<'content' | 'seo' | 'publish'>('content');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [transEnabled, setTransEnabled] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [preview, setPreview] = useState(false);

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
    fetch('/api/admin/translate', { cache: 'no-store' }).then((r) => r.json()).then((d) => setTransEnabled(!!d.enabled)).catch(() => {});
  }, []);

  function open(a?: Article) {
    if (a) {
      setForm({ ...emptyForm(), ...a, tags: a.tags || [], documents: a.documents || [] });
      setSlugTouched(true);
    } else {
      setForm(emptyForm());
      setSlugTouched(false);
    }
    setLang('pt');
    setTab('content');
    setError(null);
    setEditing(a || ({ id: '' } as Article));
  }

  const setI18n = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: { ...(p as any)[key], [lang]: value } }));
  const getI18n = (key: string) => ((form as any)[key]?.[lang] ?? '') as string;

  // slug automático a partir do título PT (até o usuário editar manualmente)
  useEffect(() => {
    if (!slugTouched) setForm((p) => ({ ...p, slug: slugify(p.title?.pt || '') }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title?.pt, slugTouched]);

  async function handleUpload(file: File, target: 'cover' | 'doc') {
    setUploading(true);
    setError(null);
    try {
      const asset = await uploadAsset(file);
      if (target === 'cover') setForm((p) => ({ ...p, imageUrl: asset.url }));
      else setForm((p) => ({ ...p, documents: [...(p.documents || []), { name: asset.fileName, url: asset.url, mime: asset.mimeType, size: asset.sizeBytes }] }));
    } catch (e) {
      setError('Upload falhou: ' + (e as Error).message);
    }
    setUploading(false);
  }

  async function translate() {
    setTranslating(true);
    setError(null);
    try {
      const fields: Record<string, string> = {};
      for (const k of I18N_KEYS) {
        const v = (form as any)[k]?.pt;
        if (v && String(v).trim()) fields[k] = v;
      }
      const r = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'pt', targets: ['en', 'fr'], fields }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'erro');
      setForm((p) => {
        const next: any = { ...p };
        for (const to of ['en', 'fr']) {
          const tr = data.translations?.[to] || {};
          for (const k of I18N_KEYS) {
            if (tr[k]) next[k] = { ...next[k], [to]: tr[k] };
          }
        }
        return next;
      });
    } catch (e) {
      setError('Tradução falhou: ' + (e as Error).message);
    }
    setTranslating(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      if (!form.title?.pt?.trim()) throw new Error('Informe ao menos o título em português.');
      const isNew = !editing?.id;
      const payload = {
        title: form.title, subTitle: form.subTitle, description: form.description, content: form.content,
        seoTitle: form.seoTitle, seoDescription: form.seoDescription,
        categoryId: form.categoryId || null, imageUrl: form.imageUrl || null, slug: form.slug || '',
        author: form.author || null, tags: form.tags || [], documents: form.documents || [],
        status: form.status || 'draft', scheduledAt: form.scheduledAt || null, publishedAt: form.publishedAt || null,
      };
      const r = await fetch(`/api/admin/article${isNew ? '' : '/' + editing!.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
  async function quickToggle(a: Article) {
    const publishing = a.status !== 'published';
    await fetch(`/api/admin/article/${a.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: publishing ? 'published' : 'draft' }),
    });
    await load();
  }

  function addTag(v: string) {
    const t = v.trim().replace(/,$/, '');
    if (t && !(form.tags || []).includes(t)) setForm((p) => ({ ...p, tags: [...(p.tags || []), t] }));
    setTagInput('');
  }

  const catName = (id?: string) => cats.find((c) => c.id === id)?.name ?? '—';
  const filtered = useMemo(
    () => items.filter((a) => {
      const okS = !search || stripHtml(a.title?.pt || '').toLowerCase().includes(search.toLowerCase());
      const okF = !statusFilter || (a.status || (a.disabled ? 'draft' : 'published')) === statusFilter;
      return okS && okF;
    }),
    [items, search, statusFilter],
  );

  const statusBadge = (a: Article) => {
    const s = a.status || (a.disabled ? 'draft' : 'published');
    if (s === 'published') return <Badge tone="live"><Icon name="check" size={12} /> Publicado</Badge>;
    if (s === 'scheduled') return <Badge tone="scheduled"><Icon name="clock" size={12} /> Agendado</Badge>;
    return <Badge tone="draft">Rascunho</Badge>;
  };

  return (
    <div>
      <PageHeader
        title="Artigos"
        subtitle="Crie, traduza, agende e publique os artigos do blog."
        icon="article"
        actions={<Button variant="primary" icon="plus" onClick={() => open()}>Novo artigo</Button>}
      />

      <Card pad={12} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 11, top: 10, color: C.faint }}><Icon name="search" size={16} /></span>
            <Input placeholder="Buscar por título…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 180 }}>
            <option value="">Todos os status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="scheduled">Agendados</option>
          </Select>
        </div>
      </Card>

      {error && !editing && <ErrorBar>{error}</ErrorBar>}

      {loading ? (
        <Spinner />
      ) : (
        <table style={T.table}>
          <thead>
            <tr>
              <th style={T.th}>Título</th>
              <th style={T.th}>Categoria</th>
              <th style={T.th}>Idiomas</th>
              <th style={T.th}>Visitas</th>
              <th style={T.th}>Status</th>
              <th style={T.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td style={T.td}>
                  <div style={{ fontWeight: 600 }}>{stripHtml(a.title?.pt || '').slice(0, 70) || '—'}</div>
                  {a.slug && <div style={{ fontSize: 11.5, color: C.faint }}>/{a.slug}</div>}
                </td>
                <td style={{ ...T.td, color: C.muted }}>{catName(a.categoryId)}</td>
                <td style={T.td}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {LANGS.map((l) => (
                      <span key={l.code} title={l.label} style={{ opacity: (a as any)[`title`]?.[l.code] ? 1 : 0.25, fontSize: 13 }}>{l.flag}</span>
                    ))}
                  </div>
                </td>
                <td style={{ ...T.td, color: C.muted }}>{new Intl.NumberFormat('pt-BR').format(a.views || 0)}</td>
                <td style={T.td}>
                  <span onClick={() => quickToggle(a)} style={{ cursor: 'pointer' }} title="Alternar publicação">{statusBadge(a)}</span>
                </td>
                <td style={{ ...T.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Button variant="ghost" icon="edit" onClick={() => open(a)} style={{ marginRight: 6 }}>Editar</Button>
                  <Button variant="danger" icon="trash" onClick={() => remove(a.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={6} style={{ ...T.td, color: C.faint }}>Nenhum artigo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {editing && (
        <Modal
          title={editing.id ? 'Editar artigo' : 'Novo artigo'}
          width={860}
          onClose={() => setEditing(null)}
          footer={
            <>
              <Button variant="subtle" icon="eye" onClick={() => setPreview(true)}>Pré-visualizar</Button>
              <div style={{ flex: 1 }} />
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</Button>
            </>
          }
        >
          {error && <ErrorBar>{error}</ErrorBar>}

          {/* Tabs principais */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            {([['content', 'Conteúdo'], ['seo', 'SEO'], ['publish', 'Publicação']] as const).map(([k, lbl]) => (
              <button key={k} onClick={() => setTab(k)} style={tabBtn(tab === k)}>{lbl}</button>
            ))}
          </div>

          {/* Seletor de idioma + tradução (vale p/ Conteúdo e SEO) */}
          {tab !== 'publish' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {LANGS.map((l) => (
                  <button key={l.code} onClick={() => setLang(l.code)} style={langBtn(lang === l.code)}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
              <Button variant="ghost" icon="translate" onClick={translate} disabled={translating || !transEnabled}
                title={transEnabled ? 'Traduzir PT → EN e FR (DeepL)' : 'Configure DEEPL_API_KEY para habilitar'}>
                {translating ? 'Traduzindo…' : 'Traduzir PT → EN/FR'}
              </Button>
            </div>
          )}

          {tab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Título"><Input value={getI18n('title')} onChange={(e) => setI18n('title', e.target.value)} /></Field>
              <Field label="Subtítulo"><Input value={getI18n('subTitle')} onChange={(e) => setI18n('subTitle', e.target.value)} /></Field>
              <Field label="Resumo (aparece nos cards)"><Textarea value={getI18n('description')} onChange={(e) => setI18n('description', e.target.value)} /></Field>
              <Field label="Conteúdo">
                <div style={{ background: '#fff', borderRadius: 10, color: '#111', overflow: 'hidden' }}>
                  <ReactQuill theme="snow" modules={QUILL_MODULES} value={getI18n('content')} onChange={(v: string) => setI18n('content', v)} />
                </div>
              </Field>
            </div>
          )}

          {tab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="URL amigável (slug)" hint={`/article/${form.slug || '...'}`}>
                <Input value={form.slug || ''} onChange={(e) => { setSlugTouched(true); setForm((p) => ({ ...p, slug: slugify(e.target.value) })); }} />
              </Field>
              <Field label="Título de SEO" hint={`${getI18n('seoTitle').length}/60 caracteres`}>
                <Input value={getI18n('seoTitle')} onChange={(e) => setI18n('seoTitle', e.target.value)} placeholder="Usa o título do artigo se vazio" />
              </Field>
              <Field label="Meta descrição" hint={`${getI18n('seoDescription').length}/160 caracteres`}>
                <Textarea value={getI18n('seoDescription')} onChange={(e) => setI18n('seoDescription', e.target.value)} placeholder="Usa o resumo se vazio" />
              </Field>
              <SerpPreview title={getI18n('seoTitle') || getI18n('title')} desc={getI18n('seoDescription') || getI18n('description')} slug={form.slug || ''} />
            </div>
          )}

          {tab === 'publish' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Categoria">
                <Select value={form.categoryId || ''} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
                  <option value="">— selecione —</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Autor"><Input value={form.author || ''} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} placeholder="Ex.: Equipe DriveData" /></Field>

              <Field label="Tags">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {(form.tags || []).map((t) => (
                    <span key={t} style={chip}>
                      {t}
                      <button onClick={() => setForm((p) => ({ ...p, tags: (p.tags || []).filter((x) => x !== t) }))} style={chipX}><Icon name="x" size={11} /></button>
                    </span>
                  ))}
                </div>
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Digite e Enter para adicionar"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); } }} />
              </Field>

              <Field label="Imagem de capa">
                {form.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.imageUrl} alt="" style={{ height: 120, borderRadius: 10, marginBottom: 8, display: 'block', objectFit: 'cover' }} />
                )}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={uploadBtn}>
                    <Icon name="upload" size={15} /> Enviar imagem
                    <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'cover')} />
                  </label>
                  <Button variant="ghost" icon="image" onClick={() => setShowMedia(true)}>Biblioteca</Button>
                  {form.imageUrl && <Button variant="subtle" icon="x" onClick={() => setForm((p) => ({ ...p, imageUrl: '' }))}>Remover</Button>}
                  {uploading && <span style={{ fontSize: 12, color: C.muted }}>enviando…</span>}
                </div>
              </Field>

              <Field label="Documentos (PDF, DOCX, etc.)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                  {(form.documents || []).map((d, i) => (
                    <div key={i} style={docRow}>
                      <Icon name="doc" size={16} />
                      <a href={d.url} target="_blank" rel="noreferrer" style={{ color: C.text, textDecoration: 'none', flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</a>
                      <button onClick={() => setForm((p) => ({ ...p, documents: (p.documents || []).filter((_, j) => j !== i) }))} style={chipX}><Icon name="trash" size={13} /></button>
                    </div>
                  ))}
                </div>
                <label style={uploadBtn}>
                  <Icon name="upload" size={15} /> Enviar documento
                  <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip" hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'doc')} />
                </label>
              </Field>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <Field label="Status de publicação">
                  <div style={{ display: 'flex', gap: 8 }}>
                    {([['draft', 'Rascunho', 'draft'], ['published', 'Publicar', 'check'], ['scheduled', 'Agendar', 'calendar']] as const).map(([val, lbl, ic]) => (
                      <button key={val} onClick={() => setForm((p) => ({ ...p, status: val }))} style={statusOpt(form.status === val)}>
                        <Icon name={ic} size={15} /> {lbl}
                      </button>
                    ))}
                  </div>
                </Field>
                {form.status === 'scheduled' && (
                  <div style={{ marginTop: 12 }}>
                    <Field label="Publicar em">
                      <Input type="datetime-local" value={toLocalInput(form.scheduledAt)} onChange={(e) => setForm((p) => ({ ...p, scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : '' }))} />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}

      {showMedia && (
        <MediaPicker kind="image" onClose={() => setShowMedia(false)} onPick={(url) => { setForm((p) => ({ ...p, imageUrl: url })); setShowMedia(false); }} />
      )}

      {preview && editing && (
        <Modal title="Pré-visualização" width={820} onClose={() => setPreview(false)}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {LANGS.map((l) => <button key={l.code} onClick={() => setLang(l.code)} style={langBtn(lang === l.code)}>{l.flag} {l.label}</button>)}
          </div>
          <article style={{ background: '#fff', color: '#0b1220', borderRadius: 12, padding: 28, maxHeight: '70vh', overflowY: 'auto' }}>
            {form.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imageUrl} alt="" style={{ width: '100%', borderRadius: 10, marginBottom: 18, maxHeight: 280, objectFit: 'cover' }} />
            )}
            <h1 style={{ fontSize: 30, margin: '0 0 6px', fontWeight: 800 }}>{getI18n('title') || '(sem título)'}</h1>
            {getI18n('subTitle') && <p style={{ fontSize: 18, color: '#475569', margin: '0 0 18px' }}>{getI18n('subTitle')}</p>}
            <div style={{ lineHeight: 1.7, fontSize: 16 }} dangerouslySetInnerHTML={{ __html: getI18n('content') || '<p style="color:#94a3b8">(sem conteúdo neste idioma)</p>' }} />
          </article>
        </Modal>
      )}
    </div>
  );
}

function SerpPreview({ title, desc, slug }: { title: string; desc: string; slug: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 16 }}>
      <div style={{ color: '#1a0dab', fontSize: 18, lineHeight: 1.3 }}>{title || 'Título do artigo'}</div>
      <div style={{ color: '#006621', fontSize: 13, margin: '2px 0' }}>drivedata.com.br › article › {slug || '...'}</div>
      <div style={{ color: '#545454', fontSize: 13.5, lineHeight: 1.4 }}>{(desc || 'A meta descrição aparece aqui nos resultados de busca.').slice(0, 160)}</div>
    </div>
  );
}

const tabBtn = (active: boolean): React.CSSProperties => ({
  background: 'none', border: 'none', borderBottom: `2px solid ${active ? C.green : 'transparent'}`,
  color: active ? C.text : C.muted, padding: '9px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: -1,
});
const langBtn = (active: boolean): React.CSSProperties => ({
  background: active ? 'rgba(10,150,236,.15)' : 'rgba(255,255,255,.04)', border: `1px solid ${active ? 'rgba(10,150,236,.4)' : C.border}`,
  color: active ? C.text : C.muted, padding: '6px 11px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer', fontWeight: 500,
});
const statusOpt = (active: boolean): React.CSSProperties => ({
  flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  background: active ? 'rgba(84,218,137,.14)' : 'rgba(255,255,255,.04)', border: `1px solid ${active ? 'rgba(84,218,137,.4)' : C.borderStrong}`,
  color: active ? C.text : C.muted, padding: '11px', borderRadius: 10, fontSize: 13.5, cursor: 'pointer', fontWeight: 600,
});
const chip: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(10,150,236,.12)', color: '#7cc6ff', borderRadius: 999, padding: '4px 6px 4px 11px', fontSize: 12.5 };
const chipX: React.CSSProperties = { background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: 2, opacity: 0.8 };
const uploadBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.06)', border: `1px solid ${C.borderStrong}`, color: C.text, borderRadius: 10, padding: '9px 14px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' };
const docRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.04)', border: `1px solid ${C.border}`, borderRadius: 9, padding: '8px 11px', color: C.muted };
