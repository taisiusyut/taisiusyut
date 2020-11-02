import { ObjectId } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { BookStatus, Category } from '@/typings';
import { rid } from '@/utils/rid';
import { getUser, setupUsers } from '../../service/auth';
import { createBook, createBookDto } from '../../service/book';

const tags = () => [rid(5), rid(5)].map(s => s.toLowerCase());

export function testCreateBook() {
  beforeAll(async () => {
    await setupUsers();
  });

  test('author can create book', async () => {
    const params = [
      createBookDto({}),
      createBookDto({ description: rid(10) }),
      createBookDto({ category: Category['玄幻'] }),
      createBookDto({ tags: tags() }),
      createBookDto({
        description: rid(10),
        category: Category['仙俠'],
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
      const response = await createBook(getUser(user).token);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );

  test.each`
    property    | value
    ${'status'} | ${BookStatus.Public}
    ${'author'} | ${new ObjectId().toHexString()}
  `(
    '$property will not be update',
    async ({ property, value }: Record<string, string>) => {
      const response = await createBook(
        author.token,
        createBookDto({
          [property]: value
        })
      );
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).not.toHaveProperty(property, value);
    }
  );
}
