import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentType, InsertedPaymentDetails } from '@/typings';
import { ChapterPaymentOnly } from './';

class Excluded implements Partial<InsertedPaymentDetails> {}

class PaymentDetails
  extends Excluded
  implements Partial<Omit<InsertedPaymentDetails, keyof Excluded>> {
  @IsString()
  @IsNotEmpty()
  @ChapterPaymentOnly()
  chapter?: string;
}

export class PaymentDetailsDto
  extends PaymentDetails
  implements Required<Omit<InsertedPaymentDetails, keyof PaymentDetails>> {
  @IsOptional()
  @IsEnum(PaymentType)
  @Transform(value => value && Number(value))
  type: PaymentType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  book: string;
}
