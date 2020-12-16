import { HttpStatus } from '@nestjs/common';
import { rid } from '@/utils/rid';
import { Schema$Authenticated, UserRole } from '@/typings';
import { REFRESH_TOKEN_COOKIES } from '@/modules/auth/auth.controller';
import {
  login,
  modifyPassword,
  createUserAndLogin,
  loginAsDefaultRoot,
  setupRoot
} from '../../service/auth';
import { extractCookies } from '../../service/cookies';
import { CreateUserDto, createUserDto } from '../../service/user';
import { ModifyPasswordDto } from '@/modules/auth/dto';

export function testModifyPassword() {
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
    '%s can modify password',
    async type => {
      const account: CreateUserDto = mock[type as keyof typeof mock];
      let response = await createUserAndLogin(
        (auth.root || defaultRoot).token,
        account
      );
      auth[type] = response.body;

      const cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);
      expect(cookie).toBeObject();

      const newPassword = createUserDto().password;
      response = await modifyPassword(auth[type].token, {
        newPassword,
        confirmNewPassword: newPassword,
        password: account.password
      });

      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.OK);
      expect(
        extractCookies(response.header, REFRESH_TOKEN_COOKIES).value
      ).toBeEmpty();

      response = await login(account);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      response = await login({ ...account, password: newPassword });
      expect(response.status).toBe(HttpStatus.OK);
    }
  );

  test('fail to modify password with invalid params', async () => {
    if (auth.root) {
      root = auth.root;
    } else {
      await setupRoot();
    }

    const newPassword = createUserDto().password;
    const payload: ModifyPasswordDto[] = [
      {
        newPassword,
        confirmNewPassword: newPassword,
        password: createUserDto().password
      },
      {
        newPassword,
        confirmNewPassword: `${newPassword}${rid(2)}`,
        password: mock.root.password
      },
      {
        newPassword: '12345678',
        confirmNewPassword: '12345678',
        password: mock.root.password
      }
    ];

    const responses = [];
    for (const params of payload) {
      responses.push(await modifyPassword(root.token, params));
    }

    expect(responses).toSatisfyAll(
      response => response.status === HttpStatus.BAD_REQUEST
    );
  });
}
