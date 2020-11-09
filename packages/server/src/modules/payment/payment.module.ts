import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from '@/modules/book/book.module';
import { ChapterModule } from '@/modules/chapter/chapter.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    BookModule,
    ChapterModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
