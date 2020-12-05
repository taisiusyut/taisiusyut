import { ObjectID } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { Schema$Book } from '@/typings';
import {
  addBookToShelf,
  getBooksFromShelf,
  updateBookInShelf
} from '../../service/book-shelf';
import { getUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';

export function testUpdateBookInShelf() {
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

    for (const user of ['root', 'admin', 'author', 'client']) {
      const response = await addBookToShelf(getUser(user).token, books[0].id);
      expect(response.status).toBe(HttpStatus.CREATED);
    }
  });

  test.each(users)(`%s can update book in shelf`, async user => {
    const response = await updateBookInShelf(getUser(user).token, books[0].id, {
      pin: true,
      lastVisit: 1
    });
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
          getUser(user).token,
          books[0].id,
          {
            [property]: value
          }
        );
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).not.toHaveProperty(property, value);

        response = await getBooksFromShelf(getUser(user).token);
        expect(response.body[0]).not.toHaveProperty(property, value);
      }
    }
  );
}
