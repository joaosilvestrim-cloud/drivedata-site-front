'use client';

// Esqueleto das páginas do site: cabeçalho, rodapé e a revelação suave
// das seções ao rolar (elementos com data-reveal). Sem JS o conteúdo aparece
// normalmente: a classe que esconde só entra depois da hidratação.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import { useTypebot } from '@/common/providers/TypebotProvider';
import { ACADEMY, ROUTES, ext, footer, nav, type NavKey } from './content';
import { useLang, type Copy } from './i18n';
import s from './clean.module.css';

const PT = {
  skip: 'Pular para o conteúdo',
  home: 'DriveData, página inicial',
  mainNav: 'Principal',
  menu: 'Menu',
  openMenu: 'Abrir menu',
  closeMenu: 'Fechar menu',
  talk: 'Fale com um especialista',
  tagline: 'Dados, BI, engenharia e IA para decidir melhor.',
  privacy: 'Política de privacidade',
  cookies: 'Preferências de cookies',
};
const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    skip: 'Skip to content',
    home: 'DriveData, home page',
    mainNav: 'Main',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    talk: 'Talk to an expert',
    tagline: 'Data, BI, engineering and AI for better decisions.',
    privacy: 'Privacy policy',
    cookies: 'Cookie preferences',
  },
  es: {
    skip: 'Saltar al contenido',
    home: 'DriveData, página de inicio',
    mainNav: 'Principal',
    menu: 'Menú',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    talk: 'Hable con un especialista',
    tagline: 'Datos, BI, ingeniería e IA para decidir mejor.',
    privacy: 'Política de privacidad',
    cookies: 'Preferencias de cookies',
  },
  fr: {
    skip: 'Aller au contenu',
    home: 'DriveData, page d’accueil',
    mainNav: 'Principal',
    menu: 'Menu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    talk: 'Parler à un expert',
    tagline: 'Données, BI, ingénierie et IA pour mieux décider.',
    privacy: 'Politique de confidentialité',
    cookies: 'Préférences de cookies',
  },
};

export function CleanShell({ children, current }: { children: ReactNode; current?: NavKey }) {
  const { openTypebot } = useTypebot();
  const lang = useLang();
  const t = COPY[lang];
  const NAV = nav(lang);
  const FOOTER = footer(lang);
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Revelação ao rolar: marca data-in uma vez por elemento. Usa a posição (e não
  // só a interseção) para que rolagem rápida ou salto por âncora nunca deixe uma
  // seção que já passou invisível.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pending = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reduce) { pending.forEach((el) => el.setAttribute('data-in', '')); return; }
    let raf = 0;
    const check = () => {
      raf = 0;
      const limit = window.innerHeight * 0.9;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < limit) { el.setAttribute('data-in', ''); return false; }
        return true;
      });
      if (!pending.length) { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    setReady(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    const mq = window.matchMedia('(min-width: 1121px)');
    const onMq = () => { if (mq.matches) setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => { window.removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); };
  }, [menuOpen]);

  const contact = () => { setMenuOpen(false); openTypebot(); };

  return (
    <div ref={rootRef} className={`${s.root} ${ready ? s.revealReady : ''}`}>
      <a href="#conteudo" className={s.skip}>{t.skip}</a>
      <header className={`${s.header} ${scrolled ? s.headerScrolled : ''}`}>
        <div className={`${s.wrap} ${s.headerInner}`}>
          <a href={ROUTES.home} className={s.logo} aria-label={t.home}>
            <img src="/logotipo-drivedata-ink.png" alt="DriveData" width={117} height={28} />
          </a>
          <nav className={s.nav} aria-label={t.mainNav}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={s.navLink} aria-current={current === n.key ? 'page' : undefined}>{n.label}</a>
            ))}
          </nav>
          <div className={s.headerActions}>
            <a href={ACADEMY} className={s.textNav} {...ext(ACADEMY)}>Academy</a>
            <button type="button" className={`${s.btn} ${s.btnOutline} ${s.btnSm}`} onClick={contact}>{t.talk}</button>
          </div>
          <button type="button" className={s.menuBtn} aria-expanded={menuOpen} aria-controls="menu-mobile"
            aria-label={menuOpen ? t.closeMenu : t.openMenu} onClick={() => setMenuOpen((v) => !v)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        <nav id="menu-mobile" aria-label={t.menu} className={`${s.mobileMenu} ${menuOpen ? s.mobileMenuOpen : ''}`} hidden={!menuOpen}>
          {NAV.map((n) => <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>{n.label}</a>)}
          <a href={ACADEMY} {...ext(ACADEMY)}>Academy</a>
          <button type="button" className={s.btn} onClick={contact}>{t.talk}</button>
        </nav>
      </header>

      <main id="conteudo">{children}</main>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <div className={s.footerTop}>
            <div className={s.footerBrand}>
              <img src="/logotipo-drivedata.png" alt="DriveData" width={134} height={32} />
              <p>{t.tagline}</p>
              <span className={s.partner}><img src="/microsoftPartner.png" alt="Microsoft Partner" width={92} height={26} /></span>
            </div>
            {FOOTER.map((col) => (
              <nav key={col.title} className={s.footerCol} aria-label={col.title}>
                <h2>{col.title}</h2>
                <ul>{col.links.map((l) => <li key={l.href}><a href={l.href} {...ext(l.href)}>{l.label}</a></li>)}</ul>
              </nav>
            ))}
          </div>
          <div className={s.footerBottom}>
            <span>© {new Date().getFullYear()} DriveData</span>
            <a href="/privacy-policy">{t.privacy}</a>
            <button type="button" onClick={() => CookieConsent.showPreferences()}>{t.cookies}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Botão que abre o chat de contato (mesmo fluxo do cabeçalho do site). */
export function ContactButton({ children, variant }: { children: ReactNode; variant?: 'outline' | 'onInk' }) {
  const { openTypebot } = useTypebot();
  const cls = variant === 'outline' ? `${s.btn} ${s.btnOutline}` : s.btn;
  return <button type="button" className={cls} onClick={() => openTypebot()}>{children}</button>;
}
