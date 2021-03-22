import axios, { AxiosRequestConfig, CustomAxiosInstance } from 'axios';
import { ValidationHeader } from '@/constants';

function createCustomAxiosInstance(
  config: AxiosRequestConfig
): CustomAxiosInstance {
  const instance = axios.create(config);

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
