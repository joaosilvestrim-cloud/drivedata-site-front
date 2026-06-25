'use client';

import { createBrowserClient } from '@supabase/ssr';

// Client do Supabase para uso no navegador (login da Tamires, upload de imagem).
export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
