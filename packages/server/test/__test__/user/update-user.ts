import { HttpStatus } from '@nestjs/common';
import { REFRESH_TOKEN_COOKIES } from '@/modules/auth/refresh-token.service';
import { Schema$Authenticated, UserStatus } from '@/typings';
import { rid } from '@/utils/rid';
import { updateUser } from '../../service/user';
import {
  createUserAndLogin,
  createUsers,
  getGlobalUser,
  refreshToken,
  setupRoot,
  setupUsers
} from '../../service/auth';
import { extractCookies } from '../../service/cookies';

export function testUpdateUser() {
  beforeAll(async () => {
    await setupRoot();
    await setupUsers();
  });

  test.each`
    executor   | target
    ${'root'}  | ${'admin'}
    ${'root'}  | ${'client'}
    ${'root'}  | ${'author'}
    ${'root'}  | ${'self'}
    ${'admin'} | ${'author'}
    ${'admin'} | ${'client'}
    ${'admin'} | ${'self'}
  `(
    '$executor can update $target',
    async ({ executor, target }: Record<string, any>) => {
      await setupUsers();
      const newEmal = `${rid(8)}@gmail.com`;
      const executeUser = getGlobalUser(executor);
      const targetUser = getGlobalUser(target);
      const userId =
        target === 'self' ? executeUser.user.user_id : targetUser.user.user_id;

      const response = await updateUser(executeUser.token, userId, {
        email: newEmal
      });
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('email', newEmal);
    }
  );

  describe('cannot update', () => {
    let mock: Record<string, Schema$Authenticated> = {};

    beforeAll(async () => {
      const [admin, author, client] = await createUsers();
      mock = { admin, author, client };
    });

    async function forbiddenUpdate(
      executor: Schema$Authenticated,
      target: Schema$Authenticated,
      status: HttpStatus
    ) {
      const newEmal = `${rid(8)}@gmail.com`;
      const response = await updateUser(executor.token, target.user.user_id, {
        email: newEmal
      });
      expect(response.status).toBe(status);
    }

    test.each`
      executor    | target      | status
      ${'admin'}  | ${'root'}   | ${HttpStatus.NOT_FOUND}
      ${'author'} | ${'root'}   | ${HttpStatus.FORBIDDEN}
      ${'author'} | ${'admin'}  | ${HttpStatus.FORBIDDEN}
      ${'author'} | ${'client'} | ${HttpStatus.FORBIDDEN}
      ${'client'} | ${'root'}   | ${HttpStatus.FORBIDDEN}
      ${'client'} | ${'admin'}  | ${HttpStatus.FORBIDDEN}
      ${'client'} | ${'author'} | ${HttpStatus.FORBIDDEN}
    `(
      '$executor cannot update $target',
      async ({ executor, target, status }: Record<string, any>) => {
        await forbiddenUpdate(
          getGlobalUser(executor),
          target === 'root' ? getGlobalUser(target) : mock[target],
          status
        );
      }
    );

    test.each`
      executor    | target      | status
      ${'admin'}  | ${'admin'}  | ${HttpStatus.NOT_FOUND}
      ${'author'} | ${'author'} | ${HttpStatus.FORBIDDEN}
      ${'client'} | ${'client'} | ${HttpStatus.FORBIDDEN}
    `(
      '$executor cannot update other $target',
      async ({ executor, target, status }: Record<string, any>) => {
        await forbiddenUpdate(getGlobalUser(executor), mock[target], status);
      }
    );

    test('update user status', async () => {
      for (const status of [UserStatus.Blocked, UserStatus.Deleted]) {
        let response = await createUserAndLogin(root.token);
        const client: Schema$Authenticated = response.body;
        const cookie = extractCookies(response.header, REFRESH_TOKEN_COOKIES);

        expect(response.body).not.toHaveProperty('status', status);
        expect(cookie.value).toBeUUID();

        response = await updateUser(root.token, client.user.user_id, {
          status
        });
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toHaveProperty('status', status);

        response = await refreshToken(
          `${REFRESH_TOKEN_COOKIES}=${cookie.value}`
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
}
