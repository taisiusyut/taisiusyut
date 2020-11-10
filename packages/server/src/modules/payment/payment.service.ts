import { Document, PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { Payment } from './schemas/payment.schema';
import { PaymentType } from '@/typings';

@Injectable()
export class PaymentService extends MongooseCRUDService<Payment> {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: PaginateModel<Payment & Document>
  ) {
    super(paymentModel);
  }

  async getPaidChapterIds(bookID: string): Promise<string[]> {
    return this.paymentModel
      .find({
        'details.book': bookID,
        'details.type': PaymentType.Chapter
      })
      .distinct('details.chapter');
  }
}
