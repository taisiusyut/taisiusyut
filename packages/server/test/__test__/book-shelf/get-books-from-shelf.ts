import { HttpStatus } from '@nestjs/common';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { BookStatus, Schema$Book } from '@/typings';
import { addBookToShelf, getBooksFromShelf } from '../../service/book-shelf';
import { getGlobalUser, setupUsers } from '../../service/auth';
import { createBook, publishBook, updateBook } from '../../service/book';
import { bookSelect } from '@/modules/book-shelf/schemas';

export function testGetBooksFromShelf() {
  const books: Schema$Book[] = [];
  const length = 3;
  const users = ['root', 'admin', 'author', 'client'];

  beforeAll(async () => {
    await setupUsers();

    for (let i = 0; i < length; i++) {
      const response = await createBook(author.token);
      const book = response.body;
      await publishBook(author.token, book.id);
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
    const auth = getGlobalUser(user);
    const response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(length);
    expect(response.body[0].book).toEqual(
      Object.keys(bookSelect).reduce(
        (result, k) => ({ ...result, [k]: expect.anything() }),
        {} as Record<keyof typeof bookSelect, any>
      )
    );

    expect(response.body).not.toContainObject({
      author: expect.anything()
    });
  });

  test(`deleted book in shelf will not be null`, async () => {
    const response = await updateBook(root.token, books[0].id, {
      status: BookStatus.Deleted
    });
    books[0] = response.body;
    expect(books[0]).toHaveProperty('status', BookStatus.Deleted);

    for (const user of users) {
      const auth = getGlobalUser(user);
      const response = await getBooksFromShelf(auth.token);
      expect(response.body).toHaveLength(length);
      expect(response.body).toContainObject({
        book: null
      });
    }
  });
}
