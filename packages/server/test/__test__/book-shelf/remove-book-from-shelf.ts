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
import { createBook, getBook, publishBook } from '../../service/book';

export function testRemoveBookFromShelf() {
  const length = 1;
  let book: Schema$Book;

  const users = ['root', 'admin', 'author', 'client'];

  beforeAll(async () => {
    await setupUsers();
  });

  beforeEach(async () => {
    await app.get(BookShelfService).clear();

    for (let i = 0; i < length; i++) {
      const response = await createBook(author.token);
      book = response.body;
      await publishBook(author.token, book.id);
      book = response.body;
    }

    for (const user of users) {
      const response = await addBookToShelf(getGlobalUser(user).token, book.id);
      expect(response.status).toBe(HttpStatus.CREATED);
    }

    const response = await getBook(root.token, book.id);
    book = response.body;
    expect(book.numOfCollection).toBe(users.length);
  });

  test.each(users)(`%s can remove book from shelf`, async user => {
    const auth = getGlobalUser(user);
    let response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(1);

    response = await removeBookFromShelf(auth.token, book.id);
    expect(response.status).toBe(HttpStatus.OK);

    book.numOfCollection--;
    response = await getBook(root.token, book.id);
    expect(response.body.numOfCollection).toBe(book.numOfCollection);

    response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(0);
  });

  test.each(users)(`%s can remove book from shelf by id`, async user => {
    const auth = getGlobalUser(user);
    let response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(1);

    response = await removeBookFromShelfById(auth.token, response.body[0].id);
    expect(response.status).toBe(HttpStatus.OK);

    // numOfCollection should not change
    response = await getBook(root.token, book.id);
    expect(response.body.numOfCollection).toBe(book.numOfCollection);

    response = await getBooksFromShelf(auth.token);
    expect(response.body).toHaveLength(0);
  });
}
