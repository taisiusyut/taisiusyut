import { HttpStatus } from '@nestjs/common';
import { BookStatus, Schema$Book, Schema$Chapter, UserRole } from '@/typings';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { addBookToShelf } from '../../service/book-shelf';
import {
  createUserAndLogin,
  getGlobalUser,
  setupUsers
} from '../../service/auth';
import {
  createBook,
  updateBook,
  publishBook,
  getBook
} from '../../service/book';
import { createChapter, publishChapter } from '../../service/chapter';

export function testAddBookToShelf() {
  const length = 4;
  let books: Schema$Book[] = [];
  let chapters: Schema$Chapter[] = [];

  beforeAll(async () => {
    await setupUsers();
  });

  beforeEach(async () => {
    books = [];
    chapters = [];

    await app.get(BookShelfService).clear();

    for (let i = 0; i < length; i++) {
      const response = await createBook(author.token);
      books.push(response.body);
    }
    let response = await publishBook(author.token, books[1].id);
    books[1] = response.body;
    response = await publishBook(author.token, books[2].id);
    books[2] = response.body;

    for (const book of books) {
      const response = await createChapter(author.token, book.id);
      chapters.push(response.body);
    }

    chapters[2] = await publishChapter(
      author.token,
      books[2].id,
      chapters[2].id
    ).then(response => response.body);

    response = await updateBook(root.token, books[3].id, {
      status: BookStatus.Deleted
    });
    books[3] = response.body;
  });

  test.each(['root', 'admin', 'author'])(
    `%s can add public/private book to shelf`,
    async user => {
      for (const [, book] of Object.entries(books)) {
        if (
          book.status === BookStatus.Public ||
          book.status === BookStatus.Private
        ) {
          let response = await addBookToShelf(
            getGlobalUser(user).token,
            book.id
          );
          expect(response.status).toBe(HttpStatus.CREATED);

          response = await getBook(root.token, book.id);
          expect(response.body.numOfCollection).toBe(book.numOfCollection + 1);
          book.numOfCollection + 1;
        }
      }
    }
  );

  test(`client can add public book to shelf but not private`, async () => {
    let book = books[0];
    let response = await addBookToShelf(client.token, book.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await getBook(root.token, book.id);
    expect(response.body.numOfCollection).toBe(book.numOfCollection);

    book = books[2];

    response = await addBookToShelf(client.token, book.id);
    expect(response.status).toBe(HttpStatus.CREATED);

    book.numOfCollection++;
    response = await getBook(root.token, book.id);
    expect(response.body.numOfCollection).toBe(book.numOfCollection);
  });

  test(`other author can add public book to shelf but not private`, async () => {
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    const otherAuthor = response.body;
    let book = books[0];

    response = await addBookToShelf(otherAuthor.token, book.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await getBook(root.token, book.id);
    expect(response.body.numOfCollection).toBe(book.numOfCollection);

    book = books[2];

    response = await addBookToShelf(otherAuthor.token, book.id);
    expect(response.status).toBe(HttpStatus.CREATED);

    book.numOfCollection++;
    response = await getBook(root.token, book.id);
    expect(response.body.numOfCollection).toBe(book.numOfCollection);
  });

  test(`cannot add a book to shelf twice`, async () => {
    const book = books[2];
    for (const user of ['root', 'admin', 'author', 'client']) {
      let response = await addBookToShelf(getGlobalUser(user).token, book.id);
      expect(response.status).toBe(HttpStatus.CREATED);

      book.numOfCollection++;
      response = await getBook(root.token, book.id);
      expect(response.body.numOfCollection).toBe(book.numOfCollection);

      response = await addBookToShelf(getGlobalUser(user).token, book.id);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      response = await getBook(root.token, book.id);
      expect(response.body.numOfCollection).toBe(book.numOfCollection);
    }
  });

  test(`cannot add deleted book to shelf`, async () => {
    const book = books[3];
    const response = await getBook(root.token, book.id);
    expect(response.body).toHaveProperty('status', BookStatus.Deleted);

    for (const user of ['root', 'admin', 'author', 'client']) {
      const auth = getGlobalUser(user);
      let response = await addBookToShelf(auth.token, book.id);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      response = await getBook(root.token, book.id);
      expect(response.body.numOfCollection).toBe(book.numOfCollection);
    }
  });
}
