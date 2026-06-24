import { API_URL } from '@/common/consts/api';
import axios, { AxiosResponse } from 'axios';

export const makeApiUrl = (path = ''): string => {
  return `${API_URL}${path}`;
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
