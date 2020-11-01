import {
  BookStatus,
  Schema$Authenticated,
  Schema$Book,
  UserRole
} from '@/typings';
import { HttpStatus } from '@nestjs/common';
import { createUserAndLogin, setupUsers } from '../../service/auth';
import { createBook, getBook, updateBook } from '../../service/book';

export function testGetBook() {
  const books: Schema$Book[] = [];
  const bookStatus = [BookStatus.Public, BookStatus.Public, BookStatus.Pending];
  let mockAuthor: Schema$Authenticated;

  beforeAll(async () => {
    await setupUsers();
    const response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    mockAuthor = response.body;
    await Promise.all(
      bookStatus.map(async status => {
        let response = await createBook(mockAuthor.token);
        let book = response.body;
        if (status !== BookStatus.Pending) {
          response = await updateBook(root.token, book.id, { status });
          book = response.body;
        }
        books.push(book);
      })
    );
  });

  test.each(['root', 'admin', 'author', 'client'])(
    '%s get book correctly',
    async user => {
      for (const book of books) {
        const response = await getBook(global[user].token, book.id);
        const noPermission = user === 'author' || user === 'client';

        if (book.status === BookStatus.Public) {
          if (noPermission) {
            expect(response.body.author).not.toMatchObject({
              id: expect.anything(),
              email: expect.anything(),
              username: expect.anything(),
              password: expect.anything()
            });
          } else {
            expect(response.body.author).toMatchObject({
              id: expect.any(String),
              email: expect.any(String),
              username: expect.any(String)
            });
          }
        } else {
          expect(response.status).toBe(
            noPermission ? HttpStatus.NOT_FOUND : HttpStatus.OK
          );
        }
      }
    }
  );

  test(`author can get his/her non-public book`, async () => {
    for (const book of books) {
      if (book.status !== BookStatus.Public) {
        const response = await getBook(mockAuthor.token, book.id);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.author).not.toMatchObject({
          id: expect.anything(),
          email: expect.anything(),
          username: expect.anything(),
          password: expect.anything()
        });
      }
    }
  });
}
