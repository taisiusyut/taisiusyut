import { ObjectID } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { Schema$Book } from '@/typings';
import {
  addBookToShelf,
  getBooksFromShelf,
  updateBookInShelf
} from '../../service/book-shelf';
import { getGlobalUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';

export function testUpdateBookInShelf() {
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

    await app.get(BookShelfService).clear();

    for (const user of ['root', 'admin', 'author', 'client']) {
      const response = await addBookToShelf(
        getGlobalUser(user).token,
        books[0].id
      );
      expect(response.status).toBe(HttpStatus.CREATED);
    }
  });

  test.each(users)(`%s can update book in shelf`, async user => {
    const response = await updateBookInShelf(
      getGlobalUser(user).token,
      books[0].id,
      {
        pin: true,
        lastVisit: 1
      }
    );
    expect(response.status).toBe(HttpStatus.OK);
  });

  test.each`
    property           | value
    ${'user'}          | ${new ObjectID()}
    ${'book'}          | ${new ObjectID()}
    ${'latestChapter'} | ${new ObjectID()}
  `(
    `$property will not be update`,
    async ({ property, value }: Record<string, string>) => {
      for (const user of ['root', 'admin', 'author', 'client']) {
        let response = await updateBookInShelf(
          getGlobalUser(user).token,
          books[0].id,
          {
            [property]: value
          }
        );
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).not.toHaveProperty(property, value);

        response = await getBooksFromShelf(getGlobalUser(user).token);
        expect(response.body[0]).not.toHaveProperty(property, value);
      }
    }
  );
}
