import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated, UserRole } from '@/typings';
import { REFRESH_TOKEN_COOKIES } from '@/modules/auth/refresh-token.service';
import {
  login,
  setupRoot,
  setupUsers,
  createUserAndLogin,
  getGlobalUser,
  refreshToken
} from '../../service/auth';
import { createUserDto, deleteUser } from '../../service/user';
import { extractCookies } from '../../service/cookies';

export function testDeleteUser() {
  beforeAll(async () => {
    await setupRoot();
    await setupUsers();
  });

  test.each`
    executor   | target
    ${'root'}  | ${'admin'}
    ${'root'}  | ${'author'}
    ${'root'}  | ${'client'}
    ${'admin'} | ${'author'}
    ${'admin'} | ${'client'}
  `(
    '$executor can delete $target',
    async ({ executor, target }: Record<string, string>) => {
      const role = (target.slice(0, 1).toUpperCase() +
        target.slice(1)) as keyof typeof UserRole;

      const userDto = createUserDto({ role: UserRole[role] });
      let response = await createUserAndLogin(root.token, userDto);
      expect(response.status).toBe(HttpStatus.OK);

      const cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);
      expect(cookie.value).toBeUUID();

      const targetUser: Schema$Authenticated = response.body;
      const executeUser = getGlobalUser(executor);

      response = await deleteUser(executeUser.token, targetUser.user.user_id);
      expect(response.status).toBe(HttpStatus.OK);

      response = await refreshToken(`${REFRESH_TOKEN_COOKIES}=${cookie.value}`);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      response = await login(userDto);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  );

  test.each`
    executor    | target      | status
    ${'root'}   | ${'self'}   | ${HttpStatus.BAD_REQUEST}
    ${'admin'}  | ${'root'}   | ${HttpStatus.NOT_FOUND}
    ${'admin'}  | ${'admin'}  | ${HttpStatus.NOT_FOUND}
    ${'admin'}  | ${'self'}   | ${HttpStatus.BAD_REQUEST}
    ${'author'} | ${'root'}   | ${HttpStatus.FORBIDDEN}
    ${'author'} | ${'admin'}  | ${HttpStatus.FORBIDDEN}
    ${'author'} | ${'client'} | ${HttpStatus.FORBIDDEN}
    ${'author'} | ${'self'}   | ${HttpStatus.FORBIDDEN}
    ${'client'} | ${'root'}   | ${HttpStatus.FORBIDDEN}
    ${'client'} | ${'admin'}  | ${HttpStatus.FORBIDDEN}
    ${'client'} | ${'author'} | ${HttpStatus.FORBIDDEN}
    ${'client'} | ${'self'}   | ${HttpStatus.FORBIDDEN}
  `(
    '$executor cannot delete $target',
    async ({ executor, target, status }: Record<string, any>) => {
      const executeUser = getGlobalUser(executor);
      let targetUser = target === 'self' ? executeUser : getGlobalUser(target);

      if (executor === 'admin' && target === 'admin') {
        const response = await createUserAndLogin(root.token, {
          role: UserRole.Admin
        });
        targetUser = response.body;
      }

      const response = await deleteUser(
        executeUser.token,
        targetUser.user.user_id
      );
      expect(response.status).toBe(status);
    }
  );
}
