import { Aggregate, Document, PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schema$Category, Schema$Tags } from '@/typings';
import { MongooseCRUDService } from '@/utils/mongoose';
import { Book } from './schemas/book.schema';

@Injectable()
export class BookService extends MongooseCRUDService<Book> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: PaginateModel<Book & Document>
  ) {
    super(bookModel);
  }

  categories(): Aggregate<Schema$Category[]> {
    return this.bookModel
      .aggregate()
      .allowDiskUse(true)
      .group({ _id: '$category', total: { $sum: 1 } })
      .project({
        _id: 0,
        category: '$_id',
        total: 1
      });
  }

  tags(): Aggregate<Schema$Tags[]> {
    return this.bookModel
      .aggregate()
      .allowDiskUse(true)
      .unwind('$tags')
      .group({ _id: '$tags', total: { $sum: 1 } })
      .project({
        _id: 0,
        tag: '$_id',
        total: 1
      });
  }
}
