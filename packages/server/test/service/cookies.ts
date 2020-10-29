interface Header {
  'set-cookie'?: string[];
}

type Flag = Record<string, unknown>;
type Schema = Record<string, { value: string; flag: Flag }>;

export function extractCookies({ 'set-cookie': cookies = [] }: Header): Schema {
  return cookies.reduce((result, cookies) => {
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
  }, {} as Schema);
  // 'fullstack_refresh_token=6ea79ced-c7fa-40a0-a532-e981bbc7be44; Max-Age=60000; HttpOnly'.split('; ')
}
