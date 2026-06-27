'use client';

import { useEffect, useState } from 'react';
import { uploadAsset } from '@/common/supabase/upload';
import { C, Card, Button, Icon, PageHeader, Spinner, ErrorBar } from './ui';

type Asset = { id: string; url: string; path: string; file_name: string; mime_type: string; size_bytes: number; kind: string; created_at: string };

const fmtBytes = (b: number) => {
  if (!b) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), u.length - 1);
  return `${(b / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
};

export function MediaManager() {
  const [items, setItems] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [kind, setKind] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/media${kind ? '?kind=' + kind : ''}`, { cache: 'no-store' });
      setItems(await r.json());
    } catch {
      setError('Falha ao carregar a biblioteca.');
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  async function onUpload(files: FileList) {
    setUploading(true);
    setError(null);
    try {
      for (const f of Array.from(files)) await uploadAsset(f);
      await load();
    } catch (e) {
      setError('Upload falhou: ' + (e as Error).message);
    }
    setUploading(false);
  }

  async function remove(id: string) {
    if (!confirm('Remover este arquivo? Ele sai do storage e da biblioteca.')) return;
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    await load();
  }

  function copy(url: string) {
    navigator.clipboard?.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  const totalBytes = items.reduce((s, a) => s + (a.size_bytes || 0), 0);

  return (
    <div>
      <PageHeader
        title="Biblioteca de mídia"
        subtitle={`${items.length} arquivo(s) · ${fmtBytes(totalBytes)} em uso`}
        icon="image"
        actions={
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.gradient, color: '#06121f', borderRadius: 10, padding: '9px 14px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
            <Icon name="upload" size={16} /> {uploading ? 'Enviando…' : 'Enviar arquivos'}
            <input type="file" multiple hidden onChange={(e) => e.target.files && onUpload(e.target.files)} />
          </label>
        }
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['', 'Tudo'], ['image', 'Imagens'], ['document', 'Documentos']].map(([v, l]) => (
          <button key={v} onClick={() => setKind(v)} style={{ background: kind === v ? 'rgba(10,150,236,.15)' : 'rgba(255,255,255,.04)', border: `1px solid ${kind === v ? 'rgba(10,150,236,.4)' : C.border}`, color: kind === v ? C.text : C.muted, padding: '7px 14px', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>{l}</button>
        ))}
      </div>

      {error && <ErrorBar>{error}</ErrorBar>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Card><div style={{ color: C.faint, padding: 24, textAlign: 'center' }}>Nenhum arquivo ainda.</div></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {items.map((a) => (
            <Card key={a.id} pad={0} style={{ overflow: 'hidden' }}>
              {a.kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.url} alt={a.file_name} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, background: C.panel2 }}><Icon name="doc" size={34} /></div>
              )}
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.file_name}</div>
                <div style={{ fontSize: 11, color: C.faint, margin: '3px 0 9px' }}>{fmtBytes(a.size_bytes)} · {new Date(a.created_at).toLocaleDateString('pt-BR')}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button variant="ghost" icon={copied === a.url ? 'check' : 'external'} onClick={() => copy(a.url)} style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>{copied === a.url ? 'Copiado' : 'URL'}</Button>
                  <Button variant="danger" icon="trash" onClick={() => remove(a.id)} style={{ fontSize: 12 }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
