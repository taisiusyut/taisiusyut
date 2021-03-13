import { HttpStatus } from '@nestjs/common';
import { Schema$Authenticated } from '@/typings';
import { authorRequest } from '../../service/user';
import { createUsers } from '../../service/auth';

export function testAuthorRequest() {
  let mock: Record<string, Schema$Authenticated> = {};

  beforeAll(async () => {
    const [admin, author, client] = await createUsers();
    mock = { admin, author, client };
  });

  test('client request as author success', async () => {
    const response = await authorRequest(mock.client.token);
    expect(response.status).toBe(HttpStatus.OK);
  });

  test.each(['root', 'admin', 'author', 'anonymous'])(
    '%s cannot request as author success',
    async user => {
      const response = await authorRequest(mock[user]?.token);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );
}
