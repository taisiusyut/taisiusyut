import * as supertest from 'supertest';
import cookieSignature from 'cookie-signature';
import { ConfigService } from '../../src/config';
interface Header {
  'set-cookie'?: string[];
}

type Flag = Record<string, unknown>;
export type Cookie = { value: string; flag: Flag };
export type Cookies = Record<string, Cookie>;
export type SetCookie = { key: string; value: string };

const configService = app.get(ConfigService);
const secret = configService.get<string>('COOKIE_SECRET', '');

export function setCookies(request: supertest.Test, cookies: SetCookie[]) {
  for (const { key, value } of cookies) {
    return request.set('Cookie', `${key}=${value}`);
  }
  return request;
}

export function extractCookies(header: Header): Cookies;
export function extractCookies(header: Header, key: string): Cookie;
export function extractCookies(
  { 'set-cookie': cookies = [] }: Header,
  key?: string
): Cookies | Cookie {
  const _cookies = cookies.reduce((result, cookies) => {
    const [target, ...flag] = cookies.split('; ');

    if (target) {
      const [name, value] = target.split('=');

      result[name] = {
        value:
          cookieSignature.unsign(decodeURIComponent(value), secret) || value,
        flag: flag.reduce((flag, str) => {
          const [name, value = true] = str.split('=');
          return { ...flag, [name]: value };
        }, {} as Flag)
      };
    }
    return result;
  }, {} as Cookies);

  return key ? _cookies[key] : _cookies;
}
