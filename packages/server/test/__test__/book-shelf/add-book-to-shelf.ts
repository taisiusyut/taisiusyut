import { Schema$Book, UserRole } from '@/typings';
import { HttpStatus } from '@nestjs/common';
import { addBookToShelf } from '../../service/book-shelf';
import { createUserAndLogin, getUser, setupUsers } from '../../service/auth';
import { createBook, publicBook } from '../../service/book';

export function testAddBookToShelf() {
  let books: Schema$Book[] = [];

  beforeAll(async () => {
    await setupUsers();
    books = await Promise.all(
      Array.from({ length: 3 }).map(() =>
        createBook(author.token).then(response => response.body)
      )
    );
    await publicBook(author.token, books[1].id);
    await publicBook(author.token, books[2].id);
  });

  test.each(['root', 'admin', 'author'])(
    `%s can add public/private book to shelf`,
    async user => {
      for (const book of [books[0], books[1]]) {
        const response = await addBookToShelf(getUser(user).token, book.id);
        expect(response.status).toBe(HttpStatus.CREATED);
      }
    }
  );

  test(`client can add public book to shelf but not private`, async () => {
    let response = await addBookToShelf(client.token, books[0].id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await addBookToShelf(client.token, books[1].id);
    expect(response.status).toBe(HttpStatus.CREATED);
  });

  test(`other author can add public book to shelf but not private`, async () => {
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    const otherAuthor = response.body;

    response = await addBookToShelf(otherAuthor.token, books[0].id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await addBookToShelf(otherAuthor.token, books[1].id);
    expect(response.status).toBe(HttpStatus.CREATED);
  });

  test(`cannot add a book to shelf twice`, async () => {
    for (const user of ['root', 'admin', 'author', 'client']) {
      let response = await addBookToShelf(getUser(user).token, books[2].id);
      expect(response.status).toBe(HttpStatus.CREATED);

      response = await addBookToShelf(getUser(user).token, books[2].id);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });
}
