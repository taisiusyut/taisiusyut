import { HttpStatus } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { getUser, setupUsers } from '../../service/auth';
import { createBook, deleteBook, getBooks } from '../../service/book';

export function testDeleteBook() {
  beforeAll(async () => {
    await setupUsers();
  });

  beforeEach(() => app.get(BookService).clear());

  test.each`
    user        | expected    | status                  | length
    ${'root'}   | ${'can'}    | ${HttpStatus.OK}        | ${0}
    ${'admin'}  | ${'can'}    | ${HttpStatus.OK}        | ${0}
    ${'client'} | ${'cannot'} | ${HttpStatus.FORBIDDEN} | ${1}
    ${'author'} | ${'cannot'} | ${HttpStatus.FORBIDDEN} | ${1}
  `(
    `$user $expected delete book`,
    async ({ user, status, length }: Record<string, any>) => {
      let response = await createBook(author.token);
      const book = response.body;

      response = await getBooks(root.token);
      expect(response.body.data).toHaveLength(1);

      response = await deleteBook(getUser(user).token, book.id);

      expect(response.status).toBe(status);

      response = await getBooks(root.token);
      expect(response.body.data).toHaveLength(length);
    }
  );
}
