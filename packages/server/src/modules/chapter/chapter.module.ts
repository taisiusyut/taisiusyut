import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseFuzzySearchingField } from 'mongoose';
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
          const fields: MongooseFuzzySearchingField<Schema$Chapter>[] = [
            { name: 'name' }
          ];

          ChapterSchema.plugin(fuzzySearch, { fields });
          // schema.plugin(autopopulate);
          ChapterSchema.plugin(paginate);

          return ChapterSchema;
        }
      }
    ])
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService]
})
export class ChapterModule {}
