import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@/typings';
import { getGlobalUser, setupUsers } from '../../service/auth';
import { getAuthorByName } from '../../service/author';

export function testGetAuthor() {
  beforeAll(async () => {
    await setupUsers();
  });

  test('get author by name', async () => {
    const response = await getAuthorByName(author.user.nickname);
    expect(response.body).toEqual({
      role: UserRole.Author,
      nickname: expect.any(String),
      description: expect.any(String),
      createdAt: expect.anything(),
      updatedAt: expect.anything()
    });
    expect(response.body).not.toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
  });

  test('cannot get other user by name', async () => {
    for (const user of ['root', 'admin', 'client']) {
      const response = await getAuthorByName(
        getGlobalUser(user)?.user.nickname
      );
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    }
  });
}
