import { HttpStatus } from '@nestjs/common';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { Schema$Book } from '@/typings';
import {
  addBookToShelf,
  getBooksFromShelf,
  removeBookFromShelf,
  removeBookFromShelfById
} from '../../service/book-shelf';
import { getGlobalUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';

export function testRemoveBookFromShelf() {
  const length = 1;
  const books: Schema$Book[] = [];

  const users = ['root', 'admin', 'author', 'client'];

  beforeAll(async () => {
    await setupUsers();

    for (let i = 0; i < length; i++) {
      const response = await createBook(author.token);
      const book = response.body;
      await publicBook(author.token, book.id);
      books.push(book);
    }
  });

  beforeEach(async () => {
    await app.get(BookShelfService).clear();

    for (const user of users) {
      const response = await addBookToShelf(
        getGlobalUser(user).token,
        books[0].id
      );
      expect(response.status).toBe(HttpStatus.CREATED);
    }
  });

  test.each(users)(`%s can remove book from shelf`, async user => {
    const auth = getGlobalUser(user);
    let response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(1);

    response = await removeBookFromShelf(auth.token, books[0].id);
    expect(response.status).toBe(HttpStatus.OK);

    response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(0);
  });

  test.each(users)(`%s can remove book from shelf by id`, async user => {
    const auth = getGlobalUser(user);
    let response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(1);

    response = await removeBookFromShelfById(auth.token, response.body[0].id);
    expect(response.status).toBe(HttpStatus.OK);

    response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(0);
  });
}
