import type { MetadataRoute } from 'next';

// Libera o rastreio das páginas públicas, bloqueia áreas internas e aponta o sitemap.
const BASE = 'https://drivedata.com.br';

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
