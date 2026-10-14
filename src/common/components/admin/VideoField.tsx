'use client';

// Campo de vídeo do admin (depoimentos): cola um link do YouTube ou envia um MP4
// (vai para o storage público do site, mesmo caminho do vídeo dos artigos). Mostra
// a prévia do que vai aparecer no site e deixa remover.
import { useRef, useState } from 'react';
import { uploadAsset } from '@/common/supabase/upload';
import { C, Button, Input } from './ui';
import { MAX_VIDEO_MB, isValidVideoFile, youtubeEmbedUrl, youtubeId } from './quill-video';

export function VideoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const yt = value ? youtubeId(value) : null;
  const isFile = !!value && !yt;

  const upload = async (file?: File) => {
    if (!file) return;
    const ok = isValidVideoFile(file);
    if (!ok.ok) { setErr(ok.reason ?? 'Arquivo inválido.'); return; }
    setBusy(true); setErr(null);
    try { onChange((await uploadAsset(file)).url); }
    catch (e) { setErr('Falha no envio: ' + (e as Error).message); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input
          value={isFile ? '' : value}
          placeholder={isFile ? 'MP4 enviado (abaixo)' : 'Link do YouTube: https://www.youtube.com/watch?v=…'}
          onChange={(e) => { setErr(null); onChange(e.target.value.trim()); }}
          style={{ flex: '1 1 260px' }}
        />
        <span style={{ fontSize: 12.5, color: C.faint }}>ou</span>
        <Button variant="ghost" icon="upload" disabled={busy} onClick={() => input.current?.click()}>{busy ? 'Enviando…' : 'Enviar MP4'}</Button>
        <input ref={input} type="file" accept="video/mp4" hidden onChange={(e) => { void upload(e.target.files?.[0]); }} />
        {value && <Button variant="subtle" icon="trash" onClick={() => onChange('')}>Remover</Button>}
      </div>
      <span style={{ fontSize: 12, color: C.faint }}>MP4 até {MAX_VIDEO_MB} MB. Para vídeos maiores, suba no YouTube (pode ser não listado) e cole o link.</span>
      {value && value.length > 3 && !yt && !/^https?:\/\//.test(value) && <span style={{ fontSize: 12.5, color: C.danger }}>Não reconheci o link. Cole o endereço do vídeo no YouTube.</span>}
      {err && <span style={{ fontSize: 12.5, color: C.danger }}>{err}</span>}
      {yt && (
        <iframe src={youtubeEmbedUrl(yt)} title="Prévia do vídeo" style={{ width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 12 }} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      )}
      {isFile && /^https?:\/\//.test(value) && (
        <video src={value} controls preload="metadata" style={{ width: '100%', borderRadius: 12, background: '#0a1628' }} />
      )}
    </div>
  );
}
