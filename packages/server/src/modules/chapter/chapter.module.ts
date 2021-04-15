import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseFuzzySearchingField } from 'mongoose';
import { BookModule } from '@/modules/book/book.module';
import { UserModule } from '@/modules/user/user.module';
import { fuzzySearch } from '@/utils/mongoose';
import { Schema$Chapter } from '@/typings';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    forwardRef(() => BookModule),
    forwardRef(() => UserModule),
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
