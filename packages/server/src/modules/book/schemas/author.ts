import { Schema$Author } from '@/typings';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class Author implements Partial<Schema$Author> {
  @IsString()
  @Expose()
  nickname: string;
}
