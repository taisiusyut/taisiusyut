import { Exclude } from 'class-transformer';
import { Schema$Author, UserRole } from '@/typings';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class Excluded implements Partial<Schema$Author> {
  @Exclude()
  id?: undefined;

  @Exclude()
  password?: undefined;

  @Exclude()
  status?: undefined;

  @Exclude()
  username?: undefined;

  @Exclude()
  email?: undefined;

  @Exclude()
  wordCount?: undefined;
}

export class GetAuthorDto
  extends Excluded
  implements Required<Omit<Schema$Author, keyof Excluded>> {
  nickname: string;

  role: UserRole.Author;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  createdAt: number;

  @IsNumber()
  updatedAt: number;
}
