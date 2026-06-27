'use client';

import { useEffect, useState } from 'react';
import { uploadAsset } from '@/common/supabase/upload';
import { C, Modal, Spinner, Icon } from './ui';

type Asset = { id: string; url: string; file_name: string; kind: string; mime_type: string };

export function MediaPicker({ kind = 'image', onPick, onClose }: { kind?: 'image' | 'document'; onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/media?kind=${kind}`, { cache: 'no-store' });
      setItems(await r.json());
    } catch {
      /* noop */
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const a = await uploadAsset(file);
      await load();
      onPick(a.url);
    } catch {
      /* noop */
    }
    setUploading(false);
  }

  return (
    <Modal title="Biblioteca de mídia" width={760} onClose={onClose}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.gradient, color: '#06121f', borderRadius: 10, padding: '9px 14px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
        <Icon name="upload" size={15} /> {uploading ? 'Enviando…' : 'Enviar novo'}
        <input type="file" accept={kind === 'image' ? 'image/*' : undefined} hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
      </label>
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div style={{ color: C.faint, fontSize: 14, padding: 20 }}>Nenhuma mídia ainda. Envie a primeira acima.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, maxHeight: '60vh', overflowY: 'auto' }}>
          {items.map((a) => (
            <button key={a.id} onClick={() => onPick(a.url)} title={a.file_name} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: C.panel2, padding: 0 }}>
              {a.kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.url} alt={a.file_name} style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}><Icon name="doc" size={26} /></div>
              )}
              <div style={{ fontSize: 10.5, color: C.muted, padding: '5px 7px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.file_name}</div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
