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
import { createChapter } from '../../service/chapter';
import {
  createPayment,
  getPayments,
  updatePayment
} from '../../service/payment';

export function testGetPayments() {
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;
  const length = 3;
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

    for (let i = 0; i < length; i++) {
      let response = await createChapter(localAuthor.token, book.id, {
        type: ChapterType.Pay
      });
      const chapter = response.body;

      for (const user of ['author', 'client']) {
        response = await createPayment(getUser(user).token, {
          details: {
            type: PaymentType.Chapter,
            book: book.id,
            chapter: chapter.id
          }
        });

        if (i === length - 1) {
          response = await updatePayment(root.token, response.body.id, {
            status: PaymentStatus.Refund
          });
        }

        payments[user].push(response.body);
      }
    }

    for (const user of ['author', 'client']) {
      response = await createPayment(getUser(user).token, {
        details: { type: PaymentType.Book, book: book.id }
      });
      payments[user].push(response.body);
    }
  });

  test('test data is correct', () => {
    expect(payments.author).toHaveLength(length + 1);
    expect(payments.client).toHaveLength(length + 1);
  });

  test.each`
    user        | length
    ${'root'}   | ${(length + 1) * 2}
    ${'admin'}  | ${(length + 1) * 2}
    ${'author'} | ${length + 1}
    ${'client'} | ${length + 1}
  `(`$user get payments correct`, async ({ user, length }) => {
    const response = await getPayments(getUser(user).token);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data).toHaveLength(length);
    expect(response.body.total).toBe(length);
  });

  test.each(['root', 'admin'])(`%s get payments filter`, async user => {
    const payload = [
      [{ user: client.user.user_id }, length + 1],
      [{ book: book.id }, (length + 1) * 2],
      [{ type: PaymentType.Book }, 1 * 2],
      [{ type: PaymentType.Chapter }, length * 2],
      [{ type: PaymentType.Chapter, book: book.id }, length * 2]
    ] as const;

    for (const [query, length] of payload) {
      const response = await getPayments(getUser(user).token, query);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toHaveLength(length);
      expect(response.body.total).toBe(length);
    }
  });

  test.each(['author', 'client'])(`%s get payments filter`, async user => {
    const payload = [
      [{ book: book.id }, length + 1],
      [{ type: PaymentType.Book }, 1],
      [{ type: PaymentType.Chapter }, length],
      [{ type: PaymentType.Chapter, book: book.id }, length]
    ] as const;

    for (const [query, length] of payload) {
      const response = await getPayments(getUser(user).token, query);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toHaveLength(length);
      expect(response.body.total).toBe(length);
    }
  });
}
