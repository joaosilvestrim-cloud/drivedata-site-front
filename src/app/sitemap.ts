import type { MetadataRoute } from 'next';
import { SHOW_DALT } from '@/common/config/site';

// Sitemap do site. Ajuda o Google a descobrir/priorizar as páginas reais
// (e influencia os sitelinks nos resultados de busca).
const BASE = 'https://drivedata.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/article`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
  // A página DALT só existe no Brasil.
  if (SHOW_DALT) {
    entries.push({ url: `${BASE}/dalt`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 });
  }
  return entries;
}
