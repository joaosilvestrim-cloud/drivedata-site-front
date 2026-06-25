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
        <div style={S.logo}>
          Drive<span style={{ color: '#0a96ec' }}>Data</span> · Admin
        </div>
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

const S: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at top, #0f1f3d 0%, #0b1220 70%)',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: '#0d1526',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 16,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
  },
  logo: { fontSize: 22, fontWeight: 800, marginBottom: 2 },
  sub: { fontSize: 13, opacity: 0.7, margin: '0 0 14px' },
  label: { fontSize: 12, opacity: 0.8, marginTop: 8 },
  input: {
    background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,255,255,.14)',
    borderRadius: 10,
    padding: '11px 13px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  error: { color: '#ff8a8a', fontSize: 13, marginTop: 8 },
  btn: {
    marginTop: 16,
    background: 'linear-gradient(120deg,#0a96ec,#54da89)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
};
