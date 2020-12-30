import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from '@/modules/book/book.module';
import { ChapterModule } from '@/modules/chapter/chapter.module';
import { BookShelfService } from './book-shelf.service';
import { BookShelfController } from './book-shelf.controller';
import { BookShelfEventConsumer } from './book-shelf.event-consumer';
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
    BookModule,
    ChapterModule
  ],
  controllers: [BookShelfController],
  providers: [BookShelfService, BookShelfEventConsumer],
  exports: [BookShelfService]
})
export class BookShelfModule {}
