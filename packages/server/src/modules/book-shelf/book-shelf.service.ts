import { MongooseCRUDService } from '@/utils/mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Document } from 'mongoose';
import { BookShelf } from './schemas';

@Injectable()
export class BookShelfService extends MongooseCRUDService<BookShelf> {
  // eslint-disable-next-line
  constructor(
    @InjectModel(BookShelf.name)
    bookShelfModel: PaginateModel<BookShelf & Document>
  ) {
    super(bookShelfModel);
  }
}
