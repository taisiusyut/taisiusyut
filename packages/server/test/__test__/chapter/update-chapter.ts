import { ObjectId } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { UpdateChapterDto } from '@/modules/chapter/dto';
import {
  BookStatus,
  ChapterStatus,
  ChapterType,
  Schema$Book,
  Schema$Chapter,
  UserRole
} from '@/typings';
import { rid } from '@/utils/rid';
import { createBook, updateBook } from '../../service/book';
import {
  createUserAndLogin,
  getToken,
  getGlobalUser,
  setupUsers
} from '../../service/auth';
import {
  createChapter,
  createChapterDto,
  getChapter,
  updateChapter
} from '../../service/chapter';

export function testUpdateChapter() {
  let book: Schema$Book;
  let chapter: Schema$Chapter;

  beforeAll(async () => {
    await setupUsers();
    let response = await createBook(author.token);
    book = response.body;

    response = await createChapter(author.token, book.id);
    chapter = response.body;
  });

  test.each(['root', 'admin', 'author'])(
    '%s can update chapter',
    async user => {
      const params: Partial<UpdateChapterDto>[] = [
        { name: rid(10) },
        { content: rid(10) },
        { type: ChapterType.Pay, price: 10 },
        { price: 6 }
      ];

      for (const payload of params) {
        const response = await updateChapter(
          getGlobalUser(user).token,
          book.id,
          chapter.id,
          payload
        );

        expect(response.error).toBeFalse();
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).not.toHaveProperty('book');
        expect(response.body).toMatchObject({
          ...payload,
          status: ChapterStatus.Private
        });
      }
    }
  );

  test.each(['client'])('%s cannot update chapter', async user => {
    const response = await updateChapter(
      getGlobalUser(user).token,
      book.id,
      chapter.id,
      createChapterDto()
    );
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  test.each`
    property    | value
    ${'status'} | ${ChapterStatus.Public}
    ${'book'}   | ${new ObjectId().toHexString()}
    ${'author'} | ${new ObjectId().toHexString()}
  `(
    '$property will not be update by author',
    async ({ property, value }: Record<string, string>) => {
      let response = await updateChapter(author.token, book.id, chapter.id, {
        [property]: value
      });
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.OK);

      response = await getChapter(root.token, book.id, chapter.id);

      expect(response.body).not.toHaveProperty(property, value);
    }
  );

  test.each(['bookID', 'chapterID'])(
    'chapter cannot be update with unknown %s',
    async type => {
      const ids = ['123', new ObjectId().toHexString(), null];
      for (const id of ids) {
        const args =
          type === 'bookID'
            ? ([String(id), chapter.id] as const)
            : ([book.id, String(id)] as const);

        const response = await updateChapter(
          author.token,
          ...args,
          createChapterDto()
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    }
  );

  test("author cannot update other author's chapter", async () => {
    const token = await getToken(
      createUserAndLogin(root.token, {
        role: UserRole.Author
      })
    );
    const changes = createChapterDto();

    let response = await updateChapter(token, book.id, chapter.id, changes);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    response = await getChapter(root.token, book.id, chapter.id);
    expect(response.error).toBeFalse();
    expect(response.body).not.toMatchObject(changes);
  });

  test.each`
    key           | status
    ${'finished'} | ${BookStatus.Finished}
    ${'deleted'}  | ${BookStatus.Deleted}
  `('cannot update chapter type to pay if book is $key', async ({ status }) => {
    let response = await createBook(author.token);
    const book = response.body;

    response = await updateBook(root.token, book.id, { status });
    expect(response.body).toHaveProperty('status', status);

    response = await createChapter(author.token, book.id);

    if (status === BookStatus.Deleted) {
      // deleted book cannot update chapter
    } else {
      const chapter = response.body;
      response = await updateChapter(author.token, book.id, chapter.id, {
        type: ChapterType.Pay
      });
    }

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
}
