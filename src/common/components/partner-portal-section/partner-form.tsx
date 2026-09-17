'use client';

import { COMPANY_SIZES, DATA_MATURITY, HOW_HEARD, PARTNERSHIP_TYPES } from '@/common/model/partner-application.model';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './styles';

// Formulário do Portal do Parceiro: JSON para /api/parceria. Validação nativa do
// navegador nos obrigatórios; o servidor valida de novo.
export const PartnerForm = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (state === 'done') {
    return (
      <S.Success role="status">
        <strong aria-hidden="true">✓</strong>
        <div>
          <h3>{t('partners.form.successTitle')}</h3>
          <p>{t('partners.form.successBody')}</p>
        </div>
      </S.Success>
    );
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(fd.entries());
    payload.consent = fd.get('consent') === 'true';
    payload.page = window.location.pathname;

    setState('sending');
    setError(null);
    try {
      const r = await fetch('/api/parceria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        setError(j.error || t('partners.form.errorGeneric'));
        setState('idle');
        return;
      }
      setState('done');
    } catch {
      setError(t('partners.form.errorGeneric'));
      setState('idle');
    }
  };

  return (
    <S.Form onSubmit={onSubmit}>
      <S.Field full>
        <label htmlFor="pt-type">{t('partners.form.type')}</label>
        <select id="pt-type" name="partnershipType" defaultValue="indicacao" required>
          {PARTNERSHIP_TYPES.map((v) => (
            <option key={v} value={v}>
              {t(`partners.models.${v}.title`)}
            </option>
          ))}
        </select>
      </S.Field>

      <S.Field>
        <label htmlFor="pt-company">{t('partners.form.company')}</label>
        <input id="pt-company" name="company" required autoComplete="organization" maxLength={160} />
      </S.Field>
      <S.Field>
        <label htmlFor="pt-cnpj">{t('partners.form.cnpj')}</label>
        <input id="pt-cnpj" name="cnpj" maxLength={30} />
      </S.Field>
      <S.Field>
        <label htmlFor="pt-site">{t('partners.form.website')}</label>
        <input id="pt-site" name="website" inputMode="url" placeholder="empresa.com.br" maxLength={300} />
      </S.Field>
      <S.Field>
        <label htmlFor="pt-linkedin">{t('partners.form.linkedin')}</label>
        <input id="pt-linkedin" name="linkedinUrl" inputMode="url" placeholder="linkedin.com/company/…" maxLength={300} />
      </S.Field>

      <S.Field>
        <label htmlFor="pt-name">{t('partners.form.contactName')}</label>
        <input id="pt-name" name="contactName" required autoComplete="name" maxLength={160} />
      </S.Field>
      <S.Field>
        <label htmlFor="pt-role">{t('partners.form.contactRole')}</label>
        <input id="pt-role" name="contactRole" autoComplete="organization-title" maxLength={120} />
      </S.Field>
      <S.Field>
        <label htmlFor="pt-email">{t('partners.form.email')}</label>
        <input id="pt-email" name="email" type="email" required autoComplete="email" maxLength={200} />
      </S.Field>
      <S.Field>
        <label htmlFor="pt-phone">{t('partners.form.phone')}</label>
        <input id="pt-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </S.Field>

      <S.Field>
        <label htmlFor="pt-region">{t('partners.form.region')}</label>
        <input id="pt-region" name="region" placeholder={t('partners.form.regionHint')} maxLength={160} />
      </S.Field>
      <S.Field>
        <label htmlFor="pt-segment">{t('partners.form.segment')}</label>
        <input id="pt-segment" name="segment" placeholder={t('partners.form.segmentHint')} maxLength={160} />
      </S.Field>

      <S.Field>
        <label htmlFor="pt-size">{t('partners.form.size')}</label>
        <select id="pt-size" name="companySize" defaultValue="">
          <option value="">{t('partners.form.choose')}</option>
          {COMPANY_SIZES.map((v) => (
            <option key={v} value={v}>
              {t('partners.form.sizeOption', { range: v })}
            </option>
          ))}
        </select>
      </S.Field>
      <S.Field>
        <label htmlFor="pt-maturity">{t('partners.form.maturity')}</label>
        <select id="pt-maturity" name="dataMaturity" defaultValue="">
          <option value="">{t('partners.form.choose')}</option>
          {DATA_MATURITY.map((v) => (
            <option key={v} value={v}>
              {t(`partners.form.maturityOptions.${v}`)}
            </option>
          ))}
        </select>
      </S.Field>

      <S.Field full>
        <label htmlFor="pt-message">{t('partners.form.message')}</label>
        <textarea id="pt-message" name="message" maxLength={3000} placeholder={t('partners.form.messageHint')} />
      </S.Field>

      <S.Field full>
        <label htmlFor="pt-heard">{t('partners.form.howHeard')}</label>
        <select id="pt-heard" name="howHeard" defaultValue="">
          <option value="">{t('partners.form.choose')}</option>
          {HOW_HEARD.map((v) => (
            <option key={v} value={v}>
              {t(`partners.form.howHeardOptions.${v}`)}
            </option>
          ))}
        </select>
      </S.Field>

      <S.Honey aria-hidden="true">
        <label>
          Website
          <input name="website2" tabIndex={-1} autoComplete="off" />
        </label>
      </S.Honey>

      <S.Consent>
        <input id="pt-consent" name="consent" type="checkbox" value="true" required />
        <label htmlFor="pt-consent">
          {t('partners.form.consent')}{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            {t('partners.form.privacy')}
          </a>
          .
        </label>
      </S.Consent>

      {error && <S.ErrorMsg role="alert">{error}</S.ErrorMsg>}

      <S.Submit type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? t('partners.form.sending') : t('partners.form.submit')}
      </S.Submit>
    </S.Form>
  );
};
