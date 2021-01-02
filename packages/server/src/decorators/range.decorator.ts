import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { DateRange as IDateRange } from '@/typings';

export class MongoDateRange {
  @IsNumber()
  @IsOptional()
  $gte?: number;

  @IsNumber()
  @IsOptional()
  $lte?: number;
}

export function DateRange(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ValidateNested(),
    Type(() => MongoDateRange) as MethodDecorator,
    Transform(
      (payload: IDateRange): MongoDateRange => {
        if (Array.isArray(payload)) {
          const [$gte, $lte] = payload.map(Number);
          return { $gte, $lte };
        }
        return {};
      }
    ) as MethodDecorator
  );
}

export function NumberRannge(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    Transform((payload: [number | string, number | string]) => {
      if (Array.isArray(payload)) {
        const [$gte, $lte] = payload.map(Number);
        return { $gte, $lte };
      }
    }) as MethodDecorator
  );
}
