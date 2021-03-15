import { HttpStatus } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { Schema$Authenticated } from '@/typings';
import {
  refreshToken,
  createUserAndLogin,
  validateCookies,
  refreshTokenExpires,
  loginAsDefaultRoot
} from '../../service/auth';

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

export function testRefreshToken() {
  let refreshTokenVal: string;

  let defaultRoot: Schema$Authenticated;

  beforeAll(async () => {
    const response = await loginAsDefaultRoot();
    expect(response.body).toHaveProperty('isDefaultAc', true);
    defaultRoot = response.body;
  });

  afterAll(() => app.get(UserService).clear());

  test('refresh', async () => {
    let response = await createUserAndLogin(defaultRoot.token);
    const cookie = validateCookies(response);
    refreshTokenVal = cookie.value;

    response = await refreshToken(refreshTokenVal);
    expect(response.status).toBe(HttpStatus.OK);
    validateCookies(response);
  });

  test.skip(
    'expires',
    async () => {
      await delay(refreshTokenExpires * 2);
      const response = await refreshToken(refreshTokenVal);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    },
    refreshTokenExpires * 4
  );
}
