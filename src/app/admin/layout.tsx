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
    <div style={{ display: 'flex', background: '#070c16', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', color: '#eaf0fb' }}>
      <AdminNav email={user.email ?? undefined} />
      <main style={{ flex: 1, minWidth: 0, padding: '30px 36px', color: '#eaf0fb' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  );
}
