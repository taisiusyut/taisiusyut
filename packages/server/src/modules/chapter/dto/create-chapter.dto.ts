import { Exclude } from 'class-transformer';
import { ChapterType, Param$CreateChapter, Schema$Chapter } from '@/typings';
import { IsChapterName, IsContent, IsChapterType, IsPrice } from './';

class Excluded implements Partial<Schema$Chapter> {
  @Exclude()
  id?: undefined;

  @Exclude()
  status?: undefined;

  @Exclude()
  author?: undefined;

  @Exclude()
  book?: undefined;

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
  @IsPrice()
  price?: number;
}

export class CreateChapterDto
  extends CreateChapter
  implements
    Required<Omit<Param$CreateChapter, keyof CreateChapter>>,
    Required<Omit<Schema$Chapter, keyof CreateChapter>> {
  @IsChapterName()
  name: string;

  @IsContent()
  content: string;

  @IsChapterType()
  type: ChapterType;
}
