import { HttpStatus } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { ChapterService } from '@/modules/chapter/chapter.service';
import {
  Schema$Authenticated,
  Schema$Chapter,
  UserRole,
  ChapterStatus,
  Schema$Book,
  ChapterType
} from '@/typings';
import {
  createUserAndLogin,
  setupRoot,
  setupUsers,
  getGlobalUser
} from '../../service/auth';
import { createBook, updateBook } from '../../service/book';
import {
  createChapter,
  getChapters,
  updateChapter
} from '../../service/chapter';

type Status = Record<keyof typeof ChapterStatus, number>;
type Type = Record<keyof typeof ChapterType, number>;
type Stats = Status & Type;

interface Author {
  auth: Schema$Authenticated;
  book: Schema$Book;
  stats: Stats;
  chapters: Schema$Chapter[];
}

interface Mocks {
  authors: Author[];
  stats: Stats;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const random = <T>(options: T[]): T => options[getRandomInt(0, options.length)];
const randomStatus = () =>
  random([ChapterStatus.Public, ChapterStatus.Private]);
const randomType = () => random([ChapterType.Free, ChapterType.Pay]);

const chapterStatus = Object.values(ChapterStatus)
  .filter((v): v is ChapterStatus => typeof v === 'number')
  .reduce(
    (payload, status) => ({ ...payload, [ChapterStatus[status]]: 0 }),
    {} as Status
  );

const chapterType = Object.values(ChapterType)
  .filter((v): v is ChapterType => typeof v === 'number')
  .reduce(
    (payload, status) => ({ ...payload, [ChapterType[status]]: 0 }),
    {} as Type
  );

const stats = { ...chapterStatus, ...chapterType };

export function testGetChapters() {
  const mocks: Mocks = {
    authors: [],
    stats: { ...stats }
  };

  const stub: Partial<Pick<Schema$Chapter, 'status' | 'type' | 'price'>>[][] = [
    [
      { status: ChapterStatus.Public, type: ChapterType.Free },
      { status: ChapterStatus.Public, type: ChapterType.Pay },
      { status: ChapterStatus.Private, type: ChapterType.Free },
      { status: ChapterStatus.Private, type: ChapterType.Pay }
    ],
    Array.from({ length: 4 }, () => ({
      status: randomStatus(),
      type: randomType()
    })),
    Array.from({ length: 4 }, () => ({
      status: randomStatus(),
      type: randomType()
    }))
  ];

  beforeAll(async () => {
    await app.get(BookService).clear();
    await app.get(ChapterService).clear();
    await setupRoot();
    await setupUsers();

    for (const payload of stub) {
      let response = await createUserAndLogin(root.token, {
        role: UserRole.Author
      });
      let book: Schema$Book;
      const auth: Schema$Authenticated = response.body;
      const chapters: Schema$Chapter[] = [];

      response = await createBook(auth.token);
      book = response.body;
      response = await updateBook(auth.token, book.id);
      book = response.body;

      const _stats = { ...stats };

      for (const params of payload) {
        let response = await createChapter(auth.token, book.id);
        let chapter: Schema$Chapter = response.body;

        if (params.type === ChapterType.Pay) {
          params.price = 1;
        }

        response = await updateChapter(root.token, book.id, chapter.id, params);

        expect(response.status).toBe(HttpStatus.OK);

        chapter = response.body;

        _stats[ChapterStatus[chapter.status] as keyof Status]++;
        _stats[ChapterType[chapter.type] as keyof Type]++;

        mocks.stats[ChapterStatus[chapter.status] as keyof Status]++;
        mocks.stats[ChapterType[chapter.type] as keyof Type]++;

        chapters.push(chapter);
      }

      mocks.authors.push({ auth, book, chapters, stats: _stats });
    }
  });

  test.each(['root', 'admin', 'author', 'client'])(
    `global %s can access chapters correctly`,
    async user => {
      for (const { book, chapters, stats } of mocks.authors) {
        const response = await getChapters(getGlobalUser(user).token, book.id, {
          pageSize: 100
        });

        const hasPermission = ['root', 'admin'].includes(user);
        // root and admin should get all chapters, the others can only get the public chapters
        const expetedLength = hasPermission ? chapters.length : stats.Public;

        expect(response.body.total).toBe(expetedLength);
        expect(response.body.data).toHaveLength(expetedLength);
        expect(response.body.data).not.toContainObject({
          content: expect.anything(),
          createdAt: expect.anything(),
          updateddAt: expect.anything()
        });
      }
    }
  );

  test.each(stub.map((_, index) => index))(
    `author-%s can access all public chapeters and his/her chapeters`,
    async index => {
      const { auth } = mocks.authors[index];
      for (let i = 0; i < mocks.authors.length; i++) {
        const { book, chapters, stats } = mocks.authors[i];
        const response = await getChapters(auth.token, book.id, {
          pageSize: 100
        });
        const self = i === index;

        const expetedLength = self ? chapters.length : stats.Public;

        expect(response.body.total).toBe(expetedLength);
        expect(response.body.data).toHaveLength(expetedLength);

        if (response.body.data.length) {
          expect(response.body.data).toContainObject({
            status: expect.anything()
          });
        }
      }
    }
  );

  test.each(stub.map((_, index) => index))(
    `author-%s access chapters by status`,
    async index => {
      const { auth, book, stats } = mocks.authors[index];
      for (const k in chapterStatus) {
        const key = k as keyof Status;
        const response = await getChapters(auth.token, book.id, {
          pageSize: 100,
          status: ChapterStatus[key]
        });
        const length = stats[key];
        expect(response.body.total).toBe(length);
        expect(response.body.data).toHaveLength(length);

        if (response.body.data.length) {
          expect(response.body.data).toContainObject({
            status: expect.anything()
          });
        }
      }
    }
  );

  test(`client cannot access chapetrs by status`, async () => {
    for (const { book, stats } of mocks.authors) {
      for (const k in chapterStatus) {
        const key = k as keyof Status;
        const status = ChapterStatus[key];
        if (status !== ChapterStatus.Public) {
          const response = await getChapters(client.token, book.id, { status });
          const length = stats.Public;
          expect(response.body.total).toBe(length);
          expect(response.body.data).toHaveLength(length);
          expect(response.body.data).not.toContainObject({
            status: expect.anything(),
            content: expect.anything(),
            createdAt: expect.anything(),
            updateddAt: expect.anything()
          });
        }
      }
    }
  });
}
