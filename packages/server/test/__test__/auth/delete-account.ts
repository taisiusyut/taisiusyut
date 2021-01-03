import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated, UserRole } from '@/typings';
import { REFRESH_TOKEN_COOKIES } from '@/modules/auth/refresh-token.service';
import { UserService } from '@/modules/user/user.service';
import {
  createUserAndLogin,
  deleteAccount,
  login,
  loginAsDefaultRoot
} from '../../service/auth';
import { extractCookies } from '../../service/cookies';
import { createUserDto } from '../../service/user';

export function testDeleteAccount() {
  const data = {
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

  afterAll(async () => {
    await app.get(UserService).delete({ _id: auth.root.user.user_id });
  });

  test.each(['root', 'admin'])('%s can delete account', async type => {
    const account = data[type as keyof typeof data];

    let response = await createUserAndLogin(
      (auth.root || defaultRoot).token,
      account
    );
    auth[type] = response.body;

    let cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);
    expect(cookie.value).toBeUUID();

    response = await deleteAccount(auth[type].token, account);
    cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);

    expect(response.status).toBe(HttpStatus.OK);
    expect(cookie.value).toBeEmpty();

    response = await login(account);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
}
