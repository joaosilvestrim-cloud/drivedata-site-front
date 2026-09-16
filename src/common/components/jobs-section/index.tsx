'use client';

import { WORK_MODELS, type JobModel } from '@/common/model/job.model';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './styles';

const LINKEDIN = 'https://www.linkedin.com/company/drivedatabi/';

// Lista pública de vagas abertas, com filtro por área e modelo de trabalho.
export const JobsSection = ({ jobs }: { jobs: JobModel[] }) => {
  const { t } = useTranslation();
  const [area, setArea] = useState('all');
  const [model, setModel] = useState('all');

  const areas = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.area).filter(Boolean) as string[])).sort(),
    [jobs],
  );
  const filtered = jobs.filter(
    (j) => (area === 'all' || j.area === area) && (model === 'all' || j.workModel === model),
  );

  return (
    <S.Section id="vagas">
      <S.Inner>
        <S.Kicker>{t('jobs.eyebrow')}</S.Kicker>
        <S.Title>
          {t('jobs.title')} <S.Highlight>{t('jobs.titleHighlight')}</S.Highlight>
        </S.Title>
        <S.Intro>{t('jobs.intro')}</S.Intro>

        {jobs.length > 0 && (
          <S.Toolbar>
            <S.Count>{t('jobs.openCount', { count: jobs.length })}</S.Count>
            <S.Filters>
              <S.Chip type="button" aria-pressed={area === 'all'} onClick={() => setArea('all')}>
                {t('jobs.filters.all')}
              </S.Chip>
              {areas.map((a) => (
                <S.Chip key={a} type="button" aria-pressed={area === a} onClick={() => setArea(a)}>
                  {a}
                </S.Chip>
              ))}
              {areas.length > 0 && <S.Sep aria-hidden="true" />}
              {WORK_MODELS.map((m) => (
                <S.Chip
                  key={m}
                  type="button"
                  aria-pressed={model === m}
                  onClick={() => setModel(model === m ? 'all' : m)}
                >
                  {t(`jobs.model.${m}`)}
                </S.Chip>
              ))}
            </S.Filters>
          </S.Toolbar>
        )}

        {jobs.length === 0 ? (
          <S.Empty>
            <p>{t('jobs.empty')}</p>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              {t('jobs.followLinkedin')} ↗
            </a>
          </S.Empty>
        ) : filtered.length === 0 ? (
          <S.Empty>
            <p>{t('jobs.noneForFilter')}</p>
          </S.Empty>
        ) : (
          <S.List>
            {filtered.map((j) => (
              <S.CardLink key={j.id} href={`/vagas/${j.slug}`}>
                <div>
                  <S.CardTitle>{j.title}</S.CardTitle>
                  <S.Meta>
                    {j.area && <span>{j.area}</span>}
                    <span>{t(`jobs.model.${j.workModel}`)}</span>
                    {j.location && <span>{j.location}</span>}
                    <span>{t(`jobs.contract.${j.contractType}`)}</span>
                    {j.seniority && <span>{j.seniority}</span>}
                  </S.Meta>
                  {j.summary && <S.Summary>{j.summary}</S.Summary>}
                </div>
                <S.Cta>
                  {t('jobs.seeJob')}{' '}
                  <span className="cta-arrow" aria-hidden="true">
                    →
                  </span>
                </S.Cta>
              </S.CardLink>
            ))}
          </S.List>
        )}
      </S.Inner>
    </S.Section>
  );
};
