'use client';

import React from 'react';

// ───────────────────────── Design tokens (identidade DriveData) ─────────────────────────
export const C = {
  bg: '#070c16',
  panel: '#0d1526',
  panel2: '#0b1220',
  panelHover: '#111b30',
  border: 'rgba(255,255,255,.08)',
  borderStrong: 'rgba(255,255,255,.16)',
  text: '#eaf0fb',
  muted: 'rgba(234,240,251,.62)',
  faint: 'rgba(234,240,251,.40)',
  blue: '#0a96ec',
  green: '#54da89',
  gradient: 'linear-gradient(120deg,#0a96ec,#54da89)',
  danger: '#ff7a7a',
  dangerBg: 'rgba(255,80,80,.12)',
  warn: '#f6c455',
  radius: 14,
};

// ───────────────────────── Ícones (SVG inline, stroke currentColor) ─────────────────────────
const PATHS: Record<string, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  article: <><path d="M5 3h11l4 4v14H5z" /><path d="M15 3v5h5M8 12h8M8 16h8M8 8h3" /></>,
  tag: <><path d="M3 11l8-8 9 9-8 8z" /><circle cx="8" cy="8" r="1.5" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>,
  star: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7M12 16.5h.01" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.5M21 20a6 6 0 0 0-4-5.6" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 16l-5-5-7 7" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  server: <><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.3-2.5H9.4l-.3 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.5h4.2l.3-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z" /></>,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M4 20h4L18 10l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  trash: <><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></>,
  translate: <><path d="M4 5h8M8 3v2c0 4-2 7-5 9M5 9c0 3 3 5 6 6" /><path d="M13 20l4-9 4 9M14.5 17h5" /></>,
  calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>,
  alert: <><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></>,
  check: <path d="M5 12l4 4 10-10" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 20h16" /></>,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  external: <><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>,
  pencil: <><path d="M4 20h4L18 10l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  drag: <><circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" /></>,
  refresh: <><path d="M21 12a9 9 0 1 1-3-6.7L21 7" /><path d="M21 3v4h-4" /></>,
};

export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.7, style }: { name: string; size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {PATHS[name] ?? null}
    </svg>
  );
}

// ───────────────────────── Componentes ─────────────────────────
export function Card({ children, style, pad = 18 }: { children: React.ReactNode; style?: React.CSSProperties; pad?: number }) {
  return <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: pad, ...style }}>{children}</div>;
}

type BtnVariant = 'primary' | 'ghost' | 'danger' | 'subtle';
export function Button({ variant = 'ghost', children, icon, style, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; icon?: string }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 7, borderRadius: 10, padding: '9px 14px',
    fontSize: 13.5, fontWeight: 600, cursor: 'pointer', border: '1px solid transparent', transition: 'all .15s', lineHeight: 1,
  };
  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: C.gradient, color: '#06121f', border: 'none', fontWeight: 700 },
    ghost: { background: 'rgba(255,255,255,.06)', color: C.text, border: `1px solid ${C.borderStrong}` },
    danger: { background: C.dangerBg, color: C.danger, border: '1px solid rgba(255,80,80,.3)' },
    subtle: { background: 'transparent', color: C.muted, border: '1px solid transparent' },
  };
  return (
    <button {...rest} style={{ ...base, ...variants[variant], ...(rest.disabled ? { opacity: 0.55, cursor: 'not-allowed' } : {}), ...style }}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

export function Badge({ tone = 'neutral', children }: { tone?: 'live' | 'draft' | 'scheduled' | 'neutral' | 'danger'; children: React.ReactNode }) {
  const tones: Record<string, React.CSSProperties> = {
    live: { background: 'rgba(84,218,137,.16)', color: C.green },
    scheduled: { background: 'rgba(10,150,236,.16)', color: '#6cc4ff' },
    draft: { background: 'rgba(255,255,255,.1)', color: C.muted },
    danger: { background: C.dangerBg, color: C.danger },
    neutral: { background: 'rgba(255,255,255,.08)', color: C.muted },
  };
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 999, padding: '3px 10px', fontSize: 11.5, fontWeight: 600, ...tones[tone] }}>{children}</span>;
}

export const field: Record<string, React.CSSProperties> = {
  label: { display: 'block', fontSize: 12, color: C.muted, marginBottom: 6, fontWeight: 500 },
  input: {
    width: '100%', background: 'rgba(255,255,255,.05)', border: `1px solid ${C.borderStrong}`, borderRadius: 10,
    padding: '10px 12px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  },
};

export function Field({ label, hint, children }: { label?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label style={field.label}>{label}</label>}
      {children}
      {hint && <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...field.input, ...props.style }} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...field.input, minHeight: 90, resize: 'vertical', ...props.style }} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...field.input, ...props.style }} />;
}

export function Modal({ title, onClose, children, footer, width = 720 }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; width?: number }) {
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,14,.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px', zIndex: 60, overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: width, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, color: C.text, boxShadow: '0 24px 70px rgba(0,0,0,.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 4 }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
        {footer && <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '14px 22px', borderTop: `1px solid ${C.border}` }}>{footer}</div>}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, icon }: { title: string; subtitle?: string; actions?: React.ReactNode; icon?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {icon && (
          <span style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(10,150,236,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green }}>
            <Icon name={icon} size={20} />
          </span>
        )}
        <div>
          <h1 style={{ fontSize: 23, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{title}</h1>
          {subtitle && <p style={{ color: C.muted, margin: '3px 0 0', fontSize: 13.5 }}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

export function ErrorBar({ children }: { children: React.ReactNode }) {
  return <div style={{ color: C.danger, background: C.dangerBg, padding: '9px 13px', borderRadius: 10, margin: '14px 0', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="alert" size={15} />{children}</div>;
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.muted, padding: 24, fontSize: 14 }}>
      <span style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderTopColor: C.green, borderRadius: '50%', display: 'inline-block', animation: 'addspin 0.8s linear infinite' }} />
      {label ?? 'Carregando…'}
      <style>{`@keyframes addspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export const table: Record<string, React.CSSProperties> = {
  table: { width: '100%', borderCollapse: 'collapse', background: C.panel, borderRadius: C.radius, overflow: 'hidden', border: `1px solid ${C.border}` },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11.5, color: C.faint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: `1px solid ${C.border}` },
  td: { padding: '12px 16px', fontSize: 14, borderTop: `1px solid ${C.border}`, verticalAlign: 'middle' },
};
