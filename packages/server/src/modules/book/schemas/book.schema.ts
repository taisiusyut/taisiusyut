import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import { Schema$Book, BookStatus, Category, LatestChapter } from '@/typings';
import { Group } from '@/utils/access';
import { Max_Book_Description } from '@/constants';
import { BookAuthor } from './book-author';

export const latestChapterSelect: {
  [X in keyof LatestChapter]: 1;
} = {
  id: 1,
  name: 1,
  number: 1,
  updatedAt: 1
};

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new Book(raw)
  }
})
export class Book implements Record<keyof Schema$Book, unknown> {
  _id: ObjectId;

  id: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  name: string;

  @Prop({ type: String, default: '', maxlength: Max_Book_Description })
  description: string;

  @Prop({ type: String })
  cover: string | null;

  @Prop({
    type: Number,
    required: false,
    enum: Object.values(Category).filter(v => typeof v === 'number')
  })
  category: Category;

  @Prop({ type: [String], lowercase: true, trim: true, default: [] })
  tags: string[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true
  })
  @Type(() => BookAuthor)
  @Group(['Root', 'Admin'])
  author: BookAuthor | string;

  // for fuzzy search ??
  @Prop({ type: String, required: true, trim: true })
  authorName: string;

  @Prop({
    type: Number,
    required: true,
    enum: Object.values(BookStatus).filter(v => typeof v === 'number')
  })
  status: BookStatus;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  wordCount: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  numOfCollection: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Chapter',
    autopopulate: {
      maxDepth: 1,
      select: latestChapterSelect
    }
  })
  latestChapter: string | null;

  @Prop({ type: Number })
  lastPublishedAt: number | undefined | null;

  @Transform(({ value }) => value && Number(value))
  createdAt: string;

  @Transform(({ value }) => value && Number(value))
  updatedAt: string;

  constructor(payload: Partial<Book>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): Book {
    return new Book(this);
  }
}

export const BookSchema = SchemaFactory.createForClass<Book>(Book);
