import type { Param$Login, Schema$Authenticated } from '@/typings';
import { routes } from '@/constants';
import { api } from './api';
import { login, refreshToken } from './auth';

let jwtToken: Schema$Authenticated | null = null;

export function clearJwtToken() {
  jwtToken = null;
}

const isExpired = (jwtToken: Schema$Authenticated) =>
  +new Date(jwtToken.expiry) - +new Date() <= 30 * 1000;

export async function getJwtToken(payload?: Param$Login) {
  if (!jwtToken || isExpired(jwtToken)) {
    jwtToken = await (payload ? login(payload) : refreshToken());
  }
  return jwtToken;
}

const excludeAuthUrls = [
  routes.login,
  routes.refresh_token,
  routes.registration
];

const authUrlRegex = new RegExp(
  `(${excludeAuthUrls.join('|').replace(/\//g, '\\/')})$`
);

const isAuthUrl = (url?: string) => url && authUrlRegex.test(url);

api.interceptors.request.use(async config => {
  if (!isAuthUrl(config.url)) {
    const { token } = await getJwtToken();
    config.headers['Authorization'] = 'bearer ' + token;
  }
  return config;
});
