import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema$Announcement, Category, AnnouncementType } from '@/typings';
import { Max_Announcement_Description } from '@/constants';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new Announcement(raw)
  }
})
export class Announcement implements Schema$Announcement {
  _id: ObjectId;

  id: string;

  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({
    type: String,
    required: true,
    maxlength: Max_Announcement_Description
  })
  description: string;

  @Prop({ type: Number, required: true })
  @Transform(({ value }) => value && Number(value))
  start: number;

  @Prop({ type: Number, required: true })
  @Transform(({ value }) => value && Number(value))
  end: number;

  @Prop({
    type: Number,
    required: true,
    enum: Object.values(Category).filter(v => typeof v === 'number')
  })
  type: AnnouncementType;

  @Transform(({ value }) => value && Number(value))
  createdAt: number;

  @Transform(({ value }) => value && Number(value))
  updatedAt: number;

  constructor(payload: Partial<Announcement>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): Announcement {
    return new Announcement(this);
  }
}

export const AnnouncementSchema = SchemaFactory.createForClass<Announcement>(
  Announcement
);
