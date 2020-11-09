import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/mapped-types';
import { UserRole } from '@/typings';
import { User } from './user.schema';

@Schema()
export class Client extends OmitType(User, ['role']) {
  role: UserRole;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
