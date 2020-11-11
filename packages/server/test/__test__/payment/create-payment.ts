import { HttpStatus } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  ChapterStatus,
  ChapterType,
  PaymentType,
  Schema$Authenticated,
  Schema$Book,
  Schema$Chapter,
  UserRole
} from '@/typings';
import { createUserAndLogin, getUser, setupUsers } from '../../service/auth';
import { createBook } from '../../service/book';
import { createChapter, publicChapter } from '../../service/chapter';
import {
  createPayment,
  createPaymentDto,
  CreatePaymentDto
} from '../../service/payment';

export function testCreatePayment() {
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;
  let freeChapter: Schema$Chapter;
  const chapters: Schema$Chapter[] = [];
  const numOfChapters = 3;

  const getDefaultPayload = () =>
    [
      [
        createPaymentDto({
          details: {
            type: PaymentType.Chapter,
            book: book.id,
            chapter: chapters[0].id
          }
        }),
        1
      ],
      [
        createPaymentDto({
          details: { type: PaymentType.Book, book: book.id }
        }),
        numOfChapters - 1
      ]
    ] as const;

  beforeAll(async () => {
    await setupUsers();

    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    localAuthor = response.body;

    response = await createBook(localAuthor.token);
    book = response.body;

    for (let i = 0; i < numOfChapters; i++) {
      response = await createChapter(localAuthor.token, book.id, {
        type: ChapterType.Pay
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      response = await publicChapter(
        localAuthor.token,
        book.id,
        response.body.id
      );
      expect(response.body.type).toBe(ChapterType.Pay);
      expect(response.body.status).toBe(ChapterStatus.Public);
      chapters.push(response.body);
    }

    response = await createChapter(localAuthor.token, book.id);
    freeChapter = response.body;
  });

  test.each(['root', 'admin'])(
    `global %s cannot create payment`,
    async user => {
      const payload = getDefaultPayload();
      for (const [params] of payload) {
        const response = await createPayment(getUser(user).token, params);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      }
    }
  );

  test.each(['author', 'client'])(
    `global %s can create payment`,
    async user => {
      const payload = getDefaultPayload();
      for (const [params, price] of payload) {
        const response = await createPayment(getUser(user).token, params);
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          ...params,
          price: price,
          id: expect.any(String),
          status: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        });
      }
    }
  );

  test(`author cannot create his/her book/chaptr payment`, async () => {
    const payload = [
      createPaymentDto({ details: { type: PaymentType.Book, book: book.id } }),
      createPaymentDto({
        details: {
          type: PaymentType.Chapter,
          book: book.id,
          chapter: chapters[0].id
        }
      })
    ];
    for (const params of payload) {
      const response = await createPayment(localAuthor.token, params);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  test(`cannot create payment with incorrect payload`, async () => {
    const payload = [
      createPaymentDto({ details: { type: PaymentType.Book, book: '' } }),
      createPaymentDto({ details: { type: 123, book: book.id } }),
      // missing chapter
      createPaymentDto({
        details: { type: PaymentType.Chapter, book: book.id }
      }),
      // unknown bookID
      createPaymentDto({
        type: PaymentType.Book,
        book: new ObjectId().toHexString()
      }),
      // unknown bookID
      createPaymentDto({
        type: PaymentType.Chapter,
        book: new ObjectId().toHexString(),
        chapter: chapters[0].id
      }),
      // unknown chapterID
      createPaymentDto({
        type: PaymentType.Chapter,
        book: book.id,
        chapter: new ObjectId().toHexString()
      }),
      // free chapter
      createPaymentDto({
        type: PaymentType.Chapter,
        book: book.id,
        chapter: freeChapter.id
      })
    ] as CreatePaymentDto[];

    for (const params of payload) {
      const response = await createPayment(client.token, params);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  async function setupBookAndChapter() {
    let response = await createBook(localAuthor.token);
    const book = response.body;
    response = await createChapter(localAuthor.token, book.id, {
      type: ChapterType.Pay
    });
    response = await publicChapter(
      localAuthor.token,
      book.id,
      response.body.id
    );
    const chapter = response.body;
    return [book, chapter];
  }

  test(`book payment cannot be duplicate`, async () => {
    const [book] = await setupBookAndChapter();

    for (const [user, status] of [
      [client, HttpStatus.CREATED],
      [client, HttpStatus.BAD_REQUEST],
      [author, HttpStatus.CREATED]
    ] as const) {
      const response = await createPayment(
        user.token,
        createPaymentDto({
          details: {
            type: PaymentType.Book,
            book: book.id
          }
        })
      );

      expect(response.status).toBe(status);
    }
  });

  test(`chapter payment cannot be duplicate`, async () => {
    const [book, chapter] = await setupBookAndChapter();

    for (const [user, status] of [
      [client, HttpStatus.CREATED],
      [client, HttpStatus.BAD_REQUEST],
      [author, HttpStatus.CREATED]
    ] as const) {
      const response = await createPayment(
        user.token,
        createPaymentDto({
          details: {
            type: PaymentType.Chapter,
            book: book.id,
            chapter: chapter.id
          }
        })
      );

      expect(response.status).toBe(status);
    }
  });

  test(`chapter payment cannot be created if book payment exists`, async () => {
    const [book, chapter] = await setupBookAndChapter();

    let response = await createPayment(
      client.token,
      createPaymentDto({
        details: {
          type: PaymentType.Book,
          book: book.id
        }
      })
    );

    expect(response.status).toBe(HttpStatus.CREATED);

    response = await createPayment(
      client.token,
      createPaymentDto({
        details: {
          type: PaymentType.Chapter,
          book: book.id,
          chapter: chapter.id
        }
      })
    );

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
}
