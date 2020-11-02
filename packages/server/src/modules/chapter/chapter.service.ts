import { Document, PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { Chapter } from './schemas/chapter.schema';

@Injectable()
export class ChapterService extends MongooseCRUDService<Chapter> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: PaginateModel<Chapter & Document>
  ) {
    super(chapterModel);
  }
}
