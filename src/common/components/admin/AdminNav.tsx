'use client';

import { supabaseBrowser } from '@/common/supabase/browser';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { C, Icon } from './ui';

const GROUPS: { title: string; links: { href: string; label: string; icon: string; exact?: boolean }[] }[] = [
  {
    title: 'Conteúdo',
    links: [
      { href: '/admin', label: 'Painel', icon: 'dashboard', exact: true },
      { href: '/admin/articles', label: 'Artigos', icon: 'article' },
      { href: '/admin/categories', label: 'Categorias', icon: 'tag' },
      { href: '/admin/media', label: 'Biblioteca de mídia', icon: 'image' },
    ],
  },
  {
    title: 'Site',
    links: [
      { href: '/admin/solutions', label: 'Soluções', icon: 'layers' },
      { href: '/admin/testimonials', label: 'Depoimentos', icon: 'star' },
      { href: '/admin/faq', label: 'FAQ', icon: 'help' },
      { href: '/admin/profiles', label: 'Público-alvo', icon: 'users' },
    ],
  },
  {
    title: 'Operação',
    links: [
      { href: '/admin/analytics', label: 'Analytics', icon: 'chart' },
      { href: '/admin/system', label: 'Sistema & Saúde', icon: 'server' },
    ],
  },
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
        <span style={S.logoMark}>D</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
            Drive<span style={{ background: C.gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Data</span>
          </div>
          <div style={{ fontSize: 10.5, color: C.faint, marginTop: 3, letterSpacing: 1, textTransform: 'uppercase' }}>Console</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto' }}>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div style={S.groupTitle}>{g.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {g.links.map((l) => {
                const active = l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(l.href + '/');
                return (
                  <Link key={l.href} href={l.href} style={{ ...S.link, ...(active ? S.linkActive : {}) }}>
                    <Icon name={l.icon} size={17} color={active ? C.green : C.muted} />
                    <span>{l.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div style={S.footer}>
        {email && <div style={S.email}>{email}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={logout} style={S.logout}>
            <Icon name="logout" size={15} /> Sair
          </button>
          <Link href="/" target="_blank" style={S.viewsite}>
            <Icon name="external" size={15} /> Site
          </Link>
        </div>
      </div>
    </aside>
  );
}

const S: Record<string, React.CSSProperties> = {
  aside: {
    width: 248, minHeight: '100vh', background: C.panel2, borderRight: `1px solid ${C.border}`,
    padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 0, alignSelf: 'flex-start',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 11, padding: '4px 8px 14px', borderBottom: `1px solid ${C.border}` },
  logoMark: { width: 34, height: 34, borderRadius: 10, background: C.gradient, color: '#06121f', fontWeight: 900, fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  groupTitle: { fontSize: 10.5, color: C.faint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '0 10px 6px' },
  link: { display: 'flex', alignItems: 'center', gap: 11, color: C.muted, textDecoration: 'none', padding: '9px 11px', borderRadius: 9, fontSize: 13.5, fontWeight: 500 },
  linkActive: { background: 'rgba(10,150,236,.13)', color: C.text, fontWeight: 600 },
  footer: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` },
  email: { fontSize: 11, color: C.faint, wordBreak: 'break-all', padding: '0 4px' },
  logout: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,.05)', border: `1px solid ${C.borderStrong}`, color: C.text, borderRadius: 9, padding: '8px', cursor: 'pointer', fontSize: 12.5 },
  viewsite: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: C.muted, fontSize: 12.5, textDecoration: 'none', border: `1px solid ${C.borderStrong}`, borderRadius: 9, padding: '8px' },
};
