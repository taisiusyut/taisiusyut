import { HttpStatus } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  ChapterType,
  PaymentStatus,
  PaymentType,
  Schema$Authenticated,
  Schema$Book,
  Schema$Chapter,
  Schema$Payment,
  UserRole
} from '@/typings';
import { createUserAndLogin, getUser, setupUsers } from '../../service/auth';
import { createBook } from '../../service/book';
import { createChapter } from '../../service/chapter';
import {
  createPayment,
  createPaymentDto,
  updatePayment
} from '../../service/payment';

export function testUpdatePayment() {
  let localAuthor: Schema$Authenticated;
  let book: Schema$Book;
  let chapter: Schema$Chapter;
  let payments: Schema$Payment[] = [];

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

    payments = await Promise.all(
      [
        createPaymentDto({
          details: {
            type: PaymentType.Chapter,
            book: book.id,
            chapter: chapter.id
          }
        }),
        createPaymentDto({
          details: { type: PaymentType.Book, book: book.id }
        })
      ].map(params => createPayment(client.token, params).then(res => res.body))
    );
  });

  test.each`
    property     | value
    ${'price'}   | ${321}
    ${'user'}    | ${new ObjectId().toHexString()}
    ${'details'} | ${createPaymentDto({})}
  `('$property will not be update', async ({ property, value }) => {
    for (const payment of payments) {
      const response = await updatePayment(root.token, payment.id, {
        [property]: value
      });
      expect(response.status).toBe(HttpStatus.OK);
    }
  });

  test.each(['author', 'client'])(
    '%s cannot update payment status',
    async user => {
      const payment = payments[0];
      const response = await updatePayment(getUser(user).token, payment.id, {
        status: PaymentStatus.Success
      });
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );

  test.each(['root', 'admin'])('%s can update payment status', async user => {
    const payment = payments[user === 'root' ? 0 : 1];
    const response = await updatePayment(getUser(user).token, payment.id, {
      status: PaymentStatus.Success
    });
    expect(response.status).toBe(HttpStatus.OK);
  });
}
