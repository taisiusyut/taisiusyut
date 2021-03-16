import { IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Schema$Book, Param$CreateBook } from '@/typings';
import { IsDescription, IsTags, IsBookName } from './';

class Excluded implements Partial<Schema$Book> {
  @Exclude()
  id?: undefined;

  @Exclude()
  author?: undefined;

  @Exclude()
  authorName?: undefined;

  @Exclude()
  status?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;

  @Exclude()
  wordCount?: undefined;

  @Exclude()
  numOfCollection?: undefined;

  @Exclude()
  category?: undefined;
}

class CreateBook
  extends Excluded
  implements
    Partial<Omit<Schema$Book, keyof Excluded>>,
    Partial<Omit<Param$CreateBook, keyof Excluded>> {
  @IsOptional()
  @IsDescription()
  description?: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsTags()
  tags?: string[];
}

export class CreateBookDto
  extends CreateBook
  implements
    Required<Omit<Schema$Book, keyof CreateBook>>,
    Required<Omit<Param$CreateBook, keyof CreateBook>> {
  @IsBookName()
  name: string;
}
