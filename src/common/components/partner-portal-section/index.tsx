'use client';

import { PARTNERSHIP_TYPES } from '@/common/model/partner-application.model';
import { useTranslation } from 'react-i18next';
import { PartnerForm } from './partner-form';
import * as S from './styles';

const STEPS = ['signup', 'talk', 'sign', 'first'] as const;
const OFFER = ['commission', 'presales', 'proposal', 'material', 'training', 'contact'] as const;

// Portal do Parceiro: pitch do programa, modelos de parceria, o que o parceiro
// recebe, como funciona e o formulário de interesse.
export const PartnerPortalSection = () => {
  const { t } = useTranslation();

  return (
    <S.Page>
      <S.Section>
        <S.Inner>
          <S.Kicker>{t('partners.eyebrow')}</S.Kicker>
          <S.Title>
            {t('partners.title')} <S.Highlight>{t('partners.titleHighlight')}</S.Highlight>
          </S.Title>
          <S.Intro>{t('partners.intro')}</S.Intro>
          <S.Actions>
            <S.PrimaryLink href="#interesse">{t('partners.ctaPrimary')}</S.PrimaryLink>
            <S.GhostLink href="#modelos">{t('partners.ctaSecondary')}</S.GhostLink>
          </S.Actions>
          <S.Facts>
            <div>
              <strong>{t('partners.facts.clientsValue')}</strong>
              <span>{t('partners.facts.clientsLabel')}</span>
            </div>
            <div>
              <strong>{t('partners.facts.stackValue')}</strong>
              <span>{t('partners.facts.stackLabel')}</span>
            </div>
            <div>
              <strong>{t('partners.facts.replyValue')}</strong>
              <span>{t('partners.facts.replyLabel')}</span>
            </div>
          </S.Facts>
        </S.Inner>
      </S.Section>

      <S.Section id="modelos">
        <S.Inner>
          <S.SectionTitle>{t('partners.modelsTitle')}</S.SectionTitle>
          <S.SectionLead>{t('partners.modelsLead')}</S.SectionLead>
          <S.Models>
            {PARTNERSHIP_TYPES.filter((v) => v !== 'outro').map((v, i) => (
              <S.Model key={v}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t(`partners.models.${v}.title`)}</h3>
                <p>{t(`partners.models.${v}.body`)}</p>
                <p className="for">
                  <b>{t('partners.idealFor')}</b> {t(`partners.models.${v}.for`)}
                </p>
              </S.Model>
            ))}
          </S.Models>
        </S.Inner>
      </S.Section>

      <S.Section>
        <S.Inner>
          <S.SectionTitle>{t('partners.offerTitle')}</S.SectionTitle>
          <S.SectionLead>{t('partners.offerLead')}</S.SectionLead>
          <S.Offer>
            {OFFER.map((k) => (
              <li key={k}>
                <b>{t(`partners.offer.${k}.title`)}</b>
                {t(`partners.offer.${k}.body`)}
              </li>
            ))}
          </S.Offer>
        </S.Inner>
      </S.Section>

      <S.Section>
        <S.Inner>
          <S.SectionTitle>{t('partners.stepsTitle')}</S.SectionTitle>
          <S.Steps>
            {STEPS.map((k) => (
              <li key={k}>
                <h3>{t(`partners.steps.${k}.title`)}</h3>
                <p>{t(`partners.steps.${k}.body`)}</p>
              </li>
            ))}
          </S.Steps>
        </S.Inner>
      </S.Section>

      <S.FormSection id="interesse">
        <S.FormGrid>
          <S.FormAside>
            <h2>{t('partners.form.title')}</h2>
            <p>{t('partners.form.subtitle')}</p>
            <p>{t('partners.form.aside')}</p>
            <a className="mail" href="mailto:comercial@drivedata.com.br">
              comercial@drivedata.com.br
            </a>
          </S.FormAside>
          <PartnerForm />
        </S.FormGrid>
      </S.FormSection>
    </S.Page>
  );
};
