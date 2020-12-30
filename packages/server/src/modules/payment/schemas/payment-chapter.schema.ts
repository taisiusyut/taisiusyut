import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Chapter } from '@/modules/chapter/schemas/chapter.schema';
import { Book } from '@/modules/book/schemas/book.schema';
import { PaymentType, Schema$ChapterPayment } from '@/typings';

@Schema()
export class ChapterPayment implements Schema$ChapterPayment {
  type: PaymentType.Chapter;

  @Prop({
    type: Types.ObjectId,
    ref: Book.name,
    required: true
  })
  book: string;

  @Prop({
    type: Types.ObjectId,
    ref: Chapter.name,
    required: true
  })
  chapter: string;

  constructor(payload: Partial<ChapterPayment>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): ChapterPayment {
    return new ChapterPayment(this);
  }
}

export const ChapterPaymentSchema = SchemaFactory.createForClass<ChapterPayment>(
  ChapterPayment
);
