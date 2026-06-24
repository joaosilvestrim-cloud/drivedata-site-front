'use client';

import { useDynamicServerData } from '@/common/hooks/use-dynamic-server-data';
import { getLanguageSafe } from '@/common/helpers/get-language-client';
import { TestimonialModel } from '@/common/model/testimonial.model';
import { httpFindManyTestimonial } from '../api/find-many-testimonial/http-find-many-testimonial';
import { FindManyTestimonialParams } from '../types/find-many-testimonial-case';

/**
 * Hook para gerenciar testimonials com atualização automática ao trocar idioma.
 * 
 * @param initialTestimonials - Depoimentos iniciais vindos do SSR
 * @param params - Parâmetros opcionais para a busca
 * @returns Objeto com dados atuais, estado de loading e possível erro
 */
export function useTestimonials(
  initialTestimonials: TestimonialModel[],
  params?: FindManyTestimonialParams
) {
  return useDynamicServerData(
    initialTestimonials,
    () => {
      const lang = getLanguageSafe();
      return httpFindManyTestimonial(params || {}, lang);
    }
  );
}
