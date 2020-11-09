import { PaymentType } from '@/typings';
import { ValidateIf } from 'class-validator';

export const ChapterPaymentOnly = () =>
  ValidateIf(obj => obj.type === PaymentType.Chapter);

export * from './create-payment.dto';
export * from './update-payment.dto';
export * from './get-payments.dto';
export * from './payment-details.dto';
