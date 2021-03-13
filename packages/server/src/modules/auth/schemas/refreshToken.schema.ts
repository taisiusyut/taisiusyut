import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole, Schema$RefreshToken } from '@/typings';
import { Transform } from 'class-transformer';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new RefreshToken(raw)
  }
})
export class RefreshToken implements Schema$RefreshToken {
  id: string;

  @Prop({ type: String, required: true, trim: true })
  user_id: string;

  @Prop({ type: String, required: true, trim: true })
  username: string;

  @Prop({ type: String, required: true, trim: true })
  nickname: string;

  @Prop({ type: String, required: true, enum: Object.values(UserRole) })
  role: UserRole;

  @Prop({ type: String, required: true, unique: true })
  refreshToken: string;

  @Prop({ type: String, trim: true })
  userAgent?: string;

  @Transform(({ value }) => value && Number(value))
  createdAt: number;

  @Transform(({ value }) => value && Number(value))
  updatedAt: number;

  constructor(payload: Partial<RefreshToken>) {
    Object.assign(this, payload);
  }

  toJSON(): RefreshToken {
    return new RefreshToken(this);
  }
}

export const RefreshTokenSchema = SchemaFactory.createForClass<RefreshToken>(
  RefreshToken
);
