import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Req,
  Query,
  BadRequestException
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
    if (user && [UserRole.Root, UserRole.Admin].includes(user.role)) {
      throw new BadRequestException(`${user.role} should not call this api`);
    }
    const { details } = createPaymentDto;

    if (details.type === PaymentType.Book) {
      const exists = await this.bookService.exists({
        _id: details.book,
        author: { $ne: user?.user_id }
      });
      if (!exists) {
        throw new BadRequestException(`Book not found`);
      }
    }

    if (details.type === PaymentType.Chapter) {
      const exists = await this.chapterService.exists({
        _id: details.chapter,
        book: details.book,
        type: ChapterType.Pay,
        author: { $ne: user?.user_id }
      });
      if (!exists) {
        throw new BadRequestException(`Chapter not found`);
      }
    }

    return this.paymentService.create({
      ...createPaymentDto,
      user: user?.user_id
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
  findAll(@Req() { user }: FastifyRequest, @Query() query: GetPaymentsDto) {
    return this.paymentService.findAll({ ...query, user: user?.user_id });
  }
}
