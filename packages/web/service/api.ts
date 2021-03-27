import axios, { AxiosRequestConfig, CustomAxiosInstance } from 'axios';
import { ValidationHeader } from '@/constants';
import { isHeadless } from '@/utils/isHeadless';

let headLess: boolean | null = null;

function createCustomAxiosInstance(
  config: AxiosRequestConfig
): CustomAxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.request.use(config => {
    if (headLess === null) {
      headLess = !!isHeadless();
    }
    if (headLess === true) {
      throw new Error(`headless browser`);
    }
    return config;
  });

  instance.interceptors.request.use(config => {
    config.headers = {
      ...config.headers,
      [ValidationHeader]:
        process.env.NEXT_PUBLIC_VALIDATION_HEADER || ValidationHeader
    };
    return config;
  });

  instance.interceptors.response.use(response => {
    return response.config.useResponse ? response : response.data;
  });

  return instance;
}

export const api = createCustomAxiosInstance({
  baseURL: '/api'
});
