import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated } from '@/typings';
import { rid } from '@/utils/rid';
import { updateUser } from '../../service/user';
import {
  createUsers,
  getUser,
  setupRoot,
  setupUsers
} from '../../service/auth';

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
      const executeUser = getUser(executor);
      const targetUser = getUser(target);
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
      ${'admin'}  | ${'root'}   | ${HttpStatus.BAD_REQUEST}
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
          getUser(executor),
          target === 'root' ? getUser(target) : mock[target],
          status
        );
      }
    );

    test.each`
      executor    | target      | status
      ${'admin'}  | ${'admin'}  | ${HttpStatus.BAD_REQUEST}
      ${'author'} | ${'author'} | ${HttpStatus.FORBIDDEN}
      ${'client'} | ${'client'} | ${HttpStatus.FORBIDDEN}
    `(
      '$executor cannot update other $target',
      async ({ executor, target, status }: Record<string, any>) => {
        await forbiddenUpdate(getUser(executor), mock[target], status);
      }
    );
  });
}
