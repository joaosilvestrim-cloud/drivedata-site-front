import { getPublicApiInstance } from '@/common/axios-instance';
import type { AppLanguage } from '@/common/i18n/resources';
import { UnexpectedError } from '@/common/errors';
import { handleAxiosError } from '@/common/helpers/axios-error';
import {
  FindManySolutionParams,
  FindManySolutionResult,
} from '@/modules/solution/types/find-many-solution-case';

export const httpFindManySolution = async (
  params: FindManySolutionParams = {},
  lang?: AppLanguage,
): Promise<FindManySolutionResult> => {
  try {
    return (
      await getPublicApiInstance().get('/solution', {
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
