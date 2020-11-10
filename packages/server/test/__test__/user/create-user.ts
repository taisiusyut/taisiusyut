import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@/typings';
import { createUser, createUserDto } from '../../service/user';
import { setupRoot, setupUsers } from '../../service/auth';

export function testCreateUser() {
  beforeAll(async () => {
    await setupRoot();
  });

  test.each([
    ['admin', { role: UserRole.Admin }],
    ['author', { role: UserRole.Author }],
    ['client', { role: UserRole.Client }]
  ])('Create %s success', async (type, params) => {
    const mockUser = createUserDto({ ...params, description: 'description' });
    const { password, description, ...match } = mockUser;
    const response = await createUser(root.token, mockUser);
    const user = response.body;

    expect(response.error).toBeFalse();
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(user).not.toHaveProperty('password');

    switch (type) {
      case 'admin':
      case 'client':
        expect(user).toMatchObject(match);
        expect(user).not.toHaveProperty('description');
        break;
      case 'author':
        expect(user).toMatchObject({ ...match, description });
        break;
    }
  });

  test('These properties are unique', async () => {
    const mockUser = createUserDto();
    await createUser(root.token, mockUser);

    const responses = await Promise.all([
      createUser(root.token, mockUser),
      createUser(root.token, { username: mockUser.username }),
      createUser(root.token, { email: mockUser.email })
    ]);
    expect(responses).toSatisfyAll(
      res => res.status === HttpStatus.BAD_REQUEST
    );
  });

  describe('Forbidden', () => {
    beforeAll(async () => {
      await setupUsers();
    });

    function getTest(createdBy: 'admin' | 'author' | 'client') {
      return async function test(role: string) {
        const user = global[createdBy];
        const target = UserRole[role as keyof typeof UserRole];
        await expect(
          createUser(user.token, { role: target })
        ).resolves.toMatchObject({
          status: HttpStatus.FORBIDDEN
        });
      };
    }

    test.each(['Root', 'Admin'])('Create %s by admin', getTest('admin'));

    test.each(['Root', 'Admin ', 'Author'])(
      'Create %s by author',
      getTest('author')
    );

    test.each(['Root', 'Admin', 'Author'])(
      'Create %s by client',
      getTest('client')
    );
  });
}
