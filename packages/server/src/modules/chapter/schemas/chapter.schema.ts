import { ObjectID } from 'mongodb';
import { Types } from 'mongoose';
import { Type, Exclude, Transform } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import { Book } from '@/modules/book/schemas/book.schema';
import { Schema$Chapter, ChapterStatus, ChapterType } from '@/typings';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new Chapter(raw)
  }
})
export class Chapter implements Schema$Chapter {
  _id: ObjectID;

  id: string;

  @Prop({ type: Number, required: true })
  number: number;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, default: '' })
  content: string;

  @Exclude()
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true
  })
  @Type(() => User)
  author: string;

  @Exclude()
  @Prop({
    type: Types.ObjectId,
    ref: Book.name,
    required: true
  })
  @Type(() => Book)
  book: string;

  @Prop({
    type: Number,
    default: ChapterStatus.Private,
    enum: Object.values(ChapterStatus).filter(v => typeof v === 'number')
  })
  status: ChapterStatus;

  @Prop({
    type: Number,
    required: true,
    enum: Object.values(ChapterType).filter(v => typeof v === 'number')
  })
  type: ChapterType;

  @Prop({ type: Number })
  price?: number;

  @Prop({ type: Boolean, default: false })
  hasNext: boolean;

  @Prop({ type: Number, required: true })
  wordCount: number;

  @Transform(Number)
  createdAt: number;

  @Transform(Number)
  updatedAt: number;

  constructor(payload: Partial<Chapter>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): Chapter {
    return new Chapter(this);
  }
}

export const ChapterSchema = SchemaFactory.createForClass<Chapter>(Chapter);

// chapter name cannot be duplicate per book
ChapterSchema.index({ name: 1, book: 1 }, { unique: true });

// chapter number cannot be duplicate per book
ChapterSchema.index({ book: 1, number: 1 }, { unique: true });
