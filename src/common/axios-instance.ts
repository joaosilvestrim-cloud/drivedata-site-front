import { API_URL } from '@/common/consts/api';
import axios, { AxiosResponse } from 'axios';

// Base da API de conteúdo. Prioridade:
// 1) NEXT_PUBLIC_API_URL (se quiserem apontar p/ outro host)
// 2) no cliente: mesma origem (string vazia -> URL relativa)
// 3) no servidor (Vercel): https://$VERCEL_URL (self-call do próprio deploy)
// 4) dev: http://localhost:3000
const resolveApiBase = (): string => {
  if (API_URL) return API_URL;
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const makeApiUrl = (path = ''): string => {
  return `${resolveApiBase()}${path}`;
};

const cleanJSON = (json: Record<string, any>) => {
  for (const key in json) {
    if (json[key] === '') {
      json[key] = null;
    } else if (typeof json[key] === 'object') json[key] = cleanJSON(json[key]);
  }
  return json;
};

const axiosInstance = axios.create({
  baseURL: `${makeApiUrl('/api')}`,
});

const interceptors = [
  (response: AxiosResponse) => response,
  (e: any): Promise<AxiosResponse> => {
    return Promise.reject(e);
  },
];

axiosInstance.interceptors.response.use(...interceptors);

const getPublicApiInstance = () => axiosInstance;

export { getPublicApiInstance };
