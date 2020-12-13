import { HttpStatus } from '@nestjs/common';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { Schema$Book } from '@/typings';
import { addBookToShelf, getBooksFromShelf } from '../../service/book-shelf';
import { getUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';

export function testGetBooksFromShelf() {
  let books: Schema$Book[] = [];
  const length = 3;
  const users = ['root', 'admin', 'author', 'client'];

  beforeAll(async () => {
    await setupUsers();
    books = await Promise.all(
      Array.from({ length }).map(async () => {
        const response = await createBook(author.token);
        const book = response.body;
        await publicBook(author.token, book.id);
        return book;
      })
    );

    await app.get(BookShelfService).clear();

    for (const user of users) {
      for (const book of books) {
        const response = await addBookToShelf(getUser(user).token, book.id);
        expect(response.status).toBe(HttpStatus.CREATED);
      }
    }
  });

  test.each(users)(`%s can get books from shelf`, async user => {
    const response = await getBooksFromShelf(getUser(user).token);
    expect(response.body).toHaveLength(length);
    expect(response.body).not.toContain({
      book: {
        tags: expect.anything(),
        description: expect.anything()
      }
    });
  });
}
