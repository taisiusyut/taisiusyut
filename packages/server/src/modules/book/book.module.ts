import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema, MongooseFuzzySearchingField } from 'mongoose';
import { fuzzySearch } from '@/utils/mongoose';
import { Schema$Book } from '@/typings';
import { Book, BookSchema } from './schemas/book.schema';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import autopopulate from 'mongoose-autopopulate';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Book.name,
        useFactory: async () => {
          const schema = BookSchema as Schema<Book>;

          const fields: MongooseFuzzySearchingField<Schema$Book>[] = [
            { name: 'name' },
            { name: 'author' },
            { name: 'category' },
            'tags' // FIXME: wait for mongoose-fuzzy-searching
          ];

          schema.plugin(fuzzySearch, { fields });
          schema.plugin(autopopulate);
          schema.plugin(paginate);

          return schema;
        }
      }
    ])
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService]
})
export class BookModule {}
