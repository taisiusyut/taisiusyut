import { IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import {
  Schema$Payment,
  Param$GetPayments,
  PaymentStatus,
  PaymentType
} from '@/typings';
import { Group } from '@/utils/access';
import { QueryDto } from '@/utils/mongoose';

class Excluded extends QueryDto implements Partial<Schema$Payment> {
  @Exclude()
  id?: undefined;

  @Exclude()
  details?: undefined;

  @Exclude()
  price: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

export class GetPayments
  extends Excluded
  implements
    Partial<Omit<Schema$Payment, keyof Excluded>>,
    Partial<Omit<Param$GetPayments, keyof Excluded>> {
  @IsOptional()
  @IsMongoId()
  @Group(['payment_get_by_user'])
  user?: string;

  @IsOptional()
  @IsEnum(PaymentType)
  @Transform(value => value && Number(value))
  type?: PaymentType;

  @IsOptional()
  @IsMongoId()
  book?: string;

  @Exclude()
  'details.type'?: PaymentType;

  @Exclude()
  'details.book'?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  @Transform(value => value && Number(value))
  status?: PaymentStatus;
}

export class GetPaymentsDto
  extends GetPayments
  implements
    Required<Omit<Schema$Payment, keyof GetPayments>>,
    Required<Omit<Param$GetPayments, keyof GetPayments>> {}
