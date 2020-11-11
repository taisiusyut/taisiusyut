import { Schema$Book, Schema$Chapter } from '@/typings';
import { ChapterService } from '@/modules/chapter/chapter.service';
import { HttpStatus } from '@nestjs/common';
import {
  createChapter,
  getChapters,
  deleteChapter
} from '../../service/chapter';
import { getUser, setupUsers } from '../../service/auth';
import { createBook } from '../../service/book';

export function testDeleteChapter() {
  let book: Schema$Book;

  beforeAll(async () => {
    await setupUsers();
    const response = await createBook(author.token);
    book = response.body;
  });

  beforeEach(() => app.get(ChapterService).clear());

  test.each`
    user        | expected    | status                  | length
    ${'root'}   | ${'can'}    | ${HttpStatus.OK}        | ${0}
    ${'admin'}  | ${'can'}    | ${HttpStatus.OK}        | ${0}
    ${'client'} | ${'cannot'} | ${HttpStatus.FORBIDDEN} | ${1}
    ${'author'} | ${'cannot'} | ${HttpStatus.FORBIDDEN} | ${1}
  `(
    `$user $expected delete book`,
    async ({ user, status, length }: Record<string, any>) => {
      let response = await createChapter(author.token, book.id);
      const chapter: Schema$Chapter = response.body;

      response = await getChapters(root.token, book.id);
      expect(response.body.data).toHaveLength(1);

      response = await deleteChapter(getUser(user).token, book.id, chapter.id);

      expect(response.status).toBe(status);

      response = await getChapters(root.token, book.id);
      expect(response.body.data).toHaveLength(length);
    }
  );
}
