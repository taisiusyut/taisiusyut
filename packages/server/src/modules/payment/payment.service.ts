import { Document, FilterQuery, PaginateModel } from 'mongoose';
import {
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { ChapterStatus, ChapterType, PaymentType } from '@/typings';
import { PaymentDetailsDto } from './dto';
import { Payment } from './schemas/payment.schema';
import { Chapter } from '../chapter/schemas/chapter.schema';
import { ChapterService } from '../chapter/chapter.service';

@Injectable()
export class PaymentService extends MongooseCRUDService<Payment> {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: PaginateModel<Payment & Document>,
    @Inject(ChapterService) private readonly chapterService: ChapterService
  ) {
    super(paymentModel);
  }

  getHasPaidQuery(
    user: string,
    details: PaymentDetailsDto
  ): FilterQuery<Payment> {
    const query = {
      user,
      'details.book': details.book
    };
    return {
      $or: [
        { ...query, 'details.type': PaymentType.Book },
        {
          ...query,
          'details.chapter': details.chapter,
          'details.type': PaymentType.Chapter
        }
      ]
    };
  }

  async hasPaid(user: string, details: PaymentDetailsDto) {
    return this.exists(this.getHasPaidQuery(user, details));
  }

  async getPaidChapterIds(bookID: string): Promise<string[]> {
    return this.paymentModel
      .find({
        'details.book': bookID,
        'details.type': PaymentType.Chapter
      })
      .distinct('details.chapter');
  }

  async getPriceQuery(
    user: string,
    details: PaymentDetailsDto
  ): Promise<FilterQuery<Chapter>> {
    const priceQuery: FilterQuery<Chapter> = {
      book: details.book,
      type: ChapterType.Pay,
      status: ChapterStatus.Public,
      author: { $ne: user }
    };

    if (details.type === PaymentType.Book) {
      const paidChapters = await this.getPaidChapterIds(details.book);
      return {
        ...priceQuery,
        _id: { $nin: paidChapters }
      };
    }

    if (details.type === PaymentType.Chapter) {
      return {
        ...priceQuery,
        _id: details.chapter,
        book: details.book
      };
    }

    throw new InternalServerErrorException(
      `get price query failure, ${details.type} is not handled`
    );
  }

  async getPrice(user: string, details: PaymentDetailsDto) {
    const priceQuery = await this.getPriceQuery(user, details);
    return this.chapterService.getPrice(priceQuery);
  }
}
