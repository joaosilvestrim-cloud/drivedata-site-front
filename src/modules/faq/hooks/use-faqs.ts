'use client';

import { useDynamicServerData } from '@/common/hooks/use-dynamic-server-data';
import { getLanguageSafe } from '@/common/helpers/get-language-client';
import { FaqModel } from '@/common/model/faq.model';
import { httpFindManyFaq } from '../api/find-many-faq/http-find-many-faq';
import { FindManyFaqParams } from '../types/find-many-faq-case';

/**
 * Hook para gerenciar FAQs com atualização automática ao trocar idioma.
 * 
 * @param initialFaqs - FAQs iniciais vindos do SSR
 * @param params - Parâmetros opcionais para a busca
 * @returns Objeto com dados atuais, estado de loading e possível erro
 */
export function useFaqs(
  initialFaqs: FaqModel[],
  params?: FindManyFaqParams
) {
  return useDynamicServerData(
    initialFaqs,
    () => {
      const lang = getLanguageSafe();
      return httpFindManyFaq(params || {}, lang);
    }
  );
}
