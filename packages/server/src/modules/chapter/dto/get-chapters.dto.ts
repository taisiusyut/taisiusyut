import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
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
  id?: undefined;

  @Exclude()
  bookID?: undefined;

  @Exclude()
  name?: undefined;

  @Exclude()
  content?: undefined;
}

class GetChapters
  extends Excluded
  implements
    Partial<Omit<Param$GetChapters, keyof Excluded>>,
    Partial<Omit<Schema$Chapter, keyof Excluded>> {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  book?: string;

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
}

export class GetChaptersDto
  extends GetChapters
  implements
    Required<Omit<Param$GetChapters, keyof GetChapters>>,
    Required<Omit<Schema$Chapter, keyof GetChapters>> {}
