import { REFRESH_TOKEN_COOKIES } from '@/modules/auth/refresh-token.service';
import { UserService } from '@/modules/user/user.service';
import { Schema$Authenticated, UserRole } from '@/typings';
import {
  login,
  logout,
  loginAsDefaultRoot,
  validateCookies
} from '../../service/auth';
import { createUser, createUserDto } from '../../service/user';
import { extractCookies } from '../../service/cookies';
import { HttpStatus } from '@nestjs/common';

export function testLoginLogout() {
  let defaultRoot: Schema$Authenticated;

  afterAll(() => app.get(UserService).clear());

  test('Login with default root', async () => {
    const response = await loginAsDefaultRoot();
    expect(response.body).toHaveProperty('isDefaultAc', true);
    defaultRoot = response.body;
  });

  test('Login with registered user and logout', async () => {
    const roles = [
      UserRole.Root,
      UserRole.Admin,
      UserRole.Author,
      UserRole.Client
    ];
    for (const role of roles) {
      const user = createUserDto({ role });

      let response = await createUser(defaultRoot.token, user);
      expect(response.status).toBe(HttpStatus.CREATED);

      response = await login(user);
      expect(response.body).not.toHaveProperty('isDefaultAc');
      validateCookies(response);

      response = await logout();
      expect(
        extractCookies(response.header, REFRESH_TOKEN_COOKIES).value
      ).toBeEmpty();
    }
  });
}
