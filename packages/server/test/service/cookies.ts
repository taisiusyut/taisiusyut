interface Header {
  'set-cookie'?: string[];
}

type Flag = Record<string, unknown>;
export type Cookie = { value: string; flag: Flag };
export type Cookies = Record<string, Cookie>;

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
        value,
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
