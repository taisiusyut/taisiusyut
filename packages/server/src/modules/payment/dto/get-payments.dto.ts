import { IsEnum } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import {
  Schema$Payment,
  Param$GetPayments,
  PaymentStatus,
  PaymentType
} from '@/typings';

class Excluded implements Partial<Schema$Payment> {
  @Exclude()
  id?: undefined;

  @Exclude()
  details?: undefined;

  @Exclude()
  price: undefined;

  @Exclude()
  user: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

export class GetPayments
  implements
    Partial<Omit<Schema$Payment, keyof Excluded>>,
    Partial<Omit<Param$GetPayments, keyof Excluded>> {
  @IsEnum(PaymentType)
  @Transform(value => value && Number(value))
  type?: PaymentType;

  @IsEnum(PaymentStatus)
  @Transform(value => value && Number(value))
  status?: PaymentStatus;
}
