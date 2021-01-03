import { Response } from 'superagent';
import { HttpStatus } from '@nestjs/common';
import { REFRESH_TOKEN_COOKIES } from '@/constants';
import { extractCookies } from '../../service/cookies';
import {
  getLoginRecords,
  login,
  logoutOthers,
  refreshToken,
  setupRoot
} from '../../service/auth';
import { createUser, createUserDto } from '../../service/user';

export function testLoginRecords() {
  const loginPayload = createUserDto();
  const responses: Response[] = [];
  const cookies: ReturnType<typeof extractCookies>[] = [];

  beforeAll(async () => {
    await setupRoot();
    await createUser(root.token, loginPayload);
  });

  beforeEach(async () => {
    if (responses.length === 0) {
      for (let i = 0; i < 3; i++) {
        const response = await login(loginPayload);
        cookies.push(extractCookies(response.headers, REFRESH_TOKEN_COOKIES));
        responses.push(response);
      }
    }
  });

  test(`user can get login records`, async () => {
    const response = await getLoginRecords(responses[0].body.token);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(3);

    for (const res of response.body) {
      expect(res).toEqual({
        id: expect.any(String),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        current: responses[0].body.id === res.id
      });
    }
  });

  test(`user can logout ohters token`, async () => {
    let response = await logoutOthers(
      responses[0].body.token,
      `${REFRESH_TOKEN_COOKIES}=${cookies[0].value}`
    );
    expect(response.status).toBe(HttpStatus.OK);

    // others token should be invalid
    for (let i = 1; i < cookies.length; i++) {
      const response = await refreshToken(
        `${REFRESH_TOKEN_COOKIES}=${cookies[i].value}`
      );
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }

    response = await refreshToken(
      `${REFRESH_TOKEN_COOKIES}=${cookies[0].value}`
    );
    expect(response.status).toBe(HttpStatus.OK);
  });
}
