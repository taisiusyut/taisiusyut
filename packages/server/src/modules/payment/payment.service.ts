import { Document, PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentService extends MongooseCRUDService<Payment> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: PaginateModel<Payment & Document>
  ) {
    super(paymentModel);
  }
}
