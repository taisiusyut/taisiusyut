import { HttpStatus } from '@nestjs/common';
import {
  ChapterStatus,
  Schema$Authenticated,
  Schema$Book,
  Schema$Chapter,
  UserRole
} from '@/typings';
import { createBook, publicBook } from '../../service/book';
import { createUserAndLogin, setupUsers } from '../../service/auth';
import {
  getChapter,
  publicChapter,
  createChapter
} from '../../service/chapter';

export function testPublicChapter() {
  let book: Schema$Book;

  beforeAll(async () => {
    await setupUsers();
    let response = await createBook(author.token);
    book = response.body;
    response = await publicBook(author.token, book.id);
    book = response.body;
  });

  test('author can update chapter status to public', async () => {
    let response = await createChapter(author.token, book.id);
    const chapter: Schema$Chapter = response.body;
    expect(chapter).not.toHaveProperty('status', ChapterStatus.Public);

    // other author
    response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    const otherAutor: Schema$Authenticated = response.body;

    // other author cannot make chapter public
    response = await publicChapter(otherAutor.token, book.id, chapter.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.status).not.toBe(ChapterStatus.Public);

    // public chapter success
    response = await publicChapter(author.token, book.id, chapter.id);
    expect(response.body).toMatchObject({
      status: ChapterStatus.Public,
      hasNext: false,
      number: 1
    });

    response = await createChapter(author.token, book.id);
    const chapter2: Schema$Chapter = response.body;

    response = await publicChapter(author.token, book.id, chapter2.id);
    expect(response.body).toMatchObject({
      status: ChapterStatus.Public,
      hasNext: false,
      number: 2
    });

    response = await getChapter(client.token, book.id, chapter.id);
    expect(response.body).toMatchObject({
      status: ChapterStatus.Public,
      hasNext: true,
      number: 1
    });
  });

  test('client cannot update chapter status to public', async () => {
    let response = await createChapter(author.token, book.id);
    const chapter: Schema$Chapter = response.body;
    expect(chapter).not.toHaveProperty('status', ChapterStatus.Public);

    response = await publicChapter(client.token, book.id, chapter.id);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    expect(response.body.status).not.toBe(ChapterStatus.Public);
  });
}
