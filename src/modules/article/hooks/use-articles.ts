'use client';

import { useDynamicServerData } from '@/common/hooks/use-dynamic-server-data';
import { getLanguageSafe } from '@/common/helpers/get-language-client';
import { httpFindManyArticle } from '../api/find-many-article/http-find-many-article';
import { FindManyArticleParams, FindManyArticleResult } from '../types/find-many-article-case';

/**
 * Hook para gerenciar articles com atualização automática ao trocar idioma.
 * 
 * @param initialArticles - Artigos iniciais vindos do SSR
 * @param params - Parâmetros opcionais para a busca (ex: limit)
 * @returns Objeto com dados atuais, estado de loading e possível erro
 */
export function useArticles(
  initialArticles: FindManyArticleResult,
  params?: FindManyArticleParams
) {
  return useDynamicServerData(
    initialArticles,
    () => {
      const lang = getLanguageSafe();
      return httpFindManyArticle(params || {}, lang);
    }
  );
}
