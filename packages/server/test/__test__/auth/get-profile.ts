import { HttpStatus } from '@nestjs/common';
import { setupUsers, getGlobalUser, setupRoot } from '../../service/auth';
import { getUserProfile } from '../../service/auth';

export function testGetProfile() {
  beforeAll(async () => {
    await setupRoot();
    await setupUsers();
  });

  test.each(['root', 'admin', 'author', 'client'])(
    `%s can access profile`,
    async user => {
      const auth = getGlobalUser(user);
      expect(auth).toBeDefined();

      const response = await getUserProfile(auth.token);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: auth.user.user_id,
        role: auth.user.role,
        username: auth.user.username
      });
      expect(response.body).not.toHaveProperty('password');
    }
  );
}
