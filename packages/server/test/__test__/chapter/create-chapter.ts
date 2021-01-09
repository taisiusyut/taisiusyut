import { ObjectId } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { BookStatus, ChapterStatus, ChapterType, Schema$Book } from '@/typings';
import { calcWordCount } from '@/utils/caclWordCount';
import { createBook, updateBook } from '../../service/book';
import { getGlobalUser, setupUsers } from '../../service/auth';
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

    for (const [idx, payload] of Object.entries(params)) {
      const response = await createChapter(author.token, book.id, payload);
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).not.toMatchObject({
        book: expect.anything(),
        bookID: expect.anything(),
        author: expect.anything()
      });
      expect(response.body).toEqual({
        ...payload,
        id: expect.any(String),
        hasNext: false,
        wordCount: calcWordCount(payload.content),
        number: Number(idx) + 1,
        status: ChapterStatus.Private,
        createdAt: expect.anything(),
        updatedAt: expect.anything()
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
      const response = await createChapter(getGlobalUser(user).token, book.id);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );

  test.each`
    property       | value
    ${'status'}    | ${BookStatus.Public}
    ${'book'}      | ${new ObjectId().toHexString()}
    ${'bookID'}    | ${new ObjectId().toHexString()}
    ${'author'}    | ${new ObjectId().toHexString()}
    ${'wordCount'} | ${999}
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

  test.each`
    key           | status
    ${'finished'} | ${BookStatus.Finished}
    ${'deleted'}  | ${BookStatus.Deleted}
  `('$key book cannot create pay chapter', async ({ status }) => {
    let response = await createBook(author.token);
    const book = response.body;

    response = await updateBook(root.token, book.id, { status });
    expect(response.body).toHaveProperty('status', status);

    response = await createChapter(author.token, book.id, {
      type: ChapterType.Pay
    });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  test('chapter name cannot be duplicate per book', async () => {
    const name = '123';

    let response = await createChapter(author.token, book.id, { name });
    expect(response.status).toBe(HttpStatus.CREATED);

    response = await createChapter(author.token, book.id, { name });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await createBook(author.token);
    const book2 = response.body;

    response = await createChapter(author.token, book2.id, { name });
    expect(response.status).toBe(HttpStatus.CREATED);
  });
}
