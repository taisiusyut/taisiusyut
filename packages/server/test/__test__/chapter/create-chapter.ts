import { HttpStatus } from '@nestjs/common';
import { ChapterStatus, Schema$Book } from '@/typings';
import { createBook } from '../../service/book';
import { setupUsers } from '../../service/auth';
import { createChapter, createChapterDto } from '../../service/chapter';

export function testCreateChapter() {
  let book: Schema$Book;

  beforeAll(async () => {
    await setupUsers();
    const response = await createBook(author.token);
    book = response.body;
  });

  test('author can create chapter', async () => {
    const params = [createChapterDto({})];

    for (const payload of params) {
      const response = await createChapter(author.token, book.id, payload);

      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).not.toHaveProperty('book');
      expect(response.body).toMatchObject({
        ...payload,
        status: ChapterStatus.Private
      });
    }
  });
}
