import { UpdateChapterDto } from '@/modules/chapter/dto';
import {
  Schema$Authenticated,
  Schema$Chapter,
  UserRole,
  ChapterStatus,
  Schema$Book,
  ChapterType
} from '@/typings';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'supertest';
import { createUserAndLogin, setupUsers, getUser } from '../../service/auth';
import { createBook } from '../../service/book';
import {
  createChapter,
  updateChapter,
  getChapter,
  getChapterByNo
} from '../../service/chapter';

type GetChapter = (
  token: string,
  bookID: string,
  chapter: Schema$Chapter
) => Promise<Response>;

function createGetBookTest(getChapter: GetChapter) {
  return function testGetChapter() {
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

      for (let params of [
        ...chapterStatus,
        ...chapterType
      ] as UpdateChapterDto[]) {
        let response = await createChapter(localAuthor.token, book.id);
        let chapter = response.body;

        if (params.type === ChapterType.Pay) {
          params = { ...params, price: 1 };
        }

        response = await updateChapter(root.token, book.id, chapter.id, params);

        expect(response.status).toBe(HttpStatus.OK);

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
            chapter
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
            chapter
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
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
          }
        }
      }
    );

    test(`author can access his/her non-public and pay chapter`, async () => {
      for (const chapter of chapters) {
        const response = await getChapter(localAuthor.token, book.id, chapter);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toMatchObject({
          name: expect.any(String),
          content: expect.any(String),
          status: expect.any(Number)
        });
      }
    });
  };
}

export const testGetChapter = createGetBookTest((token, bookID, chapter) =>
  getChapter(token, bookID, chapter.id)
);

export const testGetChapterByNo = createGetBookTest((token, bookID, chapter) =>
  getChapterByNo(token, bookID, chapter.number)
);
