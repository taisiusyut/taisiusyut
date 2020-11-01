import { IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Schema$Book, Param$UpdateBook } from '@/typings';
import { IsDescription, IsTags, IsTitle, IsCategory } from './';

class Excluded implements Partial<Schema$Book> {
  @Exclude()
  id?: undefined;

  @Exclude()
  author?: undefined;

  @Exclude()
  status?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateBook
  extends Excluded
  implements
    Partial<Omit<Schema$Book, keyof Excluded>>,
    Partial<Omit<Param$UpdateBook, keyof Excluded>> {
  @IsOptional()
  @IsTitle()
  title?: string;

  @IsOptional()
  @IsCategory()
  category?: string;

  @IsOptional()
  @IsDescription()
  description?: string;

  @IsOptional()
  @IsTags()
  tags?: string[];
}

export class UpdateBookDto
  extends UpdateBook
  implements
    Required<Omit<Schema$Book, keyof UpdateBook>>,
    Required<Omit<Param$UpdateBook, keyof UpdateBook>> {}
