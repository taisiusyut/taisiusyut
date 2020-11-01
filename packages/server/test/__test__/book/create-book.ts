import { BookStatus } from '@/main';
import { rid } from '@/utils/rid';
import { HttpStatus } from '@nestjs/common';
import { setupUsers } from '../../service/auth';
import { createBook, createBookDto } from '../../service/book';

const tags = () => [rid(5), rid(5)].map(s => s.toLowerCase());

export function testCreateBook() {
  beforeAll(async () => {
    await setupUsers();
  });

  test('author create book success', async () => {
    const params = [
      createBookDto({}),
      createBookDto({ description: rid(10) }),
      createBookDto({ category: 'ohters' }),
      createBookDto({ tags: tags() }),
      createBookDto({
        description: rid(10),
        category: 'ohters',
        tags: tags()
      })
    ];

    for (const payload of params) {
      const response = await createBook(author.token, payload);
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        ...payload,
        status: BookStatus.Pending
      });
      expect(response.body.author).toEqual({
        nickname: author.user.nickname
      });
    }
  });

  test.each(['root', 'admin', 'client'])(
    `%s cannot create book`,
    async user => {
      const response = await createBook(global[user].token);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );
}
