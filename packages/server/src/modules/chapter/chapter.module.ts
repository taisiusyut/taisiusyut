import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema, MongooseFuzzySearchingField } from 'mongoose';
import { fuzzySearch } from '@/utils/mongoose';
import { Schema$Chapter } from '@/typings';
import { BookModule } from '@/modules/book/book.module';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    BookModule,
    MongooseModule.forFeatureAsync([
      {
        name: Chapter.name,
        useFactory: async () => {
          const schema = ChapterSchema as Schema<Chapter>;

          const fields: MongooseFuzzySearchingField<Schema$Chapter>[] = [
            { name: 'name' }
          ];

          schema.plugin(fuzzySearch, { fields });
          // schema.plugin(autopopulate);
          schema.plugin(paginate);

          return schema;
        }
      }
    ])
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService]
})
export class ChapterModule {}
