import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import {
  Schema$Payment,
  Param$CreatePayment,
  PaymentStatus,
  Schema$PaymentDetails
} from '@/typings';
import { PaymentDetailsDto } from './payment-details.dto';

class Excluded implements Partial<Schema$Payment> {
  @Exclude()
  id?: undefined;

  @Exclude()
  status?: PaymentStatus;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

export class CreatePaymentDto
  implements
    Required<Omit<Schema$Payment, keyof Excluded>>,
    Required<Omit<Param$CreatePayment, keyof Excluded>> {
  @IsInt()
  price: number;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  details: Schema$PaymentDetails;
}
