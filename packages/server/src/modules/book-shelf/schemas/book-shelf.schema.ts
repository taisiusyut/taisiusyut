import { FilterQuery, Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import { Book } from '@/modules/book/schemas/book.schema';
import {
  BookStatus,
  BookInShelf,
  Schema$Book,
  Schema$BookShelf
} from '@/typings';

export const bookSelect: {
  [X in keyof Required<BookInShelf>]: 1;
} = {
  id: 1,
  name: 1,
  authorName: 1,
  status: 1,
  cover: 1,
  latestChapter: 1
};

const bookQuery: FilterQuery<Schema$Book> = {
  $nor: [{ status: BookStatus.Deleted }]
};

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
    autopopulate: {
      match: bookQuery,
      select: bookSelect
    }
  })
  book: string | BookInShelf;

  @Prop({ type: Boolean, default: false })
  pin?: boolean;

  @Prop({ type: Number })
  lastVisit?: number;

  @Transform(({ value }) => value && Number(value))
  createdAt: string;

  @Transform(({ value }) => value && Number(value))
  updatedAt: string;

  constructor(payload: Partial<BookShelf>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): BookShelf {
    return new BookShelf(this);
  }
}

export const BookShelfSchema = SchemaFactory.createForClass<BookShelf>(
  BookShelf
);

BookShelfSchema.index({ user: 1, book: 1 }, { unique: true });
