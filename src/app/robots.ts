import type { MetadataRoute } from 'next';
import { SITE_BASE_URL } from '@/common/config/site';

// Libera o rastreio das páginas públicas, bloqueia áreas internas e aponta o sitemap.
const BASE = SITE_BASE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
