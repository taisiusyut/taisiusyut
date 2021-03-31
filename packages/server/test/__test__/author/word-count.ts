import { HttpStatus } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import {
  BookStatus,
  ChapterStatus,
  Schema$Authenticated,
  Schema$Book,
  Schema$Chapter,
  UserRole
} from '@/typings';
import { rid } from '@/utils/rid';
import {
  createChapter,
  publishChapter,
  updateChapter
} from '../../service/chapter';
import {
  createUserAndLogin,
  getGlobalUser,
  setupUsers
} from '../../service/auth';
import { createBook, publishBook } from '../../service/book';
import { calcAuthorWordCount } from '../../service/author';
import { getUser } from '../../service/user';

export function testAuthorWordCount() {
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;
  let chapters: Schema$Chapter[] = [];

  const getTotalWordCount = (payload: { wordCount: number }[]) =>
    payload.reduce((count, c) => count + c.wordCount, 0);

  beforeAll(async () => {
    await setupUsers();
  });

  beforeEach(async () => {
    await app.get(BookService).clear();

    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    localAuthor = response.body;

    response = await createBook(localAuthor.token);
    book = response.body;
    response = await publishBook(localAuthor.token, book.id);
    book = response.body;
    expect(book.wordCount).toBe(0);

    chapters = [];

    for (let i = 0; i < 3; i++) {
      let response = await createChapter(localAuthor.token, book.id);
      const chapter = response.body;
      expect(chapter.wordCount).toBeGreaterThan(0);

      response = await publishChapter(localAuthor.token, book.id, chapter.id);
      expect(response.body.status).toBe(ChapterStatus.Public);

      chapters.push(response.body);
    }
  });

  test('author word count will be update after chapter publish', async () => {
    const response = await getUser(root.token, localAuthor.user.user_id);
    expect(response.body.wordCount).toBe(getTotalWordCount(chapters));
  });

  test.each`
    user        | msg                             | status
    ${'author'} | ${'author cannot update other'} | ${HttpStatus.BAD_REQUEST}
    ${'client'} | ${'client cannot update'}       | ${HttpStatus.FORBIDDEN}
  `(`$msg author word count`, async ({ user, status }) => {
    const count = getTotalWordCount(chapters);
    expect(chapters[0].status).toBe(BookStatus.Public);

    let response = await updateChapter(
      localAuthor.token,
      book.id,
      chapters[0].id,
      { content: rid(count) }
    );
    expect(response.body.wordCount).toBe(count);
    chapters[0] = response.body;

    response = await calcAuthorWordCount(getGlobalUser(user).token);
    expect(response.status).toBe(status);

    response = await calcAuthorWordCount(localAuthor.token);
    expect(response.body.wordCount).toBe(count);
  });

  test.each(['root', 'admin', 'author'])(
    "%s can update author's word count",
    async user => {
      const auth = user === 'author' ? localAuthor : getGlobalUser(user);

      const count = getTotalWordCount(chapters);
      expect(chapters[0].status).toBe(BookStatus.Public);

      let response = await updateChapter(
        localAuthor.token,
        book.id,
        chapters[0].id,
        { content: rid(count) }
      );
      expect(response.body.wordCount).toBe(count);
      chapters[0] = response.body;

      response = await calcAuthorWordCount(
        auth.token,
        user === 'author' ? undefined : localAuthor.user.user_id
      );
      expect(response.body.wordCount).toBe(count);
    }
  );
}
