import { Exclude, Transform } from 'class-transformer';
import { IsOptional, IsMongoId, IsString, IsBoolean } from 'class-validator';
import {
  ChapterStatus,
  ChapterType,
  Schema$Chapter,
  Param$GetChapters
} from '@/typings';
import { QueryDto } from '@/utils/mongoose';
import { IsChapterStatus, IsChapterType, IsPrice } from './';
import { Group } from '@/decorators';

class Excluded
  extends QueryDto
  implements Partial<Record<keyof Schema$Chapter, unknown>> {
  @Exclude()
  number?: undefined;

  @Exclude()
  content?: undefined;

  @Exclude()
  author?: string;

  @Exclude()
  book?: undefined;
}

class GetChapters
  extends Excluded
  implements
    Partial<Omit<Param$GetChapters, keyof Excluded>>,
    Partial<Omit<Schema$Chapter, keyof Excluded>> {
  @IsOptional()
  @IsMongoId()
  id?: string;

  @IsOptional()
  @IsMongoId()
  bookID?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsChapterStatus()
  @Group(['Root', 'Admin', 'Author'])
  status?: ChapterStatus;

  @IsOptional()
  @IsChapterType()
  type?: ChapterType;

  @IsOptional()
  @IsPrice()
  price?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(value => value && JSON.parse(value))
  timestamp?: boolean;
}

export class GetChaptersDto
  extends GetChapters
  implements
    Required<Omit<Param$GetChapters, keyof GetChapters>>,
    Required<Omit<Schema$Chapter, keyof GetChapters>> {}
