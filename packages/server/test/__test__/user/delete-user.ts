import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated, UserRole } from '@/typings';
import {
  login,
  setupRoot,
  setupUsers,
  createUserAndLogin,
  getGlobalUser
} from '../../service/auth';
import { createUserDto, deleteUser } from '../../service/user';

export function testDeleteUser() {
  beforeAll(async () => {
    await setupRoot();
    await setupUsers();
  });

  test.each`
    executor   | target
    ${'root'}  | ${'admin'}
    ${'root'}  | ${'client'}
    ${'root'}  | ${'author'}
    ${'admin'} | ${'author'}
    ${'admin'} | ${'client'}
  `(
    '$executor can delete $target',
    async ({ executor, target }: Record<string, string>) => {
      const executeUser: Schema$Authenticated = getGlobalUser(executor);

      // const self = target === 'self';
      const key = (target.slice(0, 1).toUpperCase() +
        target.slice(1)) as keyof typeof UserRole;

      const userDto = createUserDto({ role: UserRole[key] });
      let response = await createUserAndLogin(root.token, {
        role: UserRole[key]
      });
      const targetUser: Schema$Authenticated = response.body;
      expect(response.error).toBeFalse();

      response = await deleteUser(executeUser.token, targetUser.user.user_id);
      expect(response.error).toBeFalse();

      response = await login(userDto);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  );

  async function cannotDelete(
    executor: Schema$Authenticated,
    target: Schema$Authenticated,
    status: HttpStatus
  ) {
    const response = await deleteUser(executor.token, target.user.user_id);
    expect(response.status).toBe(status);
  }

  test.each`
    executor    | target      | status
    ${'root'}   | ${'self'}   | ${HttpStatus.BAD_REQUEST}
    ${'admin'}  | ${'root'}   | ${HttpStatus.FORBIDDEN}
    ${'admin'}  | ${'admin'}  | ${HttpStatus.FORBIDDEN}
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
      let targetUser =
        target === 'self' ? getGlobalUser(executor) : getGlobalUser(target);
      if (executor === 'admin' && target === 'admin') {
        const response = await createUserAndLogin(root.token, {
          role: UserRole.Admin
        });
        targetUser = response.body;
      }

      await cannotDelete(getGlobalUser(executor), targetUser, status);
    }
  );
}
