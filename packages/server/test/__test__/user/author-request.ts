import { HttpStatus } from '@nestjs/common';
import { REFRESH_TOKEN_COOKIES } from '@/modules/auth/refresh-token.service';
import { Schema$Authenticated, UserRole } from '@/typings';
import { authorRequest, createUserDto } from '../../service/user';
import {
  createUserAndLogin,
  createUsers,
  refreshToken
} from '../../service/auth';
import { extractCookies } from '../../service/cookies';

async function getCookie(role: UserRole) {
  const userDto = createUserDto({ role });
  const response = await createUserAndLogin(root.token, userDto);
  expect(response.status).toBe(HttpStatus.OK);

  const cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);
  expect(cookie.value).toBeUUID();

  return cookie;
}

export function testAuthorRequest() {
  let mock: Record<string, Schema$Authenticated> = {};

  beforeAll(async () => {
    const [admin, author, client] = await createUsers();
    mock = { admin, author, client };
  });

  test('client request as author success', async () => {
    const cookie = await getCookie(UserRole.Client);

    let response = await authorRequest(
      mock.client.token,
      `${REFRESH_TOKEN_COOKIES}=${cookie.value}`
    );
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('role', UserRole.Author);

    response = await refreshToken(cookie.value);

    expect(response.body.user).toHaveProperty('role', UserRole.Author);
  });

  test.each`
    name           | role
    ${'root'}      | ${UserRole.Root}
    ${'admin'}     | ${UserRole.Admin}
    ${'author'}    | ${UserRole.Author}
    ${'anonymous'} | ${undefined}
  `('$name cannot request as author', async ({ name, role }) => {
    const cookie = role === 'anonymous' ? await getCookie(role) : { value: '' };
    const response = await authorRequest(mock[name]?.token, cookie.value);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });
}
