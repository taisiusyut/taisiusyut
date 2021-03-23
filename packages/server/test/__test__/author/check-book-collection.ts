import { BookService } from '@/modules/book/book.service';
import { Schema$Authenticated, Schema$Book, UserRole } from '@/typings';
import {
  createUserAndLogin,
  getGlobalUser,
  setupUsers
} from '../../service/auth';
import { createBook, getBook, publishBook } from '../../service/book';
import { checkBookCollectionCount } from '../../service/author';
import { addBookToShelf } from '../../service/book-shelf';
import { HttpStatus } from '@nestjs/common';

export function testUpdateBookCollection() {
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;
  let clients: Schema$Authenticated[] = [];

  beforeAll(async () => {
    await setupUsers();
    const response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    localAuthor = response.body;
  });

  beforeEach(async () => {
    await app.get(BookService).clear();

    let response = await createBook(localAuthor.token);
    book = response.body;
    response = await publishBook(localAuthor.token, book.id);
    book = response.body;

    clients = [];

    for (let i = 0; i < 3; i++) {
      let response = await createUserAndLogin(root.token);
      const client = response.body;
      clients.push(client);
      response = await addBookToShelf(client.token, book.id);
      expect(response.status).toBe(HttpStatus.CREATED);
    }
  });

  test.each(['root', 'admin', 'author'])(
    `%s can update book collection count`,
    async user => {
      const [auth, authorId] =
        user === 'author'
          ? [localAuthor]
          : [getGlobalUser(user), localAuthor.user.user_id];
      let response = await getBook(auth.token, book.id);
      expect(response.body.numOfCollection).toBe(0);

      response = await checkBookCollectionCount(auth.token, authorId);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body[0].numOfCollection).toBe(clients.length);

      response = await getBook(auth.token, book.id);
      expect(response.body.numOfCollection).toBe(clients.length);
    }
  );

  test.each`
    user        | msg        | status
    ${'author'} | ${'other'} | ${HttpStatus.OK}
    ${'client'} | ${'the'}   | ${HttpStatus.FORBIDDEN}
  `(`$user cannot update $msg book collection`, async ({ user, status }) => {
    let response = await getBook(root.token, book.id);
    expect(response.body.numOfCollection).toBe(0);

    response = await checkBookCollectionCount(
      getGlobalUser(user).token,
      localAuthor.user.user_id
    );
    expect(response.status).toBe(status);

    response = await getBook(root.token, book.id);
    expect(response.body.numOfCollection).toBe(0);
  });
}
