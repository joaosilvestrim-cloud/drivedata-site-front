import { getPublicApiInstance } from '@/common/axios-instance';
import type { AppLanguage } from '@/common/i18n/resources';
import { UnexpectedError } from '@/common/errors';
import { handleAxiosError } from '@/common/helpers/axios-error';
import { FindOneArticleByIdParams, FindOneArticleByIdResult } from '@/modules/article/types/find-one-article-by-idcase';

export const httpFindOneArticleById = async (
  { id }: FindOneArticleByIdParams,
  lang?: AppLanguage,
): Promise<FindOneArticleByIdResult> => {
  try {
    return (await getPublicApiInstance().get(`/article/${id}`, {
      params: { ...(lang && { lang }) },
    })).data;
  } catch (err) {
    const { status } = handleAxiosError(err);
    switch (status) {
      default:
        throw new UnexpectedError();
    }
  }
};

