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
    <div style={{ display: 'flex', background: '#0a1322', minHeight: '100vh', fontFamily: "var(--font-inter), 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif", color: '#e8eef8' }}>
      <AdminNav email={user.email ?? undefined} />
      <main style={{ flex: 1, minWidth: 0, padding: '32px 40px', color: '#e8eef8' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  );
}
