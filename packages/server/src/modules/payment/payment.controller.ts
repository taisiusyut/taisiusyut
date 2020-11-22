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
import { BookService } from '@/modules/book/book.service';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { UserRole } from '@/typings';
import { ObjectId } from '@/decorators';
import { AccessPipe } from '@/pipe';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  GetPaymentsDto,
  PaymentDetailsDto
} from './dto';

@Controller(routes.payment.prefix)
export class PaymentController {
  constructor(
    private readonly bookService: BookService,
    private readonly paymentService: PaymentService
  ) {}

  @Access('payment_create')
  @Post(routes.payment.create_payment)
  async create(
    @Req() { user }: FastifyRequest,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    if (!user) {
      throw new InternalServerErrorException(`user is ${user}`);
    }

    const details = createPaymentDto.details as PaymentDetailsDto;

    const { price } = await this.paymentService.getPrice(user.user_id, details);

    const hasPaidQuery = this.paymentService.getHasPaidQuery(
      user.user_id,
      details
    );

    const result = await this.paymentService.update(
      hasPaidQuery,
      {
        ...createPaymentDto,
        price,
        user: user.user_id
      },
      {
        upsert: true,
        rawResult: true
      }
    );

    // TODO: handle updatedAt?
    if (result.lastErrorObject.updatedExisting) {
      throw new BadRequestException('existing');
    }

    return result.value;
  }

  @Access('payment_update')
  @Patch(routes.payment.update_payment)
  update(
    @ObjectId('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    const payment = this.paymentService.update({ _id: id }, updatePaymentDto);
    if (!payment) {
      throw new BadRequestException(`payment not found`);
    }
    return payment;
  }

  @Access('Auth')
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
