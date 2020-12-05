import { HttpStatus } from '@nestjs/common';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { Schema$Book } from '@/typings';
import {
  addBookToShelf,
  getBooksFromShelf,
  removeBookFromShelf
} from '../../service/book-shelf';
import { getUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';

export function testRemoveBookFromShelf() {
  let books: Schema$Book[] = [];

  const users = ['root', 'admin', 'author', 'client'];

  beforeAll(async () => {
    await setupUsers();
    books = await Promise.all(
      Array.from({ length: 1 }).map(async () => {
        const response = await createBook(author.token);
        const book = response.body;
        await publicBook(author.token, book.id);
        return book;
      })
    );

    await app.get(BookShelfService).clear();

    for (const user of users) {
      const response = await addBookToShelf(getUser(user).token, books[0].id);
      expect(response.status).toBe(HttpStatus.CREATED);
    }
  });

  test.each(users)(`%s can remove book from shelf`, async user => {
    let response = await getBooksFromShelf(getUser(user).token);
    expect(response.body).toHaveLength(1);

    response = await removeBookFromShelf(getUser(user).token, books[0].id);
    expect(response.status).toBe(HttpStatus.OK);

    response = await getBooksFromShelf(getUser(user).token);
    expect(response.body).toHaveLength(0);
  });
}
