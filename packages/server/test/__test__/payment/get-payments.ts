import { HttpStatus } from '@nestjs/common';
import {
  ChapterType,
  PaymentStatus,
  PaymentType,
  Schema$Authenticated,
  Schema$Book,
  Schema$Payment,
  UserRole
} from '@/typings';
import { PaymentService } from '@/modules/payment/payment.service';
import { createUserAndLogin, getUser, setupUsers } from '../../service/auth';
import { createBook } from '../../service/book';
import { createChapter, publicChapter } from '../../service/chapter';
import {
  createPayment,
  getPayments,
  updatePayment
} from '../../service/payment';

export function testGetPayments() {
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;
  const numOfChapters = 3;

  const payments: Record<string, Schema$Payment[]> = {
    author: [],
    client: []
  };

  beforeAll(async () => {
    await app.get(PaymentService).clear();

    await setupUsers();

    let response = await createUserAndLogin(root.token, {
      role: UserRole.Author
    });
    localAuthor = response.body;

    response = await createBook(localAuthor.token);
    book = response.body;

    for (let i = 1; i <= numOfChapters; i++) {
      let response = await createChapter(localAuthor.token, book.id, {
        type: ChapterType.Pay
      });
      let chapter = response.body;
      response = await publicChapter(
        localAuthor.token,
        book.id,
        response.body.id
      );
      chapter = response.body;

      for (const user of ['author', 'client']) {
        if (i === numOfChapters) {
          response = await createPayment(getUser(user).token, {
            details: { type: PaymentType.Book, book: book.id }
          });
          expect(response.status).toBe(HttpStatus.CREATED);

          payments[user].push(response.body);
        } else {
          response = await createPayment(getUser(user).token, {
            details: {
              type: PaymentType.Chapter,
              book: book.id,
              chapter: chapter.id
            }
          });
          expect(response.status).toBe(HttpStatus.CREATED);

          if (i === 1) {
            response = await updatePayment(root.token, response.body.id, {
              status: PaymentStatus.Success
            });
            expect(response.status).toBe(HttpStatus.OK);
          }

          payments[user].push(response.body);
        }
      }
    }
  });

  test('test data is correct', () => {
    expect(payments.author).toHaveLength(numOfChapters);
    expect(payments.client).toHaveLength(numOfChapters);
  });

  test.each`
    user        | numOfChapters
    ${'root'}   | ${numOfChapters * 2}
    ${'admin'}  | ${numOfChapters * 2}
    ${'author'} | ${numOfChapters}
    ${'client'} | ${numOfChapters}
  `(`$user get payments correct`, async ({ user, numOfChapters }) => {
    const response = await getPayments(getUser(user).token);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data).toHaveLength(numOfChapters);
    expect(response.body.total).toBe(numOfChapters);
  });

  test.each(['root', 'admin'])(`%s get payments filter`, async user => {
    const payload = [
      [{ user: client.user.user_id }, numOfChapters],
      [{ book: book.id }, numOfChapters * 2],
      [{ type: PaymentType.Book }, 1 * 2],
      [{ type: PaymentType.Chapter }, (numOfChapters - 1) * 2],
      [{ type: PaymentType.Chapter, book: book.id }, (numOfChapters - 1) * 2]
    ] as const;

    for (const [query, numOfChapters] of payload) {
      const response = await getPayments(getUser(user).token, query);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toHaveLength(numOfChapters);
      expect(response.body.total).toBe(numOfChapters);
    }
  });

  test.each(['author', 'client'])(`%s get payments filter`, async user => {
    const payload = [
      [{ book: book.id }, numOfChapters],
      [{ type: PaymentType.Book }, 1],
      [{ type: PaymentType.Chapter }, numOfChapters - 1],
      [{ type: PaymentType.Chapter, book: book.id }, numOfChapters - 1]
    ] as const;

    for (const [query, numOfChapters] of payload) {
      const response = await getPayments(getUser(user).token, query);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toHaveLength(numOfChapters);
      expect(response.body.total).toBe(numOfChapters);
    }
  });
}
