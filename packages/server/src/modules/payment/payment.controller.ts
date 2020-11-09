import {
  Controller,
  Post,
  Body,
  Req,
  BadRequestException,
  Query
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { UserRole } from '@/typings';
import { ObjectId } from '@/decorators';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto, GetPaymentsDto } from './dto';

@Controller(routes.payment.prefix)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Access('Jwt')
  @Post(routes.payment.create_payment)
  create(
    @Req() { user }: FastifyRequest,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    if (user && [UserRole.Root, UserRole.Admin].includes(user.role)) {
      throw new BadRequestException(`${user.role} should not call this api`);
    }
    return this.paymentService.create(createPaymentDto);
  }

  @Access('Root', 'Admin')
  @Post(routes.payment.update_payment)
  update(
    @ObjectId('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentService.update({ _id: id }, updatePaymentDto);
  }

  @Access('Jwt')
  @Post(routes.payment.get_payments)
  findAll(@Req() req: FastifyRequest, @Query() query: GetPaymentsDto) {
    return this.paymentService.findAll({ ...query, user: req.user?.user_id });
  }
}
