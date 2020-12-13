import { HttpStatus } from '@nestjs/common';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { Schema$Book } from '@/typings';
import {
  addBookToShelf,
  getBooksFromShelf,
  mapToLatestChapter
} from '../../service/book-shelf';
import { getUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';
import { createChapter, publicChapter } from '../../service/chapter';

export function testLatestChapter() {
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

  test('latest chapter will be update after author public the chapter', async () => {
    const response = await createChapter(author.token, books[0].id);
    const chapter = response.body;
    expect(chapter).toHaveProperty('id', expect.any(String));

    await publicChapter(author.token, books[0].id, chapter.id);

    for (const user of users) {
      const response = await getBooksFromShelf(getUser(user).token);
      expect(response.body[0].latestChapter).toBeDefined();
      expect(response.body[0].latestChapter).toEqual(
        mapToLatestChapter(chapter)
      );
    }
  });
}
