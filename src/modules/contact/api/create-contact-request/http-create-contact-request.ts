import { getPublicApiInstance } from '@/common/axios-instance';
import { UnexpectedError } from '@/common/errors';
import { handleAxiosError } from '@/common/helpers/axios-error';
import {
    CreateContactRequestParams,
    CreateContactRequestResult,
} from '../../types/create-contact-request-case';

export const httpCreateContactRequest = async (
  params: CreateContactRequestParams,
): Promise<CreateContactRequestResult> => {
  try {
    const { data } = await getPublicApiInstance().post(
      '/contact',
      params,
    );
    return data;
  } catch (err) {
    const { status, data } = handleAxiosError(err);
    switch (status) {
      case 400: {
        const message =
          Array.isArray((data as any)?.message) && (data as any)?.message.length
            ? (data as any).message.join(' ')
            : (data as any)?.message;

        throw new Error(
          message || 'Por favor, verifique os dados informados.',
        );
      }
      default:
        throw new UnexpectedError();
    }
  }
};

