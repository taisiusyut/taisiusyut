import { HttpStatus } from '@nestjs/common';
import { Schema$Book, Schema$Chapter, UserRole } from '@/typings';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { addBookToShelf } from '../../service/book-shelf';
import { createUserAndLogin, getUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';
import { createChapter, publicChapter } from '../../service/chapter';

export function testAddBookToShelf() {
  const length = 3;

  let books: Schema$Book[] = [];
  let chapters: Schema$Chapter[] = [];

  beforeAll(async () => {
    await setupUsers();

    books = await Promise.all(
      Array.from({ length }).map(() =>
        createBook(author.token).then(response => response.body)
      )
    );
    await publicBook(author.token, books[1].id);
    await publicBook(author.token, books[2].id);

    chapters = await Promise.all(
      books.map(book =>
        createChapter(author.token, book.id).then(response => response.body)
      )
    );

    chapters[2] = await publicChapter(
      author.token,
      books[2].id,
      chapters[2].id
    ).then(response => response.body);
  });

  test.each(['root', 'admin', 'author'])(
    `%s can add public/private book to shelf`,
    async user => {
      for (const [k, book] of Object.entries(books)) {
        const chapter = { ...chapters[Number(k)] };
        const response = await addBookToShelf(getUser(user).token, book.id);
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body.latestChapter).toMatchObject(chapter);
      }
    }
  );

  test(`client can add public book to shelf but not private`, async () => {
    let response = await addBookToShelf(client.token, books[0].id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await addBookToShelf(client.token, books[2].id);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.latestChapter).toMatchObject(chapters[2]);
  });

  test(`other author can add public book to shelf but not private`, async () => {
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    const otherAuthor = response.body;

    response = await addBookToShelf(otherAuthor.token, books[0].id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await addBookToShelf(otherAuthor.token, books[2].id);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.latestChapter).toMatchObject(chapters[2]);
  });

  test(`cannot add a book to shelf twice`, async () => {
    await app.get(BookShelfService).clear();

    for (const user of ['root', 'admin', 'author', 'client']) {
      let response = await addBookToShelf(getUser(user).token, books[2].id);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.latestChapter).toMatchObject(chapters[2]);

      response = await addBookToShelf(getUser(user).token, books[2].id);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });
}
