import {
  BookStatus,
  Schema$Authenticated,
  Schema$Book,
  UserRole
} from '@/typings';
import { HttpStatus } from '@nestjs/common';
import { createUserAndLogin, getUser, setupUsers } from '../../service/auth';
import { createBook, getBook, updateBook } from '../../service/book';

export function testGetBook() {
  const books: Schema$Book[] = [];
  const bookStatus = [
    BookStatus.Public,
    BookStatus.Public,
    BookStatus.Private,
    BookStatus.Finished
  ];
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
        if (status !== BookStatus.Private) {
          response = await updateBook(root.token, book.id, { status });
          book = response.body;
        }
        books.push(book);
      })
    );
  });

  test.each(['root', 'admin', 'author', 'client'])(
    '%s access book correctly',
    async user => {
      for (const book of books) {
        const response = await getBook(getUser(user).token, book.id);
        const noPermission = user === 'author' || user === 'client';

        if (
          book.status === BookStatus.Public ||
          book.status === BookStatus.Finished
        ) {
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

  test(`author can access his/her non-public or non-finish book`, async () => {
    for (const book of books) {
      if (
        book.status !== BookStatus.Public &&
        book.status !== BookStatus.Finished
      ) {
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
