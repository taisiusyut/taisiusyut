import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { Category, Schema$Book, Param$UpdateBook, BookStatus } from '@/typings';
import { IsDescription, IsTags, IsBookName } from './';
import { Group } from '@/utils/access';

class Excluded implements Partial<Record<keyof Schema$Book, unknown>> {
  @Exclude()
  id?: undefined;

  @Exclude()
  author?: undefined;

  @Exclude()
  authorName?: undefined;

  @Exclude()
  wordCount?: number;

  @Exclude()
  numOfCollection?: number;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;

  @Exclude()
  category?: Category;

  @Exclude()
  latestChapter?: undefined;

  @Exclude()
  lastPublishedAt?: undefined;
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
  @IsDescription()
  description?: string;

  @IsOptional()
  @IsTags()
  tags?: string[];

  @IsOptional()
  @IsEnum(BookStatus)
  @Transform(({ value }) => value && Number(value))
  @Group(['book_status_update'])
  status?: BookStatus;
}

export class UpdateBookDto
  extends UpdateBook
  implements
    Required<Omit<Schema$Book, keyof UpdateBook>>,
    Required<Omit<Param$UpdateBook, keyof UpdateBook>> {}
