import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Req,
  Query,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { ChapterType, PaymentType, UserRole } from '@/typings';
import { ObjectId } from '@/decorators';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto, GetPaymentsDto } from './dto';
import { BookService } from '../book/book.service';
import { ChapterService } from '../chapter/chapter.service';
import { AccessPipe } from '@/pipe';

@Controller(routes.payment.prefix)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly bookService: BookService,
    private readonly chapterService: ChapterService
  ) {}

  @Access('Jwt')
  @Post(routes.payment.create_payment)
  async create(
    @Req() { user }: FastifyRequest,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    if (!user) {
      throw new InternalServerErrorException(`user is not defined`);
    }

    if ([UserRole.Root, UserRole.Admin].includes(user.role)) {
      throw new BadRequestException(`${user.role} should not call this api`);
    }
    const { details } = createPaymentDto;
    let valid = true;

    if (details.type === PaymentType.Book) {
      valid = await this.bookService.exists({
        _id: details.book,
        author: { $ne: user.user_id }
      });
    }

    if (details.type === PaymentType.Chapter) {
      valid = await this.chapterService.exists({
        _id: details.chapter,
        book: details.book,
        type: ChapterType.Pay,
        author: { $ne: user.user_id }
      });
    }

    if (!valid) {
      throw new BadRequestException(`Not match data found`);
    }

    // mongoose unique index cannot cover all the situation, so need to handle here
    const bookHaPaid = await this.paymentService.exists({
      user: user.user_id,
      'details.type': PaymentType.Book,
      'details.book': details.book
    });

    if (bookHaPaid) {
      throw new BadRequestException(`The book have been paid`);
    }

    if (details.type === PaymentType.Chapter) {
      const chapterHasPaid = await this.paymentService.exists({
        user: user.user_id,
        'details.type': PaymentType.Chapter,
        'details.book': details.book,
        'details.chapter': details.chapter
      });

      if (chapterHasPaid) {
        throw new BadRequestException(`The chapter have been paid`);
      }
    }

    return this.paymentService.create({
      ...createPaymentDto,
      user: user.user_id
    });
  }

  @Access('Root', 'Admin')
  @Patch(routes.payment.update_payment)
  update(
    @ObjectId('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentService.update({ _id: id }, updatePaymentDto);
  }

  @Access('Jwt')
  @Get(routes.payment.get_payments)
  findAll(
    @Req() { user }: FastifyRequest,
    @Query(AccessPipe) query: GetPaymentsDto
  ) {
    if (!user) {
      throw new InternalServerErrorException(`user is not defined`);
    }

    // expect root and admin, user can only get its payments
    if (![UserRole.Root, UserRole.Admin].includes(user.role)) {
      query.user = user.user_id;
    }

    /** TODO: wait for class-transformer update and use @Expose */
    if (query.book) {
      query['details.book'] = query.book;
      delete query.book;
    }

    if (query.type) {
      query['details.type'] = query.type;
      delete query.type;
    }

    return this.paymentService.paginate(query);
  }
}
