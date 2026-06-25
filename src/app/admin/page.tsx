import { query } from '@/server/content-db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function counts() {
  const tables = [
    { t: 'article', label: 'Artigos', href: '/admin/articles' },
    { t: 'solution', label: 'Soluções', href: '/admin/solutions' },
    { t: 'testimonial', label: 'Depoimentos', href: '/admin/testimonials' },
    { t: 'faq', label: 'FAQ', href: '/admin/faq' },
    { t: 'target_audience_profile', label: 'Público-alvo', href: '/admin/profiles' },
    { t: 'article_category', label: 'Categorias', href: '/admin/categories' },
  ];
  const out: { label: string; href: string; n: number }[] = [];
  for (const x of tables) {
    try {
      const r = await query<{ n: number }>(`select count(*)::int n from ${x.t}`);
      out.push({ label: x.label, href: x.href, n: r[0]?.n ?? 0 });
    } catch {
      out.push({ label: x.label, href: x.href, n: 0 });
    }
  }
  return out;
}

export default async function AdminHome() {
  const data = await counts();
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>Painel de conteúdo</h1>
      <p style={{ opacity: 0.7, margin: '0 0 24px' }}>
        Gerencie tudo que aparece no site — sem mexer em código.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {data.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            style={{
              background: '#0d1526',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 14,
              padding: 18,
              textDecoration: 'none',
              color: '#fff',
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, color: '#54da89' }}>{c.n}</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
