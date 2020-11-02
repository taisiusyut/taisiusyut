import { Exclude, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChapterType, Param$CreateChapter, Schema$Chapter } from '@/typings';

class Excluded implements Partial<Schema$Chapter> {
  @Exclude()
  id?: undefined;

  @Exclude()
  status?: undefined;

  @Exclude()
  bookID?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class CreateChapter
  extends Excluded
  implements
    Partial<Omit<Param$CreateChapter, keyof Excluded>>,
    Partial<Omit<Schema$Chapter, keyof Excluded>> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(ChapterType)
  @Transform(Number)
  type: ChapterType;

  @IsNumber()
  @Transform(Number)
  price: number;
}

export class CreateChapterDto
  extends CreateChapter
  implements
    Required<Omit<Param$CreateChapter, keyof CreateChapter>>,
    Required<Omit<Schema$Chapter, keyof CreateChapter>> {}
