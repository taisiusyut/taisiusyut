import { Prop, PropOptions, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InsertedUserSchema, UserRole } from '@/typings';
import { Exclude } from 'class-transformer';
import bcrypt from 'bcrypt';

type PropertyDecorator = ReturnType<typeof Prop>;

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

function IsClient(options?: PropOptions): PropertyDecorator {
  return Prop({
    ...options,
    validate: function (this: InsertedUserSchema) {
      return [UserRole.Client, UserRole.Author].includes(this.role);
    }
  });
}

function IsAuthor(options?: PropOptions): PropertyDecorator {
  return Prop({
    ...options,
    validate: function (this: InsertedUserSchema) {
      return [UserRole.Author].includes(this.role);
    }
  });
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new User(raw)
  }
})
export class User implements InsertedUserSchema {
  id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({
    select: false,
    type: String,
    set: hashPassword,
    get: (pwd: string) => pwd
  })
  @Exclude()
  password: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: Number, default: UserRole.Client })
  role: UserRole;

  createdAt: string;

  updatedAt: string;

  @IsClient({ type: String })
  nickname?: string;

  @IsAuthor({ type: String })
  description?: string;

  constructor(payload: Partial<User>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): User {
    return new User(this);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
