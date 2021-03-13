import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService, PaginateModel, Document } from '@/utils/mongoose';
import { BookShelf } from './schemas';

@Injectable()
export class BookShelfService extends MongooseCRUDService<BookShelf> {
  constructor(
    @InjectModel(BookShelf.name)
    readonly bookShelfModel: PaginateModel<BookShelf & Document>
  ) {
    super(bookShelfModel);
  }
}
