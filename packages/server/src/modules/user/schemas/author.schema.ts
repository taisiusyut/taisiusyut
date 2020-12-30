import { UserRole } from '@/typings';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/mapped-types';
import { Client } from './client.schema';

@Schema()
export class Author extends OmitType(Client, ['role']) {
  role: UserRole;

  @Prop({ type: String, default: '', trim: true })
  description: string;
}

export const AuthorSchema = SchemaFactory.createForClass<Author>(Author);
