import { ObjectId } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { BookStatus, Schema$Book, UserRole } from '@/typings';
import { UpdateBookDto } from '@/modules/book/dto';
import { rid } from '@/utils/rid';
import {
  createUserAndLogin,
  getGlobalUser,
  setupUsers
} from '../../service/auth';
import {
  updateBook,
  createBookDto,
  createBook,
  getBook
} from '../../service/book';

const tags = () => [rid(5), rid(5)].map(s => s.toLowerCase());

export function testUpdateBook() {
  let book: Schema$Book;

  const updatePayload: UpdateBookDto[] = [
    { name: rid(10) },
    { description: rid(5) },
    { tags: tags() },
    createBookDto({
      description: rid(10),
      tags: tags()
    })
  ];

  beforeAll(async () => {
    await setupUsers();
    const response = await createBook(author.token);
    book = response.body;
  });

  test.each(['root', 'admin', 'author'])('%s can update book', async user => {
    for (const params of updatePayload) {
      const response = await updateBook(
        getGlobalUser(user).token,
        book.id,
        params
      );
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        ...params,
        status: BookStatus.Private
      });

      if (user === 'author') {
        expect(response.body).not.toHaveProperty('author');
      }
    }
  });

  test.each(['client'])('%s cannot update book', async user => {
    const response = await updateBook(
      getGlobalUser(user).token,
      book.id,
      createBookDto()
    );
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  test.each`
    property    | value
    ${'status'} | ${BookStatus.Public}
    ${'author'} | ${new ObjectId().toHexString()}
  `(
    '$property will not be update by author',
    async ({ property, value }: Record<string, string>) => {
      let response = await updateBook(author.token, book.id, {
        [property]: value
      });
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.OK);

      response = await getBook(root.token, book.id);
      expect(response.body).not.toHaveProperty(property, value);
    }
  );

  test.each(['root', 'admin'])('%s can update book status', async user => {
    const status = BookStatus.Public;
    let response = await createBook(author.token);
    const book = response.body;

    response = await updateBook(getGlobalUser(user).token, book.id, { status });
    expect(response.error).toBeFalse();
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('status', status);
  });

  test('book cannot update by other author', async () => {
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    const otherAuthor = response.body;

    response = await createBook(otherAuthor.token);
    const book = response.body;

    for (const params of updatePayload) {
      response = await updateBook(author.token, book.id, params);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    }
  });
}
