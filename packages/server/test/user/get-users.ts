import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@/typings';
import { getUsers } from '../service/user';
import { setupRoot, setupUsers } from '../service/auth';
import '../matchers';

export function testGetUsers() {
  beforeAll(async () => {
    await setupRoot();
    await setupUsers();
  });

  test('get users by root', async () => {
    const response = await getUsers(root.token);
    expect(response.error).toBeFalse();

    expect(response.body.data).toContainObject({ role: UserRole.Admin });
    expect(response.body.data).toContainObject({ role: UserRole.Author });
    expect(response.body.data).toContainObject({ role: UserRole.Client });
    expect(response.body.data).not.toContainObject({ role: UserRole.Root });
  });

  test('get users by admin', async () => {
    const response = await getUsers(admin.token);
    expect(response.error).toBeFalse();
    expect(response.body.data).toContainObject({ role: UserRole.Author });
    expect(response.body.data).toContainObject({ role: UserRole.Client });
    expect(response.body.data).not.toContainObject({ role: UserRole.Root });
    expect(response.body.data).not.toContainObject({ role: UserRole.Admin });

    // not include self
    expect(response.body.data).not.toContainObject([
      { username: admin.user.username, id: admin.user.user_id }
    ]);
  });

  test.each(['author', 'client'])('%s get users forbidden', async type => {
    const response = await getUsers(global[type].token);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });
}