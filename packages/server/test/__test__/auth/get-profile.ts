import { HttpStatus } from '@nestjs/common';
import { setupUsers, getUser } from '../../service/auth';
import { getUserProfile } from '../../service/user';

const users = ['root', 'admin', 'author', 'client'];

export function testGetProfile() {
  beforeAll(async () => {
    await setupUsers();
  });

  test.each(users)(`%s can access his/her profile`, async user => {
    const auth = getUser(user);
    const response = await getUserProfile(auth.token, auth.user.user_id);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({
      id: auth.user.user_id,
      role: auth.user.role,
      username: auth.user.username
    });
    expect(response.body).not.toHaveProperty('password');
  });
}
