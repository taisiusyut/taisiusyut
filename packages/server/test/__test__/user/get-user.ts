import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated, UserRole } from '@/typings';
import { setupUsers, getUser, createUserAndLogin } from '../../service/auth';
import { getUserProfile } from '../../service/user';

export function testGetUser() {
  beforeAll(async () => {
    await setupUsers();
  });

  test.each(['root', 'admin'])(
    `global %s can access user profile`,
    async user => {
      const auth = getUser(user);
      const response = await getUserProfile(auth.token, auth.user.user_id);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: auth.user.user_id,
        role: auth.user.role,
        username: auth.user.username
      });
      expect(response.body).not.toHaveProperty('password');
    }
  );

  test(`admin cannot acces other admin profile`, async () => {
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Admin
    });
    const otherAdmin: Schema$Authenticated = response.body;

    expect(otherAdmin.user.role).toBe(UserRole.Admin);

    response = await getUserProfile(admin.token, otherAdmin.user.user_id);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  test.each(['author', 'client'])(
    `%s cannot access others profile`,
    async user => {
      for (const target of ['root', 'admin', 'author', 'client']) {
        if (target !== user) {
          const response = await getUserProfile(
            getUser(user).token,
            getUser(target).user.user_id
          );
          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        }
      }
    }
  );
}
