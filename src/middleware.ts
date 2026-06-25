import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Renova a sessão do Supabase e protege as rotas /admin/* (exceto /admin/login).
// O matcher restringe a /admin — o site público não é afetado.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Sem config do Supabase ainda: não bloqueia (evita 500); admin fica aberto
  // só até as envs serem setadas.
  if (!url || !anon) return response;

  const supabase = createServerClient(
    url,
    anon,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLogin = path.startsWith('/admin/login');

  if (path.startsWith('/admin') && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
