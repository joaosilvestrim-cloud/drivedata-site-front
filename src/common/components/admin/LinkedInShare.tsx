'use client';

// Compartilhar um artigo no LinkedIn em TODOS os idiomas de uma vez: monta um post
// só, com bandeira, título em negrito, resumo e o link de cada idioma (PT no .com.br,
// EN no .ca, ES e FR com ?lang=, que o middleware transforma na escolha de idioma).
// O LinkedIn não aceita formatação, então o negrito usa as letras em negrito do
// Unicode. "Copiar" põe o texto na área de transferência; "Abrir LinkedIn" copia e
// abre a caixa de nova publicação já com o texto (quando cabe no endereço).
import { useMemo, useState } from 'react';
import { C, Button, Modal, Textarea } from './ui';

type I18n = Record<string, string>;
export type ShareArticle = { title: I18n; subTitle: I18n; description: I18n; seoDescription: I18n; slug?: string; id: string; tags?: string[] };

const BR_URL = 'https://www.drivedata.com.br';
const CA_URL = 'https://www.drivedata.ca';
const LANGS = [
  { code: 'pt', flag: '🇧🇷', label: 'Português', more: 'Leia o artigo completo' },
  { code: 'en', flag: '🇺🇸', label: 'English', more: 'Read the full article' },
  { code: 'es', flag: '🇪🇸', label: 'Español', more: 'Lee el artículo completo' },
  { code: 'fr', flag: '🇫🇷', label: 'Français', more: "Lire l'article complet" },
];

const strip = (s?: string) => (s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const cut = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…`);

// negrito do Unicode (sans-serif bold); acentos ficam como marca combinante sobre a letra
function bold(s: string): string {
  return [...s.normalize('NFD')].map((ch) => {
    const c = ch.codePointAt(0)!;
    if (c >= 65 && c <= 90) return String.fromCodePoint(0x1d5d4 + c - 65);
    if (c >= 97 && c <= 122) return String.fromCodePoint(0x1d5ee + c - 97);
    if (c >= 48 && c <= 57) return String.fromCodePoint(0x1d7ec + c - 48);
    return ch;
  }).join('').normalize('NFC');
}
const hashtag = (t: string) => {
  const words = t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  return words.length ? `#${words.map((w) => w[0].toUpperCase() + w.slice(1)).join('')}` : '';
};

export function linkFor(lang: string, slug: string) {
  const path = `/article/${slug}`;
  if (lang === 'pt') return `${BR_URL}${path}`;
  if (lang === 'en') return `${CA_URL}${path}`;
  return `${BR_URL}${path}?lang=${lang}`;
}

export function buildPost(a: ShareArticle, langs: string[], opts: { boldTitles: boolean; summary: boolean; tags: boolean }) {
  const slug = a.slug || a.id;
  const blocks = LANGS.filter((l) => langs.includes(l.code) && strip(a.title?.[l.code])).map((l) => {
    const title = strip(a.title[l.code]);
    const sum = cut(strip(a.subTitle?.[l.code]) || strip(a.description?.[l.code]) || strip(a.seoDescription?.[l.code]), 240);
    return [`${l.flag} ${opts.boldTitles ? bold(title) : title}`, opts.summary && sum ? sum : '', `👉 ${l.more}: ${linkFor(l.code, slug)}`].filter(Boolean).join('\n');
  });
  const tags = opts.tags ? [...new Set([...(a.tags ?? []).map(hashtag).filter(Boolean), '#DriveData'])].slice(0, 6).join(' ') : '';
  return [...blocks, tags].filter(Boolean).join('\n\n');
}

export function LinkedInShare({ article, onClose }: { article: ShareArticle; onClose: () => void }) {
  const available = LANGS.filter((l) => strip(article.title?.[l.code]));
  const [langs, setLangs] = useState<string[]>(available.map((l) => l.code));
  const [opts, setOpts] = useState({ boldTitles: true, summary: true, tags: true });
  const generated = useMemo(() => buildPost(article, langs, opts), [article, langs, opts]);
  const [edited, setEdited] = useState<string | null>(null);
  const text = edited ?? generated;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };
  const openLinkedIn = async () => {
    await copy();
    const q = encodeURIComponent(text);
    // endereço muito longo é cortado pelo navegador: aí abre a caixa vazia e o texto já está copiado
    const url = q.length < 7000 ? `https://www.linkedin.com/feed/?shareActive=true&text=${q}` : 'https://www.linkedin.com/feed/?shareActive=true';
    window.open(url, '_blank', 'noopener');
  };
  const toggle = (c: string) => { setEdited(null); setLangs((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c])); };
  const chip = (on: boolean): React.CSSProperties => ({ padding: '6px 12px', borderRadius: 999, border: `1px solid ${on ? C.text : C.border}`, background: on ? C.text : C.panel, color: on ? '#fff' : C.text, fontSize: 13, cursor: 'pointer' });

  return (
    <Modal title="Compartilhar no LinkedIn" width={760} onClose={onClose}
      footer={<>
        <span style={{ fontSize: 12.5, color: copied ? C.greenText : C.faint }}>{copied ? 'Texto copiado. No LinkedIn, é só colar (Ctrl+V) se a caixa vier vazia.' : `${text.length} caracteres · limite do LinkedIn 3.000`}</span>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" onClick={() => { void copy(); }}>{copied ? 'Copiado' : 'Copiar texto'}</Button>
        <Button variant="primary" icon="external" onClick={() => { void openLinkedIn(); }}>Copiar e abrir o LinkedIn</Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: C.muted, marginRight: 4 }}>Idiomas no post</span>
          {LANGS.map((l) => {
            const has = available.some((x) => x.code === l.code);
            return <button key={l.code} type="button" disabled={!has} title={has ? '' : 'Sem tradução neste idioma'} onClick={() => toggle(l.code)}
              style={{ ...chip(langs.includes(l.code)), opacity: has ? 1 : 0.4, cursor: has ? 'pointer' : 'not-allowed' }}>{l.flag} {l.label}</button>;
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: C.text }}>
          {([['boldTitles', 'Títulos em negrito'], ['summary', 'Resumo de cada idioma'], ['tags', 'Hashtags das tags']] as const).map(([k, l]) => (
            <label key={k} style={{ display: 'inline-flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={opts[k]} onChange={(e) => { setEdited(null); setOpts((o) => ({ ...o, [k]: e.target.checked })); }} />{l}
            </label>
          ))}
        </div>
        <Textarea value={text} onChange={(e) => setEdited(e.target.value)} rows={16} style={{ fontFamily: 'inherit', fontSize: 13.5, lineHeight: 1.55 }} />
        <p style={{ margin: 0, fontSize: 12.5, color: C.faint }}>
          O LinkedIn mostra a imagem e o título do primeiro link (o artigo em português). Cada link leva ao idioma da bandeira: PT em drivedata.com.br, EN em drivedata.ca, ES e FR abrem já traduzidos. Pode editar o texto acima antes de copiar.
        </p>
        {text.length > 3000 && <p style={{ margin: 0, fontSize: 12.5, color: C.danger }}>Passou de 3.000 caracteres: desligue o resumo ou algum idioma.</p>}
      </div>
    </Modal>
  );
}
