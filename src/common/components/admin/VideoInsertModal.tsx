'use client';

import { useEffect, useMemo, useState } from 'react';
import { uploadAsset } from '@/common/supabase/upload';
import { C, Modal, Button, Field, Input, Spinner } from './ui';
import {
  MAX_VIDEO_MB,
  isValidVideoFile,
  youtubeId,
  youtubeEmbedUrl,
} from './quill-video';

type Mode = 'youtube' | 'mp4';

export type VideoInsert =
  | { type: 'youtube'; src: string }
  | { type: 'mp4'; src: string };

// Modal de inserção de vídeo no editor do artigo. Duas opções: link do YouTube
// (embed automático) ou upload de MP4 (hospedado na plataforma). Mostra prévia
// antes de inserir, sem o usuário mexer em HTML/iframe.
export function VideoInsertModal({
  onClose,
  onInsert,
}: {
  onClose: () => void;
  onInsert: (v: VideoInsert) => void;
}) {
  const [mode, setMode] = useState<Mode>('youtube');
  const [error, setError] = useState<string | null>(null);

  // YouTube
  const [ytUrl, setYtUrl] = useState('');
  const [autoplay, setAutoplay] = useState(true);
  const ytId = useMemo(() => youtubeId(ytUrl), [ytUrl]);
  const ytPreview = ytId ? youtubeEmbedUrl(ytId, { autoplay: false }) : null;

  // MP4
  const [file, setFile] = useState<File | null>(null);
  const [objUrl, setObjUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!file) {
      setObjUrl(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setObjUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  function pickFile(f: File | null) {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    const check = isValidVideoFile(f);
    if (!check.ok) {
      setFile(null);
      setError(check.reason || 'Arquivo inválido.');
      return;
    }
    setFile(f);
  }

  async function confirm() {
    setError(null);
    if (mode === 'youtube') {
      if (!ytId) {
        setError('Informe uma URL válida do YouTube.');
        return;
      }
      onInsert({ type: 'youtube', src: youtubeEmbedUrl(ytId, { autoplay }) });
      return;
    }
    // MP4
    if (!file) {
      setError('Selecione um arquivo .mp4.');
      return;
    }
    setUploading(true);
    try {
      const asset = await uploadAsset(file);
      onInsert({ type: 'mp4', src: asset.url });
    } catch (e) {
      setError('Falha no upload do vídeo: ' + (e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const tabBtn = (m: Mode, label: string): React.CSSProperties => ({
    flex: 1,
    padding: '10px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    textAlign: 'center',
    border: `1px solid ${mode === m ? 'transparent' : C.border}`,
    background: mode === m ? C.gradient : 'transparent',
    color: mode === m ? '#06121f' : C.muted,
  });

  const busy = uploading;

  return (
    <Modal
      title="Inserir vídeo"
      onClose={onClose}
      width={640}
      footer={
        <>
          <Button variant="subtle" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirm} disabled={busy || (mode === 'youtube' ? !ytId : !file)}>
            {busy ? 'Enviando…' : 'Inserir no artigo'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <div role="button" style={tabBtn('youtube', 'Link do YouTube')} onClick={() => { setMode('youtube'); setError(null); }}>
          Link do YouTube
        </div>
        <div role="button" style={tabBtn('mp4', 'Upload MP4')} onClick={() => { setMode('mp4'); setError(null); }}>
          Upload MP4
        </div>
      </div>

      {mode === 'youtube' ? (
        <>
          <Field label="URL do vídeo" hint="Cole o link do YouTube (watch, youtu.be, embed ou shorts).">
            <Input
              value={ytUrl}
              onChange={(e) => { setYtUrl(e.target.value); setError(null); }}
              placeholder="https://www.youtube.com/watch?v=…"
              autoFocus
            />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.muted, fontSize: 14, margin: '4px 0 14px' }}>
            <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
            Reproduzir automaticamente (mudo) ao abrir o artigo
          </label>
          {ytPreview ? (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <iframe
                src={ytPreview}
                title="Prévia do vídeo"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : ytUrl.trim() ? (
            <p style={{ color: C.danger, fontSize: 13 }}>URL do YouTube não reconhecida.</p>
          ) : (
            <p style={{ color: C.faint, fontSize: 13 }}>A prévia aparece aqui quando o link for válido.</p>
          )}
        </>
      ) : (
        <>
          <Field label="Arquivo de vídeo" hint={`Somente MP4, até ${MAX_VIDEO_MB} MB. O vídeo fica hospedado na plataforma.`}>
            <input
              type="file"
              accept="video/mp4"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              style={{ color: C.muted, fontSize: 14 }}
            />
          </Field>
          {file && (
            <p style={{ color: C.faint, fontSize: 13, margin: '2px 0 12px' }}>
              {file.name} · {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          )}
          {objUrl ? (
            <video
              src={objUrl}
              controls
              preload="metadata"
              style={{ width: '100%', borderRadius: 12, border: `1px solid ${C.border}`, background: '#000', display: 'block' }}
            />
          ) : (
            <p style={{ color: C.faint, fontSize: 13 }}>A prévia aparece aqui após escolher o arquivo.</p>
          )}
          {uploading && (
            <div style={{ marginTop: 12 }}>
              <Spinner label="Enviando vídeo…" />
            </div>
          )}
        </>
      )}

      {error && <p style={{ color: C.danger, fontSize: 13, marginTop: 12 }}>{error}</p>}
    </Modal>
  );
}
