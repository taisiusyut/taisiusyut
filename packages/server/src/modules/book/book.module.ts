import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, Query, Document, MongooseFuzzySearchingField } from 'mongoose';
import { UserModule } from '@/modules/user/user.module';
import { ChapterModule } from '@/modules/chapter/chapter.module';
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { fuzzySearch } from '@/utils/mongoose';
import { Schema$Book } from '@/typings';
import { Book, BookSchema } from './schemas/book.schema';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookEventConsumer } from './book.event-consumer';
import autopopulate from 'mongoose-autopopulate';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ChapterModule),
    MongooseModule.forFeatureAsync([
      {
        imports: [CloudinaryModule],
        inject: [CloudinaryService],
        name: Book.name,
        useFactory: async (cloudinaryService: CloudinaryService) => {
          const fields: MongooseFuzzySearchingField<Schema$Book>[] = [
            { name: 'name' },
            { name: 'authorName' },
            'tags' // FIXME: wait for mongoose-fuzzy-searching
          ];

          BookSchema.plugin(fuzzySearch, { fields });
          BookSchema.plugin(autopopulate);
          BookSchema.plugin(paginate);

          async function removeImageFromCloudinary(
            // eslint-disable-next-line
            this: Query<Book>
          ) {
            const model: Model<Book & Document> = (this as any).model;
            const book = await model.findOne(this.getFilter());
            if (book && book.cover) {
              await cloudinaryService.remove(book.cover);
            }
          }

          BookSchema.pre('deleteOne', removeImageFromCloudinary);
          BookSchema.pre(
            'findOneAndUpdate',
            // eslint-disable-next-line
            async function (this: Query<Book>) {
              const changes = this.getUpdate();
              if (changes && typeof changes !== 'undefined') {
                await removeImageFromCloudinary.call(this);
              }
            }
          );

          return BookSchema;
        }
      }
    ])
  ],
  controllers: [BookController],
  providers: [BookService, BookEventConsumer],
  exports: [BookService]
})
export class BookModule {}
