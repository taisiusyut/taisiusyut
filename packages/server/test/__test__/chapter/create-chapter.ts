import { ObjectId } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { BookStatus, ChapterStatus, ChapterType, Schema$Book } from '@/typings';
import { createBook, updateBook } from '../../service/book';
import { getUser, setupUsers } from '../../service/auth';
import {
  createChapter,
  createChapterDto,
  getChapter
} from '../../service/chapter';

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
      expect(response.body).not.toHaveProperty('bookID');
      expect(response.body).not.toHaveProperty('author');
      expect(response.body).toMatchObject({
        ...payload,
        status: ChapterStatus.Private
      });
    }
  });

  test('chapter cannot create with unknown bookID', async () => {
    const ids = ['123', new ObjectId().toHexString(), null];
    for (const id of ids) {
      const response = await createChapter(
        author.token,
        String(id),
        createChapterDto()
      );
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  test.each(['root', 'admin', 'client'])(
    `%s cannot create chapter`,
    async user => {
      const response = await createChapter(getUser(user).token, book.id);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );

  test.each`
    property    | value
    ${'status'} | ${BookStatus.Public}
    ${'book'}   | ${new ObjectId().toHexString()}
    ${'bookID'} | ${new ObjectId().toHexString()}
    ${'author'} | ${new ObjectId().toHexString()}
  `(
    '$property will not exist after the chapter created',
    async ({ property, value }: Record<string, string>) => {
      const dto = createChapterDto({
        [property]: value
      });
      let response = await createChapter(author.token, book.id, dto);
      expect(dto).toHaveProperty(property, value);
      expect(response.status).toBe(HttpStatus.CREATED);

      const chapter = response.body;
      response = await getChapter(root.token, book.id, chapter.id);
      expect(response.body).not.toHaveProperty(property, value);
    }
  );

  test('finished book cannot create pay chapter', async () => {
    let response = await createBook(author.token);
    let book = response.body;
    response = await updateBook(root.token, book.id, {
      status: BookStatus.Finished
    });
    book = response.body;
    expect(book.status).toBe(BookStatus.Finished);

    response = await createChapter(author.token, book.id, {
      type: ChapterType.Pay
    });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
}
