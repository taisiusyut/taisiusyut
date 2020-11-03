import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated, UserRole } from '@/typings';
import { REFRESH_TOKEN_COOKIES } from '@/modules/auth/auth.controller';
import {
  createUserAndLogin,
  deleteAccount,
  login,
  loginAsDefaultRoot
} from '../../service/auth';
import { extractCookies } from '../../service/cookies';
import { createUserDto } from '../../service/user';

export function testDeleteAccount() {
  const mock = {
    root: createUserDto({ role: UserRole.Root }),
    admin: createUserDto({ role: UserRole.Admin }),
    author: createUserDto({ role: UserRole.Author }),
    client: createUserDto({ role: UserRole.Client })
  };

  const auth: Record<string, Schema$Authenticated> = {};

  let defaultRoot: Schema$Authenticated;

  beforeAll(async () => {
    const response = await loginAsDefaultRoot();
    defaultRoot = response.body;
  });

  test.each(['root', 'admin', 'author', 'client'])(
    '%s can delete account',
    async type => {
      const account = mock[type as keyof typeof mock];
      let response = await createUserAndLogin(
        (auth.root || defaultRoot).token,
        account
      );
      auth[type] = response.body;

      const cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);
      expect(cookie).toBeObject();

      response = await deleteAccount(auth[type].token, account);
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.OK);
      expect(
        extractCookies(response.header, REFRESH_TOKEN_COOKIES).value
      ).toBeEmpty();

      response = await login(account);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  );
}
