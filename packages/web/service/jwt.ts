import type {
  Param$Login,
  Schema$Authenticated
} from '@fullstack/server/dist/typings';
import { routes } from '@fullstack/server/dist/constants';
import { defer, Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { api } from './api';
import { login, refreshToken } from './auth';

let jwtToken$: Observable<Schema$Authenticated> | null = null;

export function clearJwtToken() {
  jwtToken$ = null;
}

export const authenticate$ = (payload?: Param$Login) =>
  defer(() => (payload ? login(payload) : refreshToken())).pipe(shareReplay(1));

export function getJwtToken(payload?: Param$Login) {
  return (jwtToken$ || authenticate$(payload)).pipe(
    switchMap(payload => {
      const expired = +new Date(payload.expiry) - +new Date() <= 30 * 1000;
      jwtToken$ = expired ? authenticate$() : jwtToken$ || of(payload);
      return jwtToken$;
    })
  );
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
  if (!isAuthUrl(config.url) && jwtToken$) {
    const { token } = await getJwtToken().toPromise();
    config.headers['Authorization'] = 'bearer ' + token;
  }
  return config;
});
