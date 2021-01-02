import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import { Schema$BugReport, BugReportStatus, BugReportType } from '@/typings';
import { Group } from '@/utils/access';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new BugReport(raw)
  }
})
export class BugReport implements Record<keyof Schema$BugReport, any> {
  id: string;

  @Prop({ type: String, trim: true, required: true })
  title: string;

  @Prop({ type: String, trim: true, required: true })
  description: string;

  @Prop({ type: String, trim: true })
  version: string;

  @Prop({
    required: true,
    type: Number,
    enum: Object.values(BugReportStatus).filter(v => typeof v === 'number')
  })
  status: BugReportStatus;

  @Prop({
    required: true,
    type: Number,
    enum: Object.values(BugReportType).filter(v => typeof v === 'number')
  })
  type: BugReportType;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    autopopulate: { maxDepth: 1 }
  })
  @Type(() => User)
  @Group(['Root', 'Admin', 'Guest'])
  user: User | string;

  @Transform(Number)
  createdAt: string;

  @Transform(Number)
  updatedAt: string;

  constructor(payload: Partial<BugReport>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): BugReport {
    return new BugReport(this);
  }
}

export const BugReportSchema = SchemaFactory.createForClass<BugReport>(
  BugReport
);