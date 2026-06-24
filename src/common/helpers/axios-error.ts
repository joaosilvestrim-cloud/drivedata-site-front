import { UnexpectedError } from '@/common/errors';
import axios, { AxiosResponse } from 'axios';

export const handleAxiosError = (err: any): AxiosResponse => {
  if (axios.isAxiosError(err) && err.response) {
    return err.response;
  }
  throw new UnexpectedError();
};
