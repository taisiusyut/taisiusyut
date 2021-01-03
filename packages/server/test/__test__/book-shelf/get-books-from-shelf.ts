import { HttpStatus } from '@nestjs/common';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { Schema$Book } from '@/typings';
import { addBookToShelf, getBooksFromShelf } from '../../service/book-shelf';
import { getGlobalUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';

export function testGetBooksFromShelf() {
  const books: Schema$Book[] = [];
  const length = 3;
  const users = ['root', 'admin', 'author', 'client'];

  beforeAll(async () => {
    await setupUsers();

    for (let i = 0; i < length; i++) {
      const response = await createBook(author.token);
      const book = response.body;
      await publicBook(author.token, book.id);
      books.push(book);
    }

    await app.get(BookShelfService).clear();

    for (const user of users) {
      for (const book of books) {
        const response = await addBookToShelf(
          getGlobalUser(user).token,
          book.id
        );
        expect(response.status).toBe(HttpStatus.CREATED);
      }
    }
  });

  test.each(users)(`%s can get books from shelf`, async user => {
    const response = await getBooksFromShelf(getGlobalUser(user).token);
    expect(response.body).toHaveLength(length);
    expect(response.body).not.toContain({
      book: {
        tags: expect.anything(),
        description: expect.anything()
      }
    });
  });
}
