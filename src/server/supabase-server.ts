import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Client do Supabase no servidor (server components / route handlers), lendo a
// sessão pelos cookies. Usado pra proteger o /admin e as rotas de escrita.
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // chamado de um Server Component — ignorar (o middleware renova)
          }
        },
      },
    },
  );
}

// Retorna o usuário logado ou null. Usado pelas rotas de escrita do admin.
export async function getAdminUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
