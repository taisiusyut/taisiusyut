import { HttpStatus } from '@nestjs/common';
import { createUser, createUserDto } from './service/user';
import { UserRole } from '@/main';

describe('UserController (e2e)', () => {
  describe('(POST) Create User', () => {
    it.each([
      ['admin', { role: UserRole.Admin }],
      ['author', { role: UserRole.Author }],
      ['client', { role: UserRole.Client }]
    ])('Create %s success', async (type, params) => {
      const mockUser = createUserDto({ ...params, description: 'description' });
      const { password, description, ...match } = mockUser;
      const response = await createUser('', mockUser);
      const user = response.body;

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

    it('These properties are unique', async () => {
      const mockUser = createUserDto();
      await createUser('', mockUser);
      const responses = await Promise.all([
        createUser('', mockUser),
        createUser('', { username: mockUser.username }),
        createUser('', { email: mockUser.email })
      ]);
      expect(responses).toSatisfyAll(
        res => res.status === HttpStatus.BAD_REQUEST
      );
    });
  });
});
