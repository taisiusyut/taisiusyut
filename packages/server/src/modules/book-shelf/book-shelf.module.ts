import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from '@/modules/book/book.module';
import { BookShelfService } from './book-shelf.service';
import { BookShelfController } from './book-shelf.controller';
import { BookShelf, BookShelfSchema } from './schemas';
import autopopulate from 'mongoose-autopopulate';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: BookShelf.name,
        useFactory: () => {
          BookShelfSchema.plugin(autopopulate);
          return BookShelfSchema;
        }
      }
    ]),
    BookModule
  ],
  controllers: [BookShelfController],
  providers: [BookShelfService],
  exports: [BookShelfService]
})
export class BookShelfModule {}
