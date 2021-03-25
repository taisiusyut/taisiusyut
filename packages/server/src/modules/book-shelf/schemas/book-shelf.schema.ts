import { FilterQuery, Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PickType } from '@nestjs/mapped-types';
import { User } from '@/modules/user/schemas/user.schema';
import { Book } from '@/modules/book/schemas/book.schema';
import { Chapter } from '@/modules/chapter/schemas/chapter.schema';
import { BookStatus, Schema$Book, Schema$BookShelf } from '@/typings';

type LatestChapter = NonNullable<Schema$BookShelf['latestChapter']>;

class ShelfBook
  extends PickType(Book, ['id', 'name', 'authorName', 'status'])
  implements NonNullable<Schema$BookShelf['book']> {}

export const bookSelect: {
  [X in keyof ShelfBook]: 1;
} = {
  id: 1,
  name: 1,
  authorName: 1,
  status: 1
};

export const latestChapterSelect: {
  [X in keyof LatestChapter]: 1;
} = {
  id: 1,
  name: 1,
  number: 1
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
  @Type(() => ShelfBook)
  book: string | ShelfBook;

  @Prop({ type: Boolean, default: false })
  pin?: boolean;

  @Prop({ type: Number })
  lastVisit?: number;

  @Prop({
    type: Types.ObjectId,
    ref: Chapter.name,
    autopopulate: {
      maxDepth: 1,
      select: latestChapterSelect
    }
  })
  latestChapter?: string | null;

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
