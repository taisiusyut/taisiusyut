import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import { Book } from '@/modules/book/schemas/book.schema';
import { Chapter } from '@/modules/chapter/schemas/chapter.schema';
import { Schema$BookShelf } from '@/typings';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new BookShelf(raw)
  }
})
export class BookShelf
  implements Partial<Record<keyof Schema$BookShelf, unknown>> {
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    select: false
  })
  @Type(() => User)
  user: string;

  @Prop({
    type: Types.ObjectId,
    ref: Book.name,
    required: true,
    autopopulate: true
  })
  @Type(() => Book)
  book: string | Book;

  @Prop({ type: Boolean, default: false })
  pin?: boolean;

  @Prop({ type: Number })
  lastVisit?: number;

  @Prop({
    type: Types.ObjectId,
    ref: Chapter.name
  })
  latestChapter?: string | null;

  createdAt: string;

  updatedAt: string;

  constructor(payload: Partial<BookShelf>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): BookShelf {
    return new BookShelf(this);
  }
}

export const BookShelfSchema = SchemaFactory.createForClass(BookShelf);

BookShelfSchema.index({ user: 1, book: 1 }, { unique: true });
