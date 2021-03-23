import { HttpStatus } from '@nestjs/common';
import {
  ChapterStatus,
  Schema$Authenticated,
  Schema$Book,
  Schema$Chapter,
  UserRole
} from '@/typings';
import { createBook, publishBook } from '../../service/book';
import { createUserAndLogin, setupUsers } from '../../service/auth';
import {
  getChapter,
  publishChapter,
  createChapter
} from '../../service/chapter';

export function testPublishChapter() {
  let book: Schema$Book;

  beforeAll(async () => {
    await setupUsers();
    let response = await createBook(author.token);
    book = response.body;
    response = await publishBook(author.token, book.id);
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
    response = await publishChapter(otherAutor.token, book.id, chapter.id);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.status).not.toBe(ChapterStatus.Public);

    // publish chapter success
    response = await publishChapter(author.token, book.id, chapter.id);
    expect(response.body).toMatchObject({
      status: ChapterStatus.Public,
      hasNext: false,
      number: 1
    });

    response = await createChapter(author.token, book.id);
    const chapter2: Schema$Chapter = response.body;

    response = await publishChapter(author.token, book.id, chapter2.id);
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

    response = await publishChapter(client.token, book.id, chapter.id);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    expect(response.body.status).not.toBe(ChapterStatus.Public);
  });
}
