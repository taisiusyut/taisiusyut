import { UserRole } from '@/typings';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/mapped-types';
import { Max_Author_Description } from '@/constants';
import { Client } from './client.schema';

@Schema()
export class Author extends OmitType(Client, ['role']) {
  role: UserRole;

  @Prop({
    default: '',
    type: String,
    maxlength: Max_Author_Description
  })
  description: string;
}

export const AuthorSchema = SchemaFactory.createForClass<Author>(Author);
