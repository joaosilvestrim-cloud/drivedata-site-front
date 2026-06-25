'use client';

import { supabaseBrowser } from '@/common/supabase/browser';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Painel' },
  { href: '/admin/articles', label: 'Artigos' },
  { href: '/admin/categories', label: 'Categorias' },
  { href: '/admin/solutions', label: 'Soluções' },
  { href: '/admin/testimonials', label: 'Depoimentos' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/profiles', label: 'Público-alvo' },
];

export function AdminNav({ email }: { email?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await supabaseBrowser().auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside style={S.aside}>
      <div style={S.brand}>
        Drive<span style={{ color: '#0a96ec' }}>Data</span>
        <div style={S.brandSub}>Admin</div>
      </div>
      <nav style={S.nav}>
        {LINKS.map((l) => {
          const active = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} style={{ ...S.link, ...(active ? S.linkActive : {}) }}>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div style={S.footer}>
        {email && <div style={S.email}>{email}</div>}
        <button onClick={logout} style={S.logout}>
          Sair
        </button>
        <Link href="/" target="_blank" style={S.viewsite}>
          Ver site ↗
        </Link>
      </div>
    </aside>
  );
}

const S: Record<string, React.CSSProperties> = {
  aside: {
    width: 230,
    minHeight: '100vh',
    background: '#0b1220',
    borderRight: '1px solid rgba(255,255,255,.08)',
    padding: '22px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    position: 'sticky',
    top: 0,
  },
  brand: { fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 },
  brandSub: { fontSize: 11, opacity: 0.6, fontWeight: 500, marginTop: 3 },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  link: {
    color: 'rgba(255,255,255,.75)',
    textDecoration: 'none',
    padding: '9px 12px',
    borderRadius: 8,
    fontSize: 14,
  },
  linkActive: { background: 'rgba(10,150,236,.15)', color: '#54da89', fontWeight: 600 },
  footer: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 },
  email: { fontSize: 11, opacity: 0.55, color: '#fff', wordBreak: 'break-all' },
  logout: {
    background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,255,255,.14)',
    color: '#fff',
    borderRadius: 8,
    padding: '8px',
    cursor: 'pointer',
    fontSize: 13,
  },
  viewsite: { color: 'rgba(255,255,255,.6)', fontSize: 12, textDecoration: 'none', textAlign: 'center' },
};
