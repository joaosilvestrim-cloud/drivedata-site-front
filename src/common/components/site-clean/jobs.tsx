'use client';

// Lista de vagas (/vagas): vagas abertas, com filtro por área e modelo de trabalho.
// Textos em pt, en, es e fr; os dados da vaga (título, resumo, área...) vêm do banco
// e não são traduzidos. Só os códigos (modelo, contrato, senioridade) ganham rótulo.
import { useMemo, useState } from 'react';
import { WORK_MODELS, type ContractType, type JobModel, type WorkModel } from '@/common/model/job.model';
import { useCopy, type Copy } from './i18n';
import { ROUTES } from './content';
import { CleanShell } from './shell';
import { PageHero } from './ui';
import s from './clean.module.css';
import j from './jobs.module.css';

export const LINKEDIN = 'https://www.linkedin.com/company/drivedatabi/';

const ptCount = (n: number) => (n === 1 ? `${n} vaga aberta` : `${n} vagas abertas`);
const enCount = (n: number) => (n === 1 ? `${n} open position` : `${n} open positions`);
const esCount = (n: number) => (n === 1 ? `${n} vacante abierta` : `${n} vacantes abiertas`);
const frCount = (n: number) => (n < 2 ? `${n} poste ouvert` : `${n} postes ouverts`);

const PT = {
  heroTitle: 'Trabalhe com dados que movem decisões.',
  heroLead: 'Vagas abertas na DriveData. Escolha uma, conheça o desafio e envie sua candidatura em poucos minutos.',
  count: ptCount,
  seeAll: (n: number) => `Ver ${ptCount(n)}`,
  countOf: (k: number, n: number) => `${k} de ${ptCount(n)}`,
  follow: 'Seguir no LinkedIn',
  listTitle: 'Vagas abertas',
  empty: 'Não temos vagas abertas neste momento. Siga a DriveData no LinkedIn para saber das próximas.',
  followFull: 'Seguir a DriveData no LinkedIn',
  area: 'Área',
  allAreas: 'Todas',
  model: 'Modelo',
  allModels: 'Todos',
  noneForFilter: 'Nenhuma vaga com esse filtro. Limpe os filtros para ver todas.',
  clear: 'Limpar filtros',
  seeJob: 'Ver vaga',
  tagsAria: 'Detalhes da vaga',
  workModel: { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' } as Record<WorkModel, string>,
  contract: { clt: 'CLT', pj: 'PJ', estagio: 'Estágio', temporario: 'Temporário' } as Record<ContractType, string>,
  // Senioridade é texto livre no admin: em português aparece como foi digitada;
  // nos outros idiomas, os valores conhecidos (sem acento, minúsculos) ganham tradução.
  seniority: {} as Record<string, string>,
};

const COPY: Copy<typeof PT> = {
  pt: PT,
  en: {
    heroTitle: 'Work with data that drives decisions.',
    heroLead: 'Open positions at DriveData. Pick one, get to know the challenge and apply in a few minutes.',
    count: enCount,
    seeAll: (n) => `See ${enCount(n)}`,
    countOf: (k, n) => `${k} of ${enCount(n)}`,
    follow: 'Follow on LinkedIn',
    listTitle: 'Open positions',
    empty: 'No open positions right now. Follow DriveData on LinkedIn to hear about the next ones.',
    followFull: 'Follow DriveData on LinkedIn',
    area: 'Area',
    allAreas: 'All',
    model: 'Work model',
    allModels: 'All',
    noneForFilter: 'No positions match this filter. Clear the filters to see all.',
    clear: 'Clear filters',
    seeJob: 'View position',
    tagsAria: 'Position details',
    workModel: { remoto: 'Remote', hibrido: 'Hybrid', presencial: 'On-site' },
    contract: { clt: 'Full-time', pj: 'Contractor', estagio: 'Internship', temporario: 'Temporary' },
    seniority: {
      estagio: 'Internship', estagiario: 'Intern', estagiaria: 'Intern', junior: 'Junior',
      pleno: 'Intermediate', senior: 'Senior', especialista: 'Specialist',
    },
  },
  es: {
    heroTitle: 'Trabaja con datos que mueven decisiones.',
    heroLead: 'Vacantes abiertas en DriveData. Elige una, conoce el desafío y envía tu candidatura en pocos minutos.',
    count: esCount,
    seeAll: (n) => `Ver ${esCount(n)}`,
    countOf: (k, n) => `${k} de ${esCount(n)}`,
    follow: 'Seguir en LinkedIn',
    listTitle: 'Vacantes abiertas',
    empty: 'No tenemos vacantes abiertas en este momento. Sigue a DriveData en LinkedIn para enterarte de las próximas.',
    followFull: 'Seguir a DriveData en LinkedIn',
    area: 'Área',
    allAreas: 'Todas',
    model: 'Modalidad',
    allModels: 'Todas',
    noneForFilter: 'Ninguna vacante con este filtro. Limpia los filtros para ver todas.',
    clear: 'Limpiar filtros',
    seeJob: 'Ver vacante',
    tagsAria: 'Detalles de la vacante',
    workModel: { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' },
    contract: { clt: 'Tiempo completo', pj: 'Contratista', estagio: 'Prácticas', temporario: 'Temporal' },
    seniority: {
      estagio: 'Prácticas', estagiario: 'Practicante', estagiaria: 'Practicante', junior: 'Junior',
      pleno: 'Semi Senior', senior: 'Senior', especialista: 'Especialista',
    },
  },
  fr: {
    heroTitle: 'Travaillez avec des données qui guident les décisions.',
    heroLead: 'Postes ouverts chez DriveData. Choisissez-en un, découvrez le défi et postulez en quelques minutes.',
    count: frCount,
    seeAll: (n) => (n < 2 ? 'Voir le poste ouvert' : `Voir les ${n} postes ouverts`),
    countOf: (k, n) => `${k} sur ${frCount(n)}`,
    follow: 'Suivre sur LinkedIn',
    listTitle: 'Postes ouverts',
    empty: 'Aucun poste ouvert pour le moment. Suivez DriveData sur LinkedIn pour connaître les prochains.',
    followFull: 'Suivre DriveData sur LinkedIn',
    area: 'Domaine',
    allAreas: 'Tous',
    model: 'Mode de travail',
    allModels: 'Tous',
    noneForFilter: 'Aucun poste avec ce filtre. Effacez les filtres pour tout voir.',
    clear: 'Effacer les filtres',
    seeJob: 'Voir le poste',
    tagsAria: 'Détails du poste',
    workModel: { remoto: 'Télétravail', hibrido: 'Hybride', presencial: 'Sur site' },
    contract: { clt: 'Temps plein', pj: 'Prestataire', estagio: 'Stage', temporario: 'Temporaire' },
    seniority: {
      estagio: 'Stage', estagiario: 'Stagiaire', estagiaria: 'Stagiaire', junior: 'Junior',
      pleno: 'Intermédiaire', senior: 'Sénior', especialista: 'Spécialiste',
    },
  },
};

const delay = (ms: number) => ({ ['--d' as string]: `${ms}ms` });
const norm = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Etiquetas de meta de uma vaga, na mesma ordem da página atual. */
export function JobTags({ job, withArea = true }: { job: JobModel; withArea?: boolean }) {
  const t = useCopy(COPY);
  const items = [
    withArea ? job.area : null,
    t.workModel[job.workModel],
    job.location,
    t.contract[job.contractType],
    job.seniority ? t.seniority[norm(job.seniority.trim())] ?? job.seniority : null,
  ].filter(Boolean) as string[];
  // Senioridade "Estagio" repete o contrato "Estágio": mostra uma vez só.
  const unique = items.filter((v, i) => items.findIndex((w) => norm(w) === norm(v)) === i);
  return (
    <ul className={j.tags} aria-label={t.tagsAria}>
      {unique.map((x) => <li key={x} className={j.tag}>{x}</li>)}
    </ul>
  );
}

export function JobsClean({ jobs }: { jobs: JobModel[] }) {
  const t = useCopy(COPY);
  const [area, setArea] = useState('all');
  const [model, setModel] = useState<'all' | WorkModel>('all');

  const areas = useMemo(
    () => Array.from(new Set(jobs.map((x) => x.area).filter(Boolean) as string[])).sort(),
    [jobs],
  );
  const filtered = jobs.filter((x) => (area === 'all' || x.area === area) && (model === 'all' || x.workModel === model));
  const filtering = area !== 'all' || model !== 'all';

  return (
    <CleanShell current="jobs">
      <PageHero title={t.heroTitle} lead={t.heroLead}>
        {jobs.length > 0 && <a href="#lista" className={s.btn}>{t.seeAll(jobs.length)}</a>}
        <a href={LINKEDIN} className={s.link} target="_blank" rel="noopener noreferrer">{t.follow}</a>
      </PageHero>

      <section id="lista" className={`${s.band} ${s.bandFog} ${j.anchor}`} aria-labelledby="lista-titulo">
        <div className={s.wrap}>
          {jobs.length === 0 ? (
            <>
              <h2 id="lista-titulo" className={j.srOnly}>{t.listTitle}</h2>
              <div className={j.empty} data-reveal>
                <p>{t.empty}</p>
                <a href={LINKEDIN} className={s.link} target="_blank" rel="noopener noreferrer">{t.followFull}</a>
              </div>
            </>
          ) : (
            <>
              <div className={j.toolbar} data-reveal>
                <h2 id="lista-titulo" className={j.count} aria-live="polite">
                  {filtering ? t.countOf(filtered.length, jobs.length) : t.count(jobs.length)}
                </h2>
                <div className={j.filters}>
                  {areas.length > 0 && (
                    <div className={j.filterGroup} role="group" aria-labelledby="filtro-area">
                      <span id="filtro-area" className={j.filterLabel}>{t.area}</span>
                      <button type="button" className={j.chip} aria-pressed={area === 'all'} onClick={() => setArea('all')}>{t.allAreas}</button>
                      {areas.map((a) => (
                        <button key={a} type="button" className={j.chip} aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>
                      ))}
                    </div>
                  )}
                  <div className={j.filterGroup} role="group" aria-labelledby="filtro-modelo">
                    <span id="filtro-modelo" className={j.filterLabel}>{t.model}</span>
                    <button type="button" className={j.chip} aria-pressed={model === 'all'} onClick={() => setModel('all')}>{t.allModels}</button>
                    {WORK_MODELS.map((m) => (
                      <button key={m} type="button" className={j.chip} aria-pressed={model === m} onClick={() => setModel(model === m ? 'all' : m)}>
                        {t.workModel[m]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* data-reveal no invólucro fixo: itens que voltam pelo filtro não passam pela revelação */}
              <div data-reveal style={delay(80)}>
              {filtered.length === 0 ? (
                <div className={j.empty}>
                  <p>{t.noneForFilter}</p>
                  <button type="button" className={`${s.btn} ${s.btnOutline} ${s.btnSm}`} onClick={() => { setArea('all'); setModel('all'); }}>
                    {t.clear}
                  </button>
                </div>
              ) : (
                <ul className={j.jobList}>
                  {filtered.map((x) => (
                    <li key={x.id}>
                      <a href={`${ROUTES.jobs}/${x.slug}`} className={j.job}>
                        <div>
                          <h3 className={j.jobTitle}>{x.title}</h3>
                          <JobTags job={x} />
                          {x.summary && <p className={`${s.muted} ${j.jobSummary}`}>{x.summary}</p>}
                        </div>
                        <span className={j.jobMore}>{t.seeJob}<span className={j.jobArrow} aria-hidden="true">→</span></span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              </div>
            </>
          )}
        </div>
      </section>
    </CleanShell>
  );
}
