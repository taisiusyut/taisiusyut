import { Exclude, Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Schema$Book, Param$GetBooks, BookStatus } from '@/typings';
import { QueryDto } from '@/utils/mongoose';
import { IsCategory, IsTags, IsTitle } from '.';
import { Group } from '@/decorators';

class Excluded
  extends QueryDto
  implements Partial<Record<keyof Schema$Book, unknown>> {
  @Exclude()
  description?: string;
}

class GetBooks
  extends Excluded
  implements
    Partial<Omit<Schema$Book, keyof Excluded>>,
    Partial<Omit<Param$GetBooks, keyof Excluded>> {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsTitle()
  title?: string;

  @IsOptional()
  @IsCategory()
  category?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsOptional()
  @IsTags()
  tags?: string[];

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsEnum(BookStatus)
  @Transform(Number)
  @Group(['Root', 'Admin', 'Author'])
  status?: BookStatus;
}

export class GetBooksDto
  extends GetBooks
  implements
    Required<Omit<Schema$Book, keyof GetBooks>>,
    Required<Omit<Param$GetBooks, keyof GetBooks>> {}
