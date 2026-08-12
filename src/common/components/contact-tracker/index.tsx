'use client';

import { useEffect } from 'react';
import { trackLeadConversion } from '@/common/helpers/track-conversion';

/**
 * Listener global de pontos de contato: dispara o evento `lead_form_submit` em
 * QUALQUER clique de contato de vendas no site (WhatsApp e e-mail contato@),
 * onde quer que o link esteja, sem precisar tocar em cada componente.
 *
 * Não inclui e-mails legais (privacidade@, jurídico@, suporte@) — não são leads.
 * Chat e formulário já disparam no envio; o agendador dispara no próprio botão.
 */
export function ContactTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) {
        trackLeadConversion({ source: 'whatsapp' });
      } else if (/^mailto:\s*contato@/i.test(href)) {
        trackLeadConversion({ source: 'email' });
      }
    };
    // capture=true garante o registro mesmo se o clique for interceptado depois.
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  return null;
}
