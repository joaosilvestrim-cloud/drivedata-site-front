'use client';

import { useCallback, useEffect } from 'react';
import { useTypebot } from '../../providers/TypebotProvider';
import { LeadChat } from '../lead-chat';
import {
  TypebotModalBackdrop,
  TypebotModalCloseButton,
  TypebotModalContainer,
  TypebotWrapper,
} from './styles';

// Modal de contato: agora renderiza o NOSSO chat (LeadChat → /api/lead → CRM),
// no lugar do antigo embed do Typebot da agência.
export const TypebotModal = () => {
  const { isOpen, closeTypebot } = useTypebot();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) closeTypebot();
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, closeTypebot]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) closeTypebot();
    },
    [closeTypebot],
  );

  return (
    <TypebotModalBackdrop isOpen={isOpen} onClick={handleBackdropClick}>
      <TypebotModalContainer isOpen={isOpen}>
        <TypebotModalCloseButton onClick={closeTypebot}>×</TypebotModalCloseButton>
        <TypebotWrapper>
          <LeadChat />
        </TypebotWrapper>
      </TypebotModalContainer>
    </TypebotModalBackdrop>
  );
};
