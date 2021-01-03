import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated, UserRole } from '@/typings';
import { setupUsers, getUser, createUserAndLogin } from '../../service/auth';
import { getUser as getUserAPI } from '../../service/user';

export function testGetUser() {
  beforeAll(async () => {
    await setupUsers();
  });

  test.each(['root', 'admin'])(`global %s can access user`, async user => {
    const auth = getUser(user);
    const response = await getUserAPI(auth.token, auth.user.user_id);
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

    response = await getUserAPI(admin.token, otherAdmin.user.user_id);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  test.each(['author', 'client', 'anonymous'])(
    `%s cannot access others user`,
    async user => {
      for (const target of ['root', 'admin', 'author', 'client']) {
        if (target !== user) {
          const response = await getUserAPI(
            getUser(user)?.token,
            getUser(target).user.user_id
          );
          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        }
      }
    }
  );
}
