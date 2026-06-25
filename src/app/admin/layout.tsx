import { AdminNav } from '@/common/components/admin/AdminNav';
import { getAdminUser } from '@/server/supabase-server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();

  // Sem usuário (ex.: página de login): renderiza só o conteúdo, sem a shell.
  if (!user) {
    return <div style={{ fontFamily: 'system-ui, sans-serif' }}>{children}</div>;
  }

  return (
    <div style={{ display: 'flex', background: '#070c16', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <AdminNav email={user.email ?? undefined} />
      <main style={{ flex: 1, padding: '28px 32px', color: '#fff', maxWidth: 1100 }}>{children}</main>
    </div>
  );
}
