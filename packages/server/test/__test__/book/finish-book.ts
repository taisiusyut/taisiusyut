import { BookStatus, Schema$Book, UserRole } from '@/typings';
import { createBook, finishBook, updateBook } from '../../service/book';
import { createUserAndLogin, getUser, setupUsers } from '../../service/auth';
import { HttpStatus } from '@nestjs/common';

export function testFinishBook() {
  beforeAll(async () => {
    await setupUsers();
  });

  test.each(['root', 'admin'])(
    '%s can update book status to finish',
    async user => {
      let response = await createBook(author.token);
      const book: Schema$Book = response.body;

      expect(book).not.toHaveProperty('status', BookStatus.Finished);

      response = await updateBook(getUser(user).token, book.id, {
        status: BookStatus.Finished
      });
      expect(response.body).toHaveProperty('status', BookStatus.Finished);
    }
  );

  test('author can update public book status to finish', async () => {
    let response = await createBook(author.token);
    const book: Schema$Book = response.body;
    expect(book).not.toHaveProperty('status', BookStatus.Finished);

    // cannnot make non-public book finish
    response = await finishBook(author.token, book.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.status).not.toBe(BookStatus.Finished);

    // make book public
    response = await updateBook(root.token, book.id, {
      status: BookStatus.Public
    });

    // other author cannot make  book finish
    response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    response = await finishBook(response.body.token, book.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.status).not.toBe(BookStatus.Finished);

    // success
    response = await finishBook(author.token, book.id);
    expect(response.body).toHaveProperty('status', BookStatus.Finished);
  });
}
