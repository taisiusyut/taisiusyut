import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { Category, Schema$Book, Param$UpdateBook, BookStatus } from '@/typings';
import { IsDescription, IsTags, IsBookName, IsCategory } from './';

class Excluded implements Partial<Schema$Book> {
  @Exclude()
  id?: undefined;

  @Exclude()
  author?: undefined;

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
  @IsBookName()
  name?: string;

  @IsOptional()
  @IsString()
  cover?: string | null;

  @IsOptional()
  @IsCategory()
  category?: Category;

  @IsOptional()
  @IsDescription()
  description?: string;

  @IsOptional()
  @IsTags()
  tags?: string[];

  @IsOptional()
  @IsEnum(BookStatus)
  @Transform(Number)
  status?: BookStatus;
}

export class UpdateBookDto
  extends UpdateBook
  implements
    Required<Omit<Schema$Book, keyof UpdateBook>>,
    Required<Omit<Param$UpdateBook, keyof UpdateBook>> {}
