'use client';

import { useDynamicServerData } from '@/common/hooks/use-dynamic-server-data';
import { getLanguageSafe } from '@/common/helpers/get-language-client';
import { SolutionModel } from '@/common/model/solution.model';
import { httpFindManySolution } from '../api/find-many-solution/http-find-many-solution';
import { FindManySolutionParams } from '../types/find-many-solution-case';

/**
 * Hook para gerenciar solutions com atualização automática ao trocar idioma.
 * 
 * @param initialSolutions - Soluções iniciais vindas do SSR
 * @param params - Parâmetros opcionais para a busca
 * @returns Objeto com dados atuais, estado de loading e possível erro
 */
export function useSolutions(
  initialSolutions: SolutionModel[],
  params?: FindManySolutionParams
) {
  return useDynamicServerData(
    initialSolutions,
    () => {
      const lang = getLanguageSafe();
      return httpFindManySolution(params || {}, lang);
    }
  );
}
