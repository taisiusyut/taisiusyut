import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import { Schema$Book, BookStatus, Category } from '@/typings';
import { Max_Book_Description } from '@/constants';
import { BookAuthor } from './book-author';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new Book(raw)
  }
})
export class Book implements Partial<Record<keyof Schema$Book, unknown>> {
  id: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  name: string;

  @Prop({ type: String, default: '', maxlength: Max_Book_Description })
  description: string;

  @Prop({ type: String })
  cover?: string | null;

  @Prop({
    type: Number,
    required: true,
    enum: Object.values(Category).filter(v => typeof v === 'number')
  })
  category: Category;

  @Prop({ type: [String], lowercase: true, trim: true, default: [] })
  tags: string[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    autopopulate: { maxDepth: 1 }
  })
  @Type(() => BookAuthor)
  author: BookAuthor | string;

  @Prop({ type: String, required: true, trim: true })
  authorName: string;

  @Prop({
    type: Number,
    required: true,
    enum: Object.values(BookStatus).filter(v => typeof v === 'number')
  })
  status: BookStatus;

  @Transform(Number)
  createdAt: string;

  @Transform(Number)
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
