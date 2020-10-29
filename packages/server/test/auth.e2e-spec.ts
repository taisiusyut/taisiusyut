import { Response } from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@/typings';
import { REFRESH_TOKEN_COOKIES } from '@/modules/auth/auth.controller';
import {
  login,
  logout,
  refreshToken,
  registration,
  loginAsDefaultRoot,
  createUserAndLogin,
  getToken,
  setupRoot
} from './service/auth';
import { createUser, createUserDto } from './service/user';
import { extractCookies } from './service/cookies';
import { ConfigService } from '@nestjs/config';

describe('AuthController (e2e)', () => {
  const configService = app.get<ConfigService>(ConfigService);
  const jwtExpires =
    configService.get<number>('JWT_TOKEN_EXPIRES_IN_MINUTES') * 60 * 1000;
  const refreshTokenExpires =
    configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_MINUTES') * 60 * 1000;

  const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

  let refreshTokenVal: string;

  function validateCookies(response: Response) {
    const cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);
    expect(cookie).toBeDefined();
    expect(cookie.flag['Max-Age']).toBe(String(refreshTokenExpires));
    expect(cookie.flag['HttpOnly']).toBeTrue();

    refreshTokenVal = `${REFRESH_TOKEN_COOKIES}=${cookie.value}`;

    return cookie;
  }

  beforeEach(async () => {
    await setupRoot();
  });

  describe(`(POST) Login & Logout`, () => {
    test('Login with default root', async () => {
      const response = await loginAsDefaultRoot();
      expect(response.error).toBeFalse();
      expect(response.body).toMatchObject({ isDefaultAc: true });

      root = response.body;
    });

    test('Login with registered user and logout', async () => {
      const mockUser = createUserDto();

      let response = await createUser(root.token, mockUser);
      expect(response.error).toBeFalse();

      response = await login(mockUser);
      expect(response.error).toBeFalse();
      expect(response.body).toMatchObject({ isDefaultAc: false });
      validateCookies(response);

      response = await logout();
      expect(response.error).toBeFalse();
      expect(
        extractCookies(response.header, REFRESH_TOKEN_COOKIES).value
      ).toBeEmpty();
    });
  });

  describe(`(POST) Registration`, () => {
    test('These roles should not be registered', async () => {
      const roles = [UserRole.Root, UserRole.Admin, UserRole.Author];
      await expect(
        Promise.all(roles.map(role => registration({ role })))
      ).resolves.toSatisfyAll(
        (response: Response) => response.status === HttpStatus.BAD_REQUEST
      );
    });

    test('Client registration', async () => {
      await expect(
        Promise.all([
          registration({ role: undefined }),
          registration({ role: UserRole.Client })
        ])
      ).resolves.toSatisfyAll(
        (response: Response) => response.status === HttpStatus.CREATED
      );
    });
  });

  describe('(POST) Refresh Token', () => {
    test('Refresh', async () => {
      if (refreshTokenVal) {
        const response = await refreshToken(refreshTokenVal);
        console.log(response.error);
        expect(response.error).toBeFalse();
        validateCookies(response);
      }
    });

    test.skip(
      'Expires',
      async () => {
        await delay(refreshTokenExpires * 2);
        const response = await refreshToken(refreshTokenVal);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
      refreshTokenExpires * 4
    );
  });

  test.skip(
    'JWT expires',
    async () => {
      let response = await createUserAndLogin(root.token, {
        role: UserRole.Admin
      });

      const token = await getToken(response);

      // create user success
      response = await createUser(token);
      expect(response.error).toBeFalse();

      // wait for expires
      await delay(jwtExpires);

      // token should become invalid
      response = await createUser(token);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    },
    jwtExpires * 2
  );
});
