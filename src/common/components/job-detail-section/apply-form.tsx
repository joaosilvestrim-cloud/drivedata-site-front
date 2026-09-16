'use client';

import type { JobModel } from '@/common/model/job.model';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './styles';

// Formulário de candidatura: multipart para /api/vagas/candidatar (currículo
// vai pro bucket privado). Validação nativa do navegador nos obrigatórios; o
// servidor valida de novo.
export const ApplyForm = ({ job }: { job: JobModel }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  if (job.applyUrl) {
    return (
      <S.FormCard>
        <S.FormTitle>{t('jobs.apply.title')}</S.FormTitle>
        <S.FormSub>{t('jobs.apply.externalHint')}</S.FormSub>
        <S.ExternalLink href={job.applyUrl} target="_blank" rel="noopener noreferrer">
          {t('jobs.apply.externalApply')} ↗
        </S.ExternalLink>
      </S.FormCard>
    );
  }

  if (state === 'done') {
    return (
      <S.FormCard>
        <S.Success role="status">
          <strong aria-hidden="true">✓</strong>
          <p>{t('jobs.apply.success')}</p>
        </S.Success>
      </S.FormCard>
    );
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('jobSlug', job.slug);
    fd.set('page', window.location.pathname);
    const cv = fd.get('cv');
    if (!(cv instanceof File) || !cv.size) {
      setError(t('jobs.apply.errorCv'));
      return;
    }
    setState('sending');
    setError(null);
    try {
      const r = await fetch('/api/vagas/candidatar', { method: 'POST', body: fd });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        setError(j.error || t('jobs.apply.errorGeneric'));
        setState('idle');
        return;
      }
      setState('done');
    } catch {
      setError(t('jobs.apply.errorGeneric'));
      setState('idle');
    }
  };

  return (
    <S.Form onSubmit={onSubmit}>
      <S.FormTitle>{t('jobs.apply.title')}</S.FormTitle>
      <S.FormSub>{t('jobs.apply.subtitle')}</S.FormSub>

      <S.Field>
        <label htmlFor="ap-name">{t('jobs.apply.name')}</label>
        <input id="ap-name" name="name" required autoComplete="name" maxLength={160} />
      </S.Field>
      <S.Field>
        <label htmlFor="ap-email">{t('jobs.apply.email')}</label>
        <input id="ap-email" name="email" type="email" required autoComplete="email" maxLength={200} />
      </S.Field>
      <S.Field>
        <label htmlFor="ap-phone">{t('jobs.apply.phone')}</label>
        <input id="ap-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </S.Field>
      <S.Field>
        <label htmlFor="ap-linkedin">{t('jobs.apply.linkedin')}</label>
        <input id="ap-linkedin" name="linkedin" inputMode="url" placeholder="linkedin.com/in/…" maxLength={300} />
      </S.Field>
      <S.Field>
        <label htmlFor="ap-portfolio">{t('jobs.apply.portfolio')}</label>
        <input id="ap-portfolio" name="portfolio" inputMode="url" maxLength={300} />
      </S.Field>
      <S.Field>
        <label htmlFor="ap-message">{t('jobs.apply.message')}</label>
        <textarea id="ap-message" name="message" maxLength={3000} />
      </S.Field>
      <S.Field>
        <label htmlFor="ap-cv">{t('jobs.apply.cv')}</label>
        <S.FileRow>
          <input
            id="ap-cv"
            name="cv"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          />
          <label htmlFor="ap-cv" className="btn">
            {t('jobs.apply.cvChoose')}
          </label>
          <span className="name">{fileName || t('jobs.apply.cvNone')}</span>
        </S.FileRow>
      </S.Field>

      <S.Honey aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </S.Honey>

      <S.Consent>
        <input id="ap-consent" name="consent" type="checkbox" value="true" required />
        <label htmlFor="ap-consent">
          {t('jobs.apply.consent')}{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            {t('jobs.apply.privacy')}
          </a>
          .
        </label>
      </S.Consent>

      {error && <S.ErrorMsg role="alert">{error}</S.ErrorMsg>}

      <S.Submit type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? t('jobs.apply.sending') : t('jobs.apply.submit')}
      </S.Submit>
    </S.Form>
  );
};
