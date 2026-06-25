'use client';

import { supabaseBrowser } from './browser';

// Sobe um arquivo de imagem pro bucket público "site-assets" e devolve a URL.
export async function uploadImage(file: File): Promise<string> {
  const sb = supabaseBrowser();
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage
    .from('site-assets')
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  return sb.storage.from('site-assets').getPublicUrl(path).data.publicUrl;
}
