import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Book } from '@/modules/book/schemas/book.schema';
import { PaymentType, Schema$BookPayment } from '@/typings';

@Schema()
export class BookPayment implements Schema$BookPayment {
  type: PaymentType.Book;

  @Prop({
    type: Types.ObjectId,
    ref: Book.name,
    required: true
  })
  book: string;

  constructor(payload: Partial<BookPayment>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): BookPayment {
    return new BookPayment(this);
  }
}

export const BookPaymentSchema = SchemaFactory.createForClass(BookPayment);
