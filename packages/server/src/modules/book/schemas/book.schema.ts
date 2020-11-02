import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/user.schema';
import { Schema$Book, BookStatus } from '@/typings';
import { Group } from '@/decorators';
import { Author } from './author';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new Book(raw)
  }
})
export class Book implements Record<keyof Schema$Book, unknown> {
  id: string;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String })
  cover: string;

  @Prop({ type: String, default: '' })
  category: string;

  @Prop({ type: [String], lowercase: true, default: [] })
  tags: string[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    autopopulate: true
  })
  @Type(() => Author)
  author: Author | string;

  @Group(['Root', 'Admin', 'Author'])
  @Prop({ type: Number, default: BookStatus.Pending })
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
