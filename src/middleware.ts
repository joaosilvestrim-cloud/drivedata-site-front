import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Renova a sessão do Supabase e protege as rotas /admin/* (exceto /admin/login).
// Nas rotas dinâmicas públicas só barra endereço com %XX inválido (ex.:
// /article/%E2%80, link cortado no meio do acento): o Next quebra ao decodificar
// o parâmetro e responde 500, que o Google conta como erro de servidor.
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith('/admin')) {
    try {
      decodeURIComponent(path);
      return NextResponse.next();
    } catch {
      return new NextResponse('Not found', { status: 404 });
    }
  }

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
  matcher: ['/admin/:path*', '/article/:path*', '/vagas/:path*', '/cases/:path*', '/proposta/:path*'],
};
