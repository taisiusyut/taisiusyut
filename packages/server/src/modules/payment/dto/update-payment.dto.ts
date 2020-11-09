import { IsEnum } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { Schema$Payment, Param$UpdatePayment, PaymentStatus } from '@/typings';

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

export class UpdatePayment
  implements
    Partial<Omit<Schema$Payment, keyof Excluded>>,
    Partial<Omit<Param$UpdatePayment, keyof Excluded>> {
  @IsEnum(PaymentStatus)
  @Transform(value => value && Number(value))
  status?: PaymentStatus;
}
