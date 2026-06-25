// Camada de conteúdo do site: lê as tabelas de conteúdo do Supabase (Postgres)
// e resolve os campos JSON {pt,en,es,fr} para o idioma pedido (fallback pt).
// Roda só no servidor (route handlers). Conexão via pooler do Supabase.
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.SITE_DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}

export type Lang = 'pt' | 'en' | 'es' | 'fr';

export function normLang(l?: string | null): Lang {
  const n = (l || '').toLowerCase().split('-')[0];
  return (['pt', 'en', 'es', 'fr'].includes(n) ? n : 'pt') as Lang;
}

// resolve um campo JSON {pt,en,...} (ou string legada) para o idioma, com fallback pt
export function t(v: any, lang: Lang): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  return v[lang] || v.pt || '';
}
