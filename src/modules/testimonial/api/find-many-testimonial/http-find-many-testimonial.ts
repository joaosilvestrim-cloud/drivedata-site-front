import { getPublicApiInstance } from '@/common/axios-instance';
import type { AppLanguage } from '@/common/i18n/resources';
import { UnexpectedError } from '@/common/errors';
import { handleAxiosError } from '@/common/helpers/axios-error';
import {
  FindManyTestimonialParams,
  FindManyTestimonialResult,
} from '@/modules/testimonial/types/find-many-testimonial-case';

export const httpFindManyTestimonial = async (
  params: FindManyTestimonialParams = {},
  lang?: AppLanguage,
): Promise<FindManyTestimonialResult> => {
  try {
    return (
      await getPublicApiInstance().get('/testimonial', {
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

