import Constants from 'expo-constants';
import { api } from '@taisiusyut/common/service';
import { ValidationHeader } from '@taisiusyut/server/dist/constants';

const { PORT = 5000, debuggerHost, VALIDATION_HEADER } = Constants.manifest;

const localhost = debuggerHost?.split(':')[0] || 'localhost';
const baseURL = __DEV__
  ? `http://${localhost}:${PORT}`
  : 'https://taisiusyut.com';

api.defaults.baseURL = baseURL.replace(/\/$/, '') + api.defaults.baseURL;

api.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    referer: 'taisiusyut-react-native',
    [ValidationHeader]: VALIDATION_HEADER || ValidationHeader
  };
  return config;
});

export * from '@taisiusyut/common/service';
