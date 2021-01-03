import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated, UserRole } from '@/typings';
import {
  setupUsers,
  getGlobalUser,
  createUserAndLogin
} from '../../service/auth';
import { getUser } from '../../service/user';

export function testGetUser() {
  beforeAll(async () => {
    await setupUsers();
  });

  test.each(['root', 'admin'])(`global %s can access user`, async user => {
    const auth = getGlobalUser(user);
    const response = await getUser(auth.token, auth.user.user_id);
    expect(response.status).toBe(HttpStatus.OK);

    expect(response.body).toMatchObject({
      id: auth.user.user_id,
      role: auth.user.role,
      username: auth.user.username
    });
    expect(response.body).not.toHaveProperty('password');
  });

  test(`admin cannot acces other admin`, async () => {
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Admin
    });
    const otherAdmin: Schema$Authenticated = response.body;

    expect(otherAdmin.user.role).toBe(UserRole.Admin);

    response = await getUser(admin.token, otherAdmin.user.user_id);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  test.each(['author', 'client', 'anonymous'])(
    `%s cannot access others user`,
    async user => {
      for (const target of ['root', 'admin', 'author', 'client']) {
        if (target !== user) {
          const response = await getUser(
            getGlobalUser(user)?.token,
            getGlobalUser(target).user.user_id
          );
          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        }
      }
    }
  );
}
