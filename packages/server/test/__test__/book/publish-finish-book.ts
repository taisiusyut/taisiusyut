import {
  BookStatus,
  Schema$Authenticated,
  Schema$Book,
  UserRole
} from '@/typings';
import { createBook, finishBook, publishBook } from '../../service/book';
import { createUserAndLogin, setupUsers } from '../../service/auth';
import { HttpStatus } from '@nestjs/common';

export function testPublishAndFinishBook() {
  beforeAll(async () => {
    await setupUsers();
  });

  test('author can update book status to publish/finish', async () => {
    let response = await createBook(author.token);
    const book: Schema$Book = response.body;
    expect(book).toHaveProperty('status', BookStatus.Private);

    // cannnot make non-public book finish
    response = await finishBook(author.token, book.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.status).not.toBe(BookStatus.Finished);

    // other author
    response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    const otherAutor: Schema$Authenticated = response.body;

    // other author cannot make book public
    response = await publishBook(otherAutor.token, book.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.status).not.toBe(BookStatus.Public);

    // publish book success
    response = await publishBook(author.token, book.id);
    expect(response.body).toHaveProperty('status', BookStatus.Public);

    // other author cannot make  book fibnish
    response = await finishBook(otherAutor.token, book.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.status).not.toBe(BookStatus.Finished);

    // finish book success
    response = await finishBook(author.token, book.id);
    expect(response.body).toHaveProperty('status', BookStatus.Finished);
  });
}
