import { ObjectID } from 'mongodb';
import { Exclude, Transform } from 'class-transformer';
import { Prop, PropOptions, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InsertedUserSchema, UserRole } from '@/typings';
import bcrypt from 'bcrypt';

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

@Schema({
  discriminatorKey: 'role',
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new User(raw)
  }
})
export class User implements InsertedUserSchema {
  _id: string | ObjectID;

  id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({
    select: false,
    trim: true,
    type: String,
    set: hashPassword,
    get: (pwd: string) => pwd
  })
  @Exclude()
  password: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string;

  @Prop({
    type: String,
    default: UserRole.Client,
    enum: Object.values(UserRole)
  })
  role: UserRole;

  @Prop({
    type: String,
    unique: true, // for author
    default: function (this: PropOptions & User) {
      return this.username;
    }
  })
  nickname: string;

  description?: string;

  @Transform(Number)
  createdAt: number;

  @Transform(Number)
  updatedAt: number;

  constructor(payload: Partial<User>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): User {
    return new User(this);
  }
}

export const UserSchema = SchemaFactory.createForClass<User>(User);
