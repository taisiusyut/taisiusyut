import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

api.interceptors.response.use(response => {
  return response.config.useResponse ? response : response.data;
});
