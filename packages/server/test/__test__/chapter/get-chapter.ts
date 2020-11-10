import {
  Schema$Authenticated,
  Schema$Chapter,
  UserRole,
  ChapterStatus,
  Schema$Book,
  ChapterType
} from '@/typings';
import { HttpStatus } from '@nestjs/common';
import { createUserAndLogin, setupUsers, getUser } from '../../service/auth';
import { createBook } from '../../service/book';
import {
  createChapter,
  getChapter,
  updateChapter
} from '../../service/chapter';

export function testGetChapter() {
  const chapterStatus = Object.values(ChapterStatus)
    .filter((v): v is ChapterStatus => typeof v === 'number')
    .map(status => ({ status }));

  const chapterType = Object.values(ChapterType)
    .filter((v): v is ChapterType => typeof v === 'number')
    .map(type => ({ type }));

  const chapters: Schema$Chapter[] = [];
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;

  beforeAll(async () => {
    await setupUsers();
    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    localAuthor = response.body;

    response = await createBook(localAuthor.token);
    book = response.body;

    for (const params of [...chapterStatus, ...chapterType]) {
      let response = await createChapter(localAuthor.token, book.id);
      let chapter = response.body;
      response = await updateChapter(root.token, book.id, chapter.id, params);
      chapter = response.body;
      chapters.push(chapter);
    }
  });

  test.each(['root', 'admin'])(
    `global %s can access all chapter status/type`,
    async user => {
      for (const chapter of chapters) {
        const response = await getChapter(
          getUser(user).token,
          book.id,
          chapter.id
        );
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toMatchObject(chapter);
      }
    }
  );

  test.each(['author', 'client'])(
    `global %s can access "Public" and "Free" chapter only`,
    async user => {
      for (const chapter of chapters) {
        const response = await getChapter(
          getUser(user).token,
          book.id,
          chapter.id
        );

        if (
          chapter.status === ChapterStatus.Public &&
          chapter.type === ChapterType.Free
        ) {
          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toMatchObject({
            name: expect.any(String),
            content: expect.any(String)
          });
        } else {
          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        }
      }
    }
  );

  test(`author can access his/her non-public and pay chapter`, async () => {
    for (const chapter of chapters) {
      const response = await getChapter(localAuthor.token, book.id, chapter.id);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        name: expect.any(String),
        content: expect.any(String),
        status: expect.any(Number)
      });
    }
  });
}
