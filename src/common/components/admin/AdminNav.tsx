'use client';

import { supabaseBrowser } from '@/common/supabase/browser';
import Image from 'next/image';
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
      { href: '/admin/parceiros', label: 'Parceiros', icon: 'image' },
      { href: '/admin/faq', label: 'FAQ', icon: 'help' },
      { href: '/admin/profiles', label: 'Público-alvo', icon: 'users' },
      { href: '/admin/portal-fabric-video', label: 'Vídeo Portal Fabric', icon: 'play' },
    ],
  },
  {
    title: 'Carreiras',
    links: [
      { href: '/admin/vagas', label: 'Vagas', icon: 'briefcase' },
      { href: '/admin/candidaturas', label: 'Candidaturas', icon: 'users' },
    ],
  },
  {
    title: 'Parcerias',
    links: [{ href: '/admin/parcerias', label: 'Solicitações', icon: 'link' }],
  },
  {
    title: 'Operação',
    links: [
      { href: '/admin/analytics', label: 'Analytics', icon: 'chart' },
      { href: '/admin/conversions', label: 'Conversões (Ads)', icon: 'upload' },
      { href: '/admin/integrations', label: 'Integrações', icon: 'settings' },
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
        <div>
          <Image src="/logotipo-drivedata.webp" alt="DriveData" width={134} height={32} priority style={S.logoMark} />
          <div style={{ fontSize: 12.5, color: C.faint, marginTop: 8 }}>Console do site</div>
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
  logoMark: { width: 'auto', height: 32, objectFit: 'contain', display: 'block' },
  groupTitle: { fontSize: 12.5, color: C.faint, fontWeight: 600, padding: '0 14px 6px' },
  link: { display: 'flex', alignItems: 'center', gap: 11, color: C.muted, textDecoration: 'none', padding: '9px 14px', borderRadius: 999, fontSize: 14, fontWeight: 500 },
  linkActive: { background: 'rgba(84,218,137,.12)', color: C.text, fontWeight: 600 },
  footer: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` },
  email: { fontSize: 11, color: C.faint, wordBreak: 'break-all', padding: '0 4px' },
  logout: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent', border: `1px solid ${C.borderStrong}`, color: C.text, borderRadius: 999, padding: '9px', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' },
  viewsite: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: C.muted, fontSize: 12.5, textDecoration: 'none', border: `1px solid ${C.borderStrong}`, borderRadius: 999, padding: '9px' },
};
