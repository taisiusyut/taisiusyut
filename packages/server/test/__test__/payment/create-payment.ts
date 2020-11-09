import { HttpStatus } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  ChapterType,
  PaymentType,
  Schema$Authenticated,
  Schema$Book,
  Schema$Chapter,
  UserRole
} from '@/typings';
import { createUserAndLogin, getUser, setupUsers } from '../../service/auth';
import { createBook } from '../../service/book';
import { createChapter } from '../../service/chapter';
import {
  createPayment,
  createPaymentDto,
  CreatePaymentDto
} from '../../service/payment';

export function testCreatePayment() {
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;
  let chapter: Schema$Chapter;
  let freeChapter: Schema$Chapter;

  const getDefaultPayload = () =>
    [
      createPaymentDto({
        details: { type: PaymentType.Book, book: book.id }
      }),
      createPaymentDto({
        details: {
          type: PaymentType.Chapter,
          book: book.id,
          chapter: chapter.id
        }
      })
    ] as const;

  beforeAll(async () => {
    await setupUsers();

    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    localAuthor = response.body;

    response = await createBook(localAuthor.token);
    book = response.body;

    response = await createChapter(localAuthor.token, book.id, {
      type: ChapterType.Pay
    });
    chapter = response.body;

    response = await createChapter(localAuthor.token, book.id);
    freeChapter = response.body;
  });

  test.each(['root', 'admin'])(
    `global %s cannot create payment`,
    async user => {
      const payload = getDefaultPayload();
      for (const params of payload) {
        const response = await createPayment(getUser(user).token, params);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    }
  );

  test.each(['author', 'client'])(
    `global %s can create payment`,
    async user => {
      const payload = getDefaultPayload().slice().reverse();
      for (const params of payload) {
        const response = await createPayment(getUser(user).token, params);
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          ...params,
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
          chapter: chapter.id
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
        chapter: chapter.id
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

  test(`book payment cannot be duplicate`, async () => {
    const response = await createBook(localAuthor.token);
    const book = response.body;

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
    let response = await createBook(localAuthor.token);
    const book = response.body;
    response = await createChapter(localAuthor.token, book.id, {
      type: ChapterType.Pay
    });
    const chapter = response.body;

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
    let response = await createBook(localAuthor.token);
    const book = response.body;

    response = await createChapter(localAuthor.token, book.id, {
      type: ChapterType.Pay
    });
    const chapter = response.body;

    response = await createPayment(
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
