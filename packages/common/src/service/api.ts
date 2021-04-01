import axios, { AxiosRequestConfig, CustomAxiosInstance } from 'axios';

function createCustomAxiosInstance(
  config: AxiosRequestConfig
): CustomAxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.response.use(response => {
    return response.config.useResponse ? response : response.data;
  });

  return instance;
}

export const api = createCustomAxiosInstance({
  baseURL: '/api'
});
