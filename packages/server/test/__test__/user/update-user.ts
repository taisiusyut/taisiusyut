import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated, Schema$User, UserRole } from '@/typings';
import { rid } from '@/utils/rid';
import { createUser, createUserDto, updateUser } from '../../service/user';
import {
  createUserAndLogin,
  createUsers,
  getToken,
  getUser,
  login,
  setupRoot,
  setupUsers
} from '../../service/auth';

export function testUpdateUser() {
  let user: Schema$User;
  let token: string;
  const mockUserDto = createUserDto();
  const setupMockUser = async () => {
    if (user && token) {
      return [user, token] as const;
    }
    const response = await createUser(root.token, mockUserDto);
    user = response.body;
    token = await getToken(login(mockUserDto));

    return [user, token] as const;
  };

  beforeAll(async () => {
    await setupRoot();
  });

  beforeEach(async () => {
    await setupMockUser();
  });

  test('return updated value', async () => {
    const email = `${rid(8)}@gmail.com`;
    const response = await updateUser(token, user.id, { email });
    expect(response.error).toBeFalse();
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toHaveProperty('email', email);
  });

  test('author can update description', async () => {
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    expect(response.error).toBeFalse();

    const author: Schema$Authenticated = response.body;
    const description = rid(20);

    response = await updateUser(author.token, author.user.user_id, {
      description
    });

    expect(response.error).toBeFalse();
    expect(response.body).toMatchObject({ description });
  });

  test.each`
    property         | value            | suffix
    ${'role'}        | ${UserRole.Root} | ${''}
    ${'password'}    | ${rid(10)}       | ${''}
    ${'description'} | ${rid(20)}       | ${'(author only)'}
  `(
    '"$property" will not be update by client $suffix',
    async ({ property, value }: Record<string, any>) => {
      const response = await updateUser(token, user.id, { [property]: value });
      expect(response.error).toBeFalse();
      expect(response.body).not.toHaveProperty('password');
      if (property !== 'password') {
        expect(response.body).toHaveProperty(
          property,
          user[property as keyof Schema$User]
        );
      }
    }
  );

  test.each`
    executor    | target
    ${'root'}   | ${'admin'}
    ${'root'}   | ${'client'}
    ${'root'}   | ${'author'}
    ${'root'}   | ${'self'}
    ${'admin'}  | ${'author'}
    ${'admin'}  | ${'client'}
    ${'admin'}  | ${'self'}
    ${'author'} | ${'self'}
    ${'client'} | ${'self'}
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

  describe('Forbidden', () => {
    let mock: Record<string, Schema$Authenticated> = {};

    beforeAll(async () => {
      const [admin, author, client] = await createUsers();
      mock = { admin, author, client };
    });

    async function forbiddenUpdate(
      executor: Schema$Authenticated,
      target: Schema$Authenticated
    ) {
      const newEmal = `${rid(8)}@gmail.com`;
      const response = await updateUser(executor.token, target.user.user_id, {
        email: newEmal
      });
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }

    test.each`
      executor    | target
      ${'admin'}  | ${'root'}
      ${'author'} | ${'root'}
      ${'author'} | ${'admin'}
      ${'author'} | ${'client'}
      ${'client'} | ${'root'}
      ${'client'} | ${'admin'}
      ${'client'} | ${'author'}
    `(
      '$executor cannot update $target',
      async ({ executor, target }: Record<string, any>) => {
        await forbiddenUpdate(
          getUser(executor),
          target === 'root' ? getUser(target) : mock[target]
        );
      }
    );

    test.each`
      executor    | target
      ${'admin'}  | ${'admin'}
      ${'author'} | ${'author'}
      ${'client'} | ${'client'}
    `(
      '$executor cannot update other $target',
      async ({ executor, target }: Record<string, any>) => {
        await forbiddenUpdate(getUser(executor), mock[target]);
      }
    );
  });
}
