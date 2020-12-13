import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import { Book } from '@/modules/book/schemas/book.schema';
import { Chapter } from '@/modules/chapter/schemas/chapter.schema';
import { Schema$Book, Schema$BookShelf } from '@/typings';

type ShelfBook = Schema$BookShelf['book'];
type LatestChapter = NonNullable<Schema$BookShelf['latestChapter']>;

export const bookSelect: {
  [X in Exclude<keyof Schema$Book, keyof ShelfBook>]: 0;
} = {
  tags: 0,
  description: 0
};

export const latestChapterSelect: {
  [X in keyof LatestChapter]: 1;
} = {
  id: 1,
  name: 1,
  number: 1
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
      maxDepth: 2, // for author
      select: bookSelect
    }
  })
  @Type(() => Book)
  book: string | Book;

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

  @Transform(Number)
  createdAt: string;

  @Transform(Number)
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
