'use client';

import type { JobModel } from '@/common/model/job.model';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplyForm } from './apply-form';
import * as S from './styles';

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

// Página de uma vaga: cabeçalho com meta e compartilhamento, conteúdo à
// esquerda e o formulário de candidatura fixo à direita.
export const JobDetailSection = ({ job, canonical }: { job: JobModel; canonical: string }) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.resolvedLanguage || 'pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const lines = (s?: string | null) =>
    (s || '')
      .split('\n')
      .map((x) => x.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);

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

  const requirements = lines(job.requirements);
  const benefits = lines(job.benefits);

  return (
    <S.Section>
      <S.Inner>
        <S.Back href="/vagas">← {t('jobs.back')}</S.Back>

        <S.Head>
          {job.area && <S.Kicker>{job.area}</S.Kicker>}
          <S.Title>{job.title}</S.Title>
          <S.Meta>
            <span>{t(`jobs.model.${job.workModel}`)}</span>
            {job.location && <span>{job.location}</span>}
            <span>{t(`jobs.contract.${job.contractType}`)}</span>
            {job.seniority && <span>{job.seniority}</span>}
          </S.Meta>
          <S.Share>
            <span>{t('jobs.share.label')}</span>
            <S.ShareLink href={shareUrl} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon /> {t('jobs.share.linkedin')}
            </S.ShareLink>
            <S.ShareBtn type="button" onClick={copy}>
              {copied ? t('jobs.share.copied') : t('jobs.share.copy')}
            </S.ShareBtn>
          </S.Share>
        </S.Head>

        <S.Grid>
          <S.Content>
            {job.summary && <S.Lead>{job.summary}</S.Lead>}
            {job.description && (
              <>
                <S.H2>{t('jobs.sections.about')}</S.H2>
                <S.Prose dangerouslySetInnerHTML={{ __html: job.description }} />
              </>
            )}
            {requirements.length > 0 && (
              <>
                <S.H2>{t('jobs.sections.requirements')}</S.H2>
                <S.List>
                  {requirements.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </S.List>
              </>
            )}
            {benefits.length > 0 && (
              <>
                <S.H2>{t('jobs.sections.benefits')}</S.H2>
                <S.List>
                  {benefits.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </S.List>
              </>
            )}
            <S.Dates>
              {job.publishedAt && (
                <span>
                  {t('jobs.publishedOn')} {fmtDate(job.publishedAt)}
                </span>
              )}
              {job.closesAt && (
                <span>
                  {t('jobs.closesOn')} {fmtDate(job.closesAt)}
                </span>
              )}
            </S.Dates>
          </S.Content>

          <S.Aside>
            <ApplyForm job={job} />
          </S.Aside>
        </S.Grid>
      </S.Inner>
    </S.Section>
  );
};
