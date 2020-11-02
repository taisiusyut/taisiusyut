import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Book } from '@/modules/book/schemas/book.schema';
import { Schema$Chapter, ChapterStatus, ChapterType } from '@/typings';
import { Group } from '@/decorators';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new Chapter(raw)
  }
})
export class Chapter implements Record<keyof Schema$Chapter, unknown> {
  id: string;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, default: '' })
  content: string;

  @Prop({
    select: false,
    type: Types.ObjectId,
    ref: Book.name,
    required: true,
    autopopulate: false
  })
  @Type(() => Book)
  book: string;

  @Group(['Root', 'Admin', 'Author'])
  @Prop({ type: Number, default: ChapterStatus.Private })
  status: ChapterStatus;

  @Prop({ type: Number, required: true })
  type: ChapterType;

  @Prop({ type: Number, required: true })
  price: ChapterType;

  createdAt: string;

  updatedAt: string;

  constructor(payload: Partial<Chapter>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): Chapter {
    return new Chapter(this);
  }
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
