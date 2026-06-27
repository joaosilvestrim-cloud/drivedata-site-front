'use client';

import { supabaseBrowser } from './browser';

const BUCKET = 'site-assets';

export interface UploadedAsset {
  url: string;
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: 'image' | 'document';
}

// Sobe qualquer arquivo (imagem ou documento) pro bucket público "site-assets",
// registra na biblioteca de mídia (best-effort) e devolve os metadados.
export async function uploadAsset(file: File): Promise<UploadedAsset> {
  const sb = supabaseBrowser();
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const isImg = (file.type || '').startsWith('image/');
  const folder = isImg ? 'uploads' : 'documents';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) throw new Error(error.message);
  const url = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  const asset: UploadedAsset = {
    url,
    path,
    fileName: file.name,
    mimeType: file.type || '',
    sizeBytes: file.size,
    kind: isImg ? 'image' : 'document',
  };
  try {
    await fetch('/api/admin/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
  } catch {
    // a biblioteca é melhor-esforço; o upload em si já funcionou
  }
  return asset;
}

// Compat: sobe imagem e devolve só a URL.
export async function uploadImage(file: File): Promise<string> {
  return (await uploadAsset(file)).url;
}
