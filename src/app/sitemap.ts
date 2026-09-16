import type { MetadataRoute } from 'next';
import { SHOW_DALT } from '@/common/config/site';
import { getArticles } from '@/server/content-db';
import { listOpenJobs } from '@/server/jobs';

// Sitemap do site. Ajuda o Google (e as IAs) a descobrir/priorizar as páginas
// reais e os artigos do blog — antes os artigos ficavam de fora, então o
// crawler mal os encontrava. Agora cada artigo publicado entra com URL amigável
// (slug quando existe, senão o id) e a data de atualização.
const BASE = 'https://drivedata.com.br';

export const revalidate = 3600; // regenera de hora em hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/article`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
  entries.push({ url: `${BASE}/vagas`, lastModified: now, changeFrequency: 'daily', priority: 0.7 });

  // A página DALT só existe no Brasil.
  if (SHOW_DALT) {
    entries.push({ url: `${BASE}/dalt`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 });
  }

  // Artigos publicados (degrada para "só as páginas fixas" se o banco falhar).
  try {
    const articles = (await getArticles({ limit: 500 }, 'pt')) as Array<{
      id: string; slug?: string | null; updatedAt?: string; publishedAt?: string;
    }>;
    for (const a of articles) {
      entries.push({
        url: `${BASE}/article/${a.slug || a.id}`,
        lastModified: a.updatedAt || a.publishedAt ? new Date(a.updatedAt || a.publishedAt!) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch {
    /* sitemap ainda vale com as páginas fixas */
  }

  // Vagas abertas (o Google for Jobs lê o JobPosting de cada página).
  try {
    for (const j of await listOpenJobs()) {
      entries.push({
        url: `${BASE}/vagas/${j.slug}`,
        lastModified: new Date(j.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch {
    /* sitemap ainda vale sem as vagas */
  }

  return entries;
}
