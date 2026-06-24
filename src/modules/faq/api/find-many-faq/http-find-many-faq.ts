import { getPublicApiInstance } from '@/common/axios-instance';
import type { AppLanguage } from '@/common/i18n/resources';
import { UnexpectedError } from '@/common/errors';
import { handleAxiosError } from '@/common/helpers/axios-error';
import { FindManyFaqParams, FindManyFaqResult } from '../../types/find-many-faq-case';

export const httpFindManyFaq = async (
  params: FindManyFaqParams = {},
  lang?: AppLanguage,
): Promise<FindManyFaqResult> => {
  try {
    return (
      await getPublicApiInstance().get('/faq', {
        params: {
          ...params,
          ...(lang && { lang }),
        },
      })
    ).data;
  } catch (err) {
    const { status } = handleAxiosError(err);
    switch (status) {
      default:
        throw new UnexpectedError();
    }
  }
};

