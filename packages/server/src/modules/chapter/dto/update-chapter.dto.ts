import { Exclude, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import {
  ChapterStatus,
  ChapterType,
  Param$UpdateChapter,
  Schema$Chapter
} from '@/typings';

class Excluded implements Partial<Schema$Chapter> {
  @Exclude()
  id?: undefined;

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
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsEnum(ChapterType)
  @Transform(Number)
  status?: ChapterStatus;

  @IsOptional()
  @IsEnum(ChapterType)
  @Transform(Number)
  type?: ChapterType;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  price?: number;
}

export class UpdateChapterDto
  extends UpdateChapter
  implements
    Required<Omit<Param$UpdateChapter, keyof UpdateChapter>>,
    Required<Omit<Schema$Chapter, keyof UpdateChapter>> {}
