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
import {
  calcBookWordCount,
  createBook,
  getBook,
  publishBook
} from '../../service/book';

export function testWordCount() {
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;
  let chapters: Schema$Chapter[] = [];

  const publicChapters = async () => {
    if (chapters.every(c => c.status === ChapterStatus.Public)) return;
    for (let i = 0; i < chapters.length; i++) {
      const response = await publishChapter(
        localAuthor.token,
        book.id,
        chapters[i].id
      );
      expect(response.body.status).toBe(ChapterStatus.Public);
      expect(response.body.wordCount).toBe(chapters[i].wordCount);
      chapters[i] = response.body;
    }
  };

  const getTotalWordCount = (payload: { wordCount: number }[]) =>
    payload.reduce((count, c) => count + c.wordCount, 0);

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
    expect(book.wordCount).toBe(0);

    chapters = [];

    for (let i = 0; i < 3; i++) {
      const response = await createChapter(localAuthor.token, book.id);
      expect(response.body.wordCount).toBeGreaterThan(0);
      chapters.push(response.body);
    }
    await publicChapters();
  });

  test(`book word count will be update after chapter publish`, async () => {
    const response = await getBook(root.token, book.id);
    expect(response.body.wordCount).toBe(getTotalWordCount(chapters));
  });

  test.each`
    user        | msg                                     | status
    ${'author'} | ${'author cannot update other author '} | ${HttpStatus.BAD_REQUEST}
    ${'client'} | ${'client cannot update'}               | ${HttpStatus.FORBIDDEN}
  `(`$msg book's word count`, async ({ user, status }) => {
    const count = getTotalWordCount(chapters);
    let response = await updateChapter(
      localAuthor.token,
      book.id,
      chapters[0].id,
      { content: rid(count) }
    );
    expect(response.body.wordCount).toBe(count);
    chapters[0] = response.body;

    response = await calcBookWordCount(getGlobalUser(user).token, book.id);
    expect(response.status).toBe(status);

    response = await calcBookWordCount(localAuthor.token, book.id);
    expect(response.body.wordCount).toBe(getTotalWordCount(chapters));
  });

  test.each(['root', 'admin', 'author'])(
    "%s can update book's word count",
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

      response = await calcBookWordCount(auth.token, book.id);
      expect(response.body.wordCount).toBe(getTotalWordCount(chapters));
    }
  );
}
