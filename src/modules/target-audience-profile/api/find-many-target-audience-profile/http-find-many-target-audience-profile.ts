import { getPublicApiInstance } from '@/common/axios-instance';
import type { AppLanguage } from '@/common/i18n/resources';
import { UnexpectedError } from '@/common/errors';
import { handleAxiosError } from '@/common/helpers/axios-error';
import {
  FindManyTargetAudienceProfileParams,
  FindManyTargetAudienceProfileResult,
} from '@/modules/target-audience-profile/types/find-many-target-audience-profile-case';

export const httpFindManyTargetAudienceProfile = async (
  params: FindManyTargetAudienceProfileParams = {},
  lang?: AppLanguage,
): Promise<FindManyTargetAudienceProfileResult> => {
  try {
    return (
      await getPublicApiInstance().get(`/target-audience-profile`, {
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
