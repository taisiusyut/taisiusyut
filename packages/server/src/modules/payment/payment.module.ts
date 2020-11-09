import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from '@/modules/book/book.module';
import { Schema } from 'mongoose';
import { ChapterModule } from '@/modules/chapter/chapter.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import paginate from 'mongoose-paginate-v2';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Payment.name,
        useFactory: async () => {
          const schema = PaymentSchema as Schema<Payment>;
          schema.plugin(paginate);
          return schema;
        }
      }
    ]),
    BookModule,
    ChapterModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
