'use client';

import { supabaseBrowser } from '@/common/supabase/browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('E-mail ou senha inválidos.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div style={S.wrap}>
      <form onSubmit={handleSubmit} style={S.card}>
        <img src="/logotipo-drivedata.webp" alt="DriveData" width={150} height={36} style={S.logoImg} />
        <div style={S.logo}>Console do site</div>
        <p style={S.sub}>Acesse para gerenciar o conteúdo do site.</p>
        <label style={S.label}>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={S.input}
          placeholder="voce@drivedata.com.br"
        />
        <label style={S.label}>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={S.input}
          placeholder="••••••••"
        />
        {error && <div style={S.error}>{error}</div>}
        <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

// Identidade DriveData (a mesma do site, versão escura): azul-marinho chapado,
// título em Sora e o verde só no botão de entrar.
const S: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a1322',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: '#111d31',
    border: '1px solid rgba(234,240,251,.08)',
    borderRadius: 28,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    color: '#e8eef8',
    fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
  },
  logoImg: { height: 32, width: 'auto', display: 'block', marginBottom: 18, alignSelf: 'flex-start' },
  logo: { fontSize: 26, fontWeight: 800, marginBottom: 2, fontFamily: "var(--font-sora), 'Sora', system-ui, sans-serif", letterSpacing: '-0.04em' },
  sub: { fontSize: 14, color: 'rgba(234,240,251,.68)', margin: '0 0 14px' },
  label: { fontSize: 13, color: 'rgba(234,240,251,.78)', marginTop: 8 },
  input: {
    background: 'rgba(234,240,251,.05)',
    border: '1px solid rgba(234,240,251,.16)',
    borderRadius: 12,
    padding: '12px 14px',
    color: '#e8eef8',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
  },
  error: { color: '#ff8f80', fontSize: 13, marginTop: 8 },
  btn: {
    marginTop: 18,
    background: '#54da89',
    color: '#0a1628',
    border: 'none',
    borderRadius: 999,
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
