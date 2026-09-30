'use client';

// Detalhe da vaga (/vagas/[slug]): conteúdo à esquerda e candidatura à direita.
// Textos em pt, en, es e fr; o conteúdo da vaga vem do banco e não é traduzido.
// O envio não muda: multipart para /api/vagas/candidatar, com os mesmos campos,
// honeypot e aceite.
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { localizeJob, type JobModel } from '@/common/model/job.model';
import { useCopy, useLang, INTL_LOCALE, type Copy, type Lang } from './i18n';
import { ROUTES } from './content';
import { CleanShell } from './shell';
import { Icon } from './ui';
import { JobTags } from './jobs';
import s from './clean.module.css';
import j from './jobs.module.css';
import { SmartLink } from './link';

// As mensagens de erro guardadas no estado são sempre as em português (as mesmas que
// o servidor devolve). Na tela, cada uma é trocada pela versão do idioma atual.
const PT_ERRORS = {
  cvMissing: 'Anexe seu currículo em PDF ou Word (até 5 MB).',
  cvInvalid: 'O currículo precisa ser PDF ou Word, com até 5 MB.',
  generic: 'Não conseguimos enviar sua candidatura. Tente novamente em instantes.',
  invalid: 'Envio inválido.',
  tooMany: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  closed: 'Esta vaga não está mais aberta.',
  external: 'Esta vaga recebe candidaturas em outro site.',
  nameEmail: 'Preencha seu nome e um e-mail válido.',
  consent: 'Precisamos do seu aceite para guardar os dados da candidatura.',
  unavailable: 'Envio indisponível no momento.',
  cvUpload: 'Não conseguimos receber o currículo. Tente novamente em instantes.',
};
type ErrorKey = keyof typeof PT_ERRORS;

const PT = {
  back: 'Todas as vagas',
  apply: 'Candidate-se',
  shareLinkedin: 'Compartilhar no LinkedIn',
  copyLink: 'Copiar link',
  copied: 'Link copiado',
  copiedStatus: 'Link da vaga copiado.',
  sectionAria: 'Sobre a vaga e candidatura',
  about: 'Sobre a vaga',
  requirements: 'O que esperamos',
  benefits: 'O que oferecemos',
  publishedOn: (d: string) => `Publicada em ${d}`,
  closesOn: (d: string) => `Inscrições até ${d}`,
  externalApply: 'Candidatar-se',
  successTitle: 'Candidatura enviada.',
  successBody: 'Obrigado! Se o seu perfil combinar com a vaga, entraremos em contato.',
  subtitle: 'Leva menos de três minutos.',
  requiredNote: 'Campos com * são obrigatórios.',
  name: 'Nome completo',
  email: 'E-mail',
  phone: 'Telefone ou WhatsApp',
  linkedin: 'Perfil no LinkedIn',
  portfolio: 'Portfólio ou GitHub (opcional)',
  message: 'Por que essa vaga faz sentido para você? (opcional)',
  cv: 'Currículo',
  cvChoose: 'Escolher arquivo',
  cvNone: 'Nenhum arquivo escolhido',
  cvHint: 'PDF ou Word, até 5 MB.',
  consent: 'Autorizo a DriveData a guardar meus dados para este processo seletivo, conforme a',
  privacy: 'Política de Privacidade',
  submit: 'Enviar candidatura',
  sending: 'Enviando…',
  errors: PT_ERRORS as Record<ErrorKey, string>,
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    back: 'All positions',
    apply: 'Apply',
    shareLinkedin: 'Share on LinkedIn',
    copyLink: 'Copy link',
    copied: 'Link copied',
    copiedStatus: 'Position link copied.',
    sectionAria: 'About the role and application',
    about: 'About the role',
    requirements: 'What we look for',
    benefits: 'What we offer',
    publishedOn: (d) => `Posted on ${d}`,
    closesOn: (d) => `Apply by ${d}`,
    externalApply: 'Apply now',
    successTitle: 'Application sent.',
    successBody: 'Thank you! If your profile matches the role, we will get in touch.',
    subtitle: 'It takes less than three minutes.',
    requiredNote: 'Fields marked * are required.',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone or WhatsApp',
    linkedin: 'LinkedIn profile',
    portfolio: 'Portfolio or GitHub (optional)',
    message: 'Why does this role make sense for you? (optional)',
    cv: 'Resume',
    cvChoose: 'Choose file',
    cvNone: 'No file chosen',
    cvHint: 'PDF or Word, up to 5 MB.',
    consent: 'I allow DriveData to keep my data for this hiring process, as described in the',
    privacy: 'Privacy Policy',
    submit: 'Send application',
    sending: 'Sending…',
    errors: {
      cvMissing: 'Attach your resume as PDF or Word (up to 5 MB).',
      cvInvalid: 'Your resume must be a PDF or Word file of up to 5 MB.',
      generic: 'We could not send your application. Please try again in a moment.',
      invalid: 'Invalid submission.',
      tooMany: 'Too many attempts. Please wait a few minutes and try again.',
      closed: 'This position is no longer open.',
      external: 'This position takes applications on another site.',
      nameEmail: 'Enter your name and a valid email.',
      consent: 'We need your consent to keep your application data.',
      unavailable: 'Submissions are unavailable right now.',
      cvUpload: 'We could not receive your resume. Please try again in a moment.',
    },
  },
  es: {
    back: 'Todas las vacantes',
    apply: 'Postúlate',
    shareLinkedin: 'Compartir en LinkedIn',
    copyLink: 'Copiar enlace',
    copied: 'Enlace copiado',
    copiedStatus: 'Enlace de la vacante copiado.',
    sectionAria: 'Sobre la vacante y candidatura',
    about: 'Sobre la vacante',
    requirements: 'Qué buscamos',
    benefits: 'Qué ofrecemos',
    publishedOn: (d) => `Publicada el ${d}`,
    closesOn: (d) => `Postulaciones hasta el ${d}`,
    externalApply: 'Postularme',
    successTitle: 'Candidatura enviada.',
    successBody: '¡Gracias! Si tu perfil coincide con la vacante, nos pondremos en contacto.',
    subtitle: 'Toma menos de tres minutos.',
    requiredNote: 'Los campos con * son obligatorios.',
    name: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono o WhatsApp',
    linkedin: 'Perfil de LinkedIn',
    portfolio: 'Portafolio o GitHub (opcional)',
    message: '¿Por qué esta vacante tiene sentido para ti? (opcional)',
    cv: 'Currículum',
    cvChoose: 'Elegir archivo',
    cvNone: 'Ningún archivo elegido',
    cvHint: 'PDF o Word, hasta 5 MB.',
    consent: 'Autorizo a DriveData a guardar mis datos para este proceso de selección, según la',
    privacy: 'Política de Privacidad',
    submit: 'Enviar candidatura',
    sending: 'Enviando…',
    errors: {
      cvMissing: 'Adjunta tu currículum en PDF o Word (hasta 5 MB).',
      cvInvalid: 'El currículum debe ser PDF o Word, de hasta 5 MB.',
      generic: 'No pudimos enviar tu candidatura. Inténtalo de nuevo en unos instantes.',
      invalid: 'Envío inválido.',
      tooMany: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
      closed: 'Esta vacante ya no está abierta.',
      external: 'Esta vacante recibe candidaturas en otro sitio.',
      nameEmail: 'Completa tu nombre y un correo válido.',
      consent: 'Necesitamos tu autorización para guardar los datos de la candidatura.',
      unavailable: 'Envío no disponible en este momento.',
      cvUpload: 'No pudimos recibir tu currículum. Inténtalo de nuevo en unos instantes.',
    },
  },
  fr: {
    back: 'Tous les postes',
    apply: 'Postuler',
    shareLinkedin: 'Partager sur LinkedIn',
    copyLink: 'Copier le lien',
    copied: 'Lien copié',
    copiedStatus: 'Lien du poste copié.',
    sectionAria: 'À propos du poste et candidature',
    about: 'À propos du poste',
    requirements: 'Ce que nous recherchons',
    benefits: 'Ce que nous offrons',
    publishedOn: (d) => `Publié le ${d}`,
    closesOn: (d) => `Candidatures jusqu’au ${d}`,
    externalApply: 'Postuler',
    successTitle: 'Candidature envoyée.',
    successBody: 'Merci ! Si votre profil correspond au poste, nous vous contacterons.',
    subtitle: 'Moins de trois minutes.',
    requiredNote: 'Les champs marqués * sont obligatoires.',
    name: 'Nom complet',
    email: 'E-mail',
    phone: 'Téléphone ou WhatsApp',
    linkedin: 'Profil LinkedIn',
    portfolio: 'Portfolio ou GitHub (facultatif)',
    message: 'Pourquoi ce poste vous correspond-il ? (facultatif)',
    cv: 'CV',
    cvChoose: 'Choisir un fichier',
    cvNone: 'Aucun fichier choisi',
    cvHint: 'PDF ou Word, jusqu’à 5 Mo.',
    consent: 'J’autorise DriveData à conserver mes données pour ce processus de recrutement, conformément à la',
    privacy: 'Politique de confidentialité',
    submit: 'Envoyer ma candidature',
    sending: 'Envoi…',
    errors: {
      cvMissing: 'Joignez votre CV en PDF ou Word (jusqu’à 5 Mo).',
      cvInvalid: 'Le CV doit être un fichier PDF ou Word de 5 Mo maximum.',
      generic: 'Nous n’avons pas pu envoyer votre candidature. Réessayez dans un instant.',
      invalid: 'Envoi invalide.',
      tooMany: 'Trop de tentatives. Patientez quelques minutes et réessayez.',
      closed: 'Ce poste n’est plus ouvert.',
      external: 'Ce poste reçoit les candidatures sur un autre site.',
      nameEmail: 'Indiquez votre nom et un e-mail valide.',
      consent: 'Nous avons besoin de votre accord pour conserver les données de votre candidature.',
      unavailable: 'L’envoi est indisponible pour le moment.',
      cvUpload: 'Nous n’avons pas pu recevoir votre CV. Réessayez dans un instant.',
    },
  },
};

/** Mensagem guardada (em português) no idioma atual. Desconhecida: original em pt, genérica nos outros. */
const showError = (msg: string, lang: Lang, t: typeof PT) => {
  const key = (Object.keys(PT_ERRORS) as ErrorKey[]).find((k) => PT_ERRORS[k] === msg);
  if (key) return t.errors[key];
  return lang === 'pt' ? msg : t.errors.generic;
};

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
  </svg>
);

const lines = (v?: string | null) =>
  (v || '')
    .split('\n')
    .map((x) => x.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);

export function JobDetailClean({ job: source, canonical }: { job: JobModel; canonical: string }) {
  const t = useCopy(COPY);
  const lang = useLang();
  const job = localizeJob(source, lang);
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(canonical);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sem clipboard: o usuário copia da barra */
    }
  };

  // Fuso fixo para o texto do servidor e do navegador baterem na hidratação.
  const dateFmt = new Intl.DateTimeFormat(INTL_LOCALE[lang], {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo',
  });
  const fmtDate = (iso: string) => dateFmt.format(new Date(iso));

  const requirements = lines(job.requirements);
  const benefits = lines(job.benefits);

  return (
    <CleanShell current="jobs">
      <section className={j.detailHero} aria-labelledby="vaga-titulo">
        <div className={s.wrap}>
          <SmartLink href={ROUTES.jobs} className={`${s.link} ${j.back}`}><span aria-hidden="true">←</span> {t.back}</SmartLink>
          <h1 id="vaga-titulo" className={j.detailTitle}>{job.title}</h1>
          <JobTags job={job} />
          <div className={j.detailActions}>
            <a href="#candidatura" className={s.btn}>{t.apply}</a>
            <SmartLink href={shareUrl} className={j.shareBtn} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon /> {t.shareLinkedin}
            </SmartLink>
            <button type="button" className={j.shareBtn} onClick={copy}>
              <LinkIcon /> {copied ? t.copied : t.copyLink}
            </button>
          </div>
          <span className={j.srOnly} role="status">{copied ? t.copiedStatus : ''}</span>
        </div>
      </section>

      <section className={`${s.band} ${s.bandFog}`} aria-label={t.sectionAria}>
        <div className={`${s.wrap} ${j.detailGrid}`}>
          <div className={j.content}>
            {job.summary && <p className={j.summary} data-reveal>{job.summary}</p>}
            {job.description && (
              <div data-reveal>
                <h2 className={j.blockTitle}>{t.about}</h2>
                <div className={j.prose} dangerouslySetInnerHTML={{ __html: job.description }} />
              </div>
            )}
            {requirements.length > 0 && (
              <div data-reveal>
                <h2 className={j.blockTitle}>{t.requirements}</h2>
                <ul className={j.lines}>{requirements.map((l, i) => <li key={i}>{l}</li>)}</ul>
              </div>
            )}
            {benefits.length > 0 && (
              <div data-reveal>
                <h2 className={j.blockTitle}>{t.benefits}</h2>
                <ul className={j.lines}>{benefits.map((l, i) => <li key={i}>{l}</li>)}</ul>
              </div>
            )}
            {(job.publishedAt || job.closesAt) && (
              <p className={j.dates}>
                {job.publishedAt && <span>{t.publishedOn(fmtDate(job.publishedAt))}</span>}
                {job.closesAt && <span>{t.closesOn(fmtDate(job.closesAt))}</span>}
              </p>
            )}
          </div>

          <aside id="candidatura" className={`${j.panel} ${j.anchor}`} aria-labelledby="candidatura-titulo" data-reveal>
            <ApplyForm job={job} />
          </aside>
        </div>
      </section>
    </CleanShell>
  );
}

// Mesmos limites do servidor (/api/vagas/candidatar): PDF ou Word, até 5 MB.
const CV_EXT = ['pdf', 'doc', 'docx'];
const CV_MAX = 5 * 1024 * 1024;
const CV_MISSING = PT_ERRORS.cvMissing;
const CV_INVALID = PT_ERRORS.cvInvalid;
const ERROR_GENERIC = PT_ERRORS.generic;

const checkCv = (f: File | null | undefined) => {
  if (!f || !f.size) return CV_MISSING;
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  return CV_EXT.includes(ext) && f.size <= CV_MAX ? null : CV_INVALID;
};

function ApplyForm({ job }: { job: JobModel }) {
  const t = useCopy(COPY);
  const lang = useLang();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  if (job.applyUrl) {
    return (
      <div className={j.done}>
        <h2 id="candidatura-titulo" className={j.panelTitle}>{t.apply}</h2>
        <p>{t.errors.external}</p>
        <SmartLink href={job.applyUrl} className={s.btn} target="_blank" rel="noopener noreferrer">
          {t.externalApply} <span aria-hidden="true">&nbsp;↗</span>
        </SmartLink>
      </div>
    );
  }

  if (state === 'done') {
    return (
      <div className={j.done} role="status">
        <span className={s.icon}><Icon d="M5 12.5l4.5 4.5L19 7.5" /></span>
        <h2 id="candidatura-titulo" className={j.panelTitle}>{t.successTitle}</h2>
        <p>{t.successBody}</p>
      </div>
    );
  }

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileName(f?.name ?? '');
    setCvError(f ? checkCv(f) : null);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('jobSlug', job.slug);
    fd.set('page', window.location.pathname);
    const cv = fd.get('cv');
    const cvProblem = checkCv(cv instanceof File ? cv : null);
    if (cvProblem) {
      setCvError(cvProblem);
      document.getElementById('ap-cv')?.focus();
      return;
    }
    setState('sending');
    setError(null);
    setCvError(null);
    try {
      const r = await fetch('/api/vagas/candidatar', { method: 'POST', body: fd });
      const res = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        const msg = res.error || ERROR_GENERIC;
        // Erro do servidor sobre o currículo aparece junto do campo.
        if (/currículo/i.test(msg)) setCvError(msg);
        else setError(msg);
        setState('idle');
        return;
      }
      setState('done');
    } catch {
      setError(ERROR_GENERIC);
      setState('idle');
    }
  };

  return (
    <form className={j.form} onSubmit={onSubmit} aria-describedby={error ? 'ap-erro' : undefined}>
      <div className={j.panelHead}>
        <h2 id="candidatura-titulo" className={j.panelTitle}>{t.apply}</h2>
        <p className={s.muted}>{t.subtitle}</p>
        <p className={j.requiredNote}>{t.requiredNote}</p>
      </div>

      <div className={j.field}>
        <label htmlFor="ap-name" className={j.label}>{t.name}<span className={j.req} aria-hidden="true">*</span></label>
        <input id="ap-name" name="name" className={j.input} required autoComplete="name" maxLength={160} />
      </div>
      <div className={j.field}>
        <label htmlFor="ap-email" className={j.label}>{t.email}<span className={j.req} aria-hidden="true">*</span></label>
        <input id="ap-email" name="email" type="email" className={j.input} required autoComplete="email" maxLength={200} />
      </div>
      <div className={j.field}>
        <label htmlFor="ap-phone" className={j.label}>{t.phone}</label>
        <input id="ap-phone" name="phone" type="tel" className={j.input} autoComplete="tel" maxLength={40} />
      </div>
      <div className={j.field}>
        <label htmlFor="ap-linkedin" className={j.label}>{t.linkedin}</label>
        <input id="ap-linkedin" name="linkedin" className={j.input} inputMode="url" placeholder="linkedin.com/in/…" maxLength={300} />
      </div>
      <div className={j.field}>
        <label htmlFor="ap-portfolio" className={j.label}>{t.portfolio}</label>
        <input id="ap-portfolio" name="portfolio" className={j.input} inputMode="url" maxLength={300} />
      </div>
      <div className={j.field}>
        <label htmlFor="ap-message" className={j.label}>{t.message}</label>
        <textarea id="ap-message" name="message" className={j.input} maxLength={3000} />
      </div>

      <div className={j.field}>
        <span id="ap-cv-label" className={j.label}>{t.cv}<span className={j.req} aria-hidden="true">*</span></span>
        <div className={j.file} data-invalid={cvError ? 'true' : undefined}>
          <input
            id="ap-cv"
            name="cv"
            type="file"
            required
            className={j.fileInput}
            aria-labelledby="ap-cv-label"
            aria-describedby={cvError ? 'ap-cv-hint ap-cv-erro' : 'ap-cv-hint'}
            aria-invalid={cvError ? true : undefined}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFile}
          />
          <label htmlFor="ap-cv" className={j.fileBtn}>{t.cvChoose}</label>
          <span className={j.fileName}>{fileName || t.cvNone}</span>
        </div>
        <span id="ap-cv-hint" className={j.hint}>{t.cvHint}</span>
        {cvError && <span id="ap-cv-erro" className={j.fieldError} role="alert">{showError(cvError, lang, t)}</span>}
      </div>

      <div className={j.honey} aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={j.consent}>
        <input id="ap-consent" name="consent" type="checkbox" value="true" required />
        <label htmlFor="ap-consent">
          {t.consent}{' '}
          <SmartLink href="/privacy-policy" target="_blank" rel="noopener noreferrer">{t.privacy}</SmartLink>.
        </label>
      </div>

      {error && <p id="ap-erro" className={j.formError} role="alert">{showError(error, lang, t)}</p>}

      <button type="submit" className={`${s.btn} ${j.submit}`} disabled={state === 'sending'}>
        {state === 'sending' ? t.sending : t.submit}
      </button>
    </form>
  );
}
