import { Exclude, Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import {
  ChapterStatus,
  ChapterType,
  Param$UpdateChapter,
  Schema$Chapter
} from '@/typings';
import { Group } from '@/utils/access';
import {
  IsChapterName,
  IsChapterStatus,
  IsChapterType,
  IsContent,
  IsPrice
} from './';

class Excluded implements Partial<Schema$Chapter> {
  @Exclude()
  id?: undefined;

  @Exclude()
  number?: undefined;

  @Exclude()
  author: undefined;

  @Exclude()
  book: undefined;

  @Exclude()
  bookID: undefined;

  @Exclude()
  chapterID: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateChapter
  extends Excluded
  implements
    Partial<Omit<Param$UpdateChapter, keyof Excluded>>,
    Partial<Omit<Schema$Chapter, keyof Excluded>> {
  @IsOptional()
  @IsChapterName()
  name?: string;

  @IsOptional()
  @IsContent()
  content?: string;

  @IsOptional()
  @IsChapterStatus()
  @Group(['chapter_status_update'])
  status?: ChapterStatus;

  @IsOptional()
  @IsChapterType()
  type?: ChapterType;

  @IsPrice()
  price?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(value =>
    typeof value === 'undefined' ? value : JSON.parse(value)
  )
  hasNext?: boolean;
}

export class UpdateChapterDto
  extends UpdateChapter
  implements
    Required<Omit<Param$UpdateChapter, keyof UpdateChapter>>,
    Required<Omit<Schema$Chapter, keyof UpdateChapter>> {}
