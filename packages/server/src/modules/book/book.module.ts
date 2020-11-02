import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Model,
  Query,
  Schema,
  Document,
  MongooseFuzzySearchingField
} from 'mongoose';
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
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
        imports: [CloudinaryModule],
        inject: [CloudinaryService],
        name: Book.name,
        useFactory: async (cloudinaryService: CloudinaryService) => {
          const schema = BookSchema as Schema<Book>;

          const fields: MongooseFuzzySearchingField<Schema$Book>[] = [
            { name: 'name' },
            { name: 'author' },
            'tags' // FIXME: wait for mongoose-fuzzy-searching
          ];

          schema.plugin(fuzzySearch, { fields });
          schema.plugin(autopopulate);
          schema.plugin(paginate);

          async function removeImageFromCloudinary(this: Query<any>) {
            const model: Model<Book & Document> = (this as any).model;
            const book = await model.findOne(this.getFilter());
            if (book && book.cover) {
              await cloudinaryService.remove(book.cover);
            }
          }

          schema.pre('deleteOne', removeImageFromCloudinary);
          schema.pre('findOneAndUpdate', async function () {
            const changes: Partial<Book> = this.getUpdate();
            if (typeof changes !== 'undefined') {
              await removeImageFromCloudinary.call(this);
            }
          });

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
