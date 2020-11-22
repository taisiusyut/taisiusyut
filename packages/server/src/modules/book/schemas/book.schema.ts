import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import { Schema$Book, BookStatus, Category } from '@/typings';
import { Group } from '@/decorators';
import { Author } from './author';

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

  @Prop({ type: String, default: '', trim: true })
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
    autopopulate: true
  })
  @Type(() => Author)
  author: Author | string;

  @Group(['book_status_get'])
  @Prop({
    type: Number,
    default: BookStatus.Private,
    enum: Object.values(BookStatus).filter(v => typeof v === 'number')
  })
  status: BookStatus;

  createdAt: string;

  updatedAt: string;

  constructor(payload: Partial<Book>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): Book {
    return new Book(this);
  }
}

export const BookSchema = SchemaFactory.createForClass(Book);
