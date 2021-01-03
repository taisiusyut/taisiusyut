import { HttpStatus } from '@nestjs/common';
import { rid } from '@/utils/rid';
import { Schema$Authenticated, UserRole } from '@/typings';
import { REFRESH_TOKEN_COOKIES } from '@/constants';
import { UserService } from '@/modules/user/user.service';
import { ModifyPasswordDto } from '@/modules/auth/dto';
import {
  login,
  modifyPassword,
  createUserAndLogin,
  loginAsDefaultRoot
} from '../../service/auth';
import { extractCookies } from '../../service/cookies';
import { CreateUserDto, createUserDto } from '../../service/user';

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

  afterAll(async () => {
    await app.get(UserService).delete({ _id: auth.root.user.user_id });
  });

  test.each(['root', 'admin', 'author', 'client'])(
    '%s can modify password',
    async type => {
      const account: CreateUserDto = mock[type as keyof typeof mock];

      let response = await createUserAndLogin(defaultRoot.token, account);
      auth[type] = response.body;

      const cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);
      expect(cookie.value).not.toBeEmpty();

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

      mock[type as keyof typeof mock].password = newPassword;
    }
  );

  test('cannot modify password with invalid format', async () => {
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

    for (const params of payload) {
      const response = await modifyPassword(auth.root.token, params);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });
}
