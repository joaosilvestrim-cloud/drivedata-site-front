'use client';

import { Standard } from '@typebot.io/nextjs';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypebot } from '../../providers/TypebotProvider';
import {
  TypebotModalBackdrop,
  TypebotModalCloseButton,
  TypebotModalContainer,
  TypebotWrapper,
} from './styles';

const LOCALE_MAP: Record<string, 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR'> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
};

export const TypebotModal = () => {
  const { isOpen, closeTypebot } = useTypebot();
  const { i18n } = useTranslation();
  const typebotLocale = LOCALE_MAP[i18n.resolvedLanguage ?? i18n.language] ?? 'pt-BR';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeTypebot();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, closeTypebot]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        closeTypebot();
      }
    },
    [closeTypebot],
  );

  return (
    <TypebotModalBackdrop isOpen={isOpen} onClick={handleBackdropClick}>
      <TypebotModalContainer isOpen={isOpen}>
        <TypebotModalCloseButton onClick={closeTypebot}>
          ×
        </TypebotModalCloseButton>
        <TypebotWrapper>
          <Standard
            typebot="leads"
            apiHost="https://chat.projetarsebi.com.br"
            style={{ width: '100%', height: '100%' }}
            prefilledVariables={{
              locale: typebotLocale,
            }}
          />

          {/* <iframe
            src="https://chat.projetarsebi.com.br/leads"
            style={{ border: 'none', width: '100%', height: '600px' }}
          ></iframe> */}
        </TypebotWrapper>
      </TypebotModalContainer>
    </TypebotModalBackdrop>
  );
};
