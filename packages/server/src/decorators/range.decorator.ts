import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { DateRange as IDateRange } from '@/typings';

export interface MongoDateRange {
  $gte?: number;
  $lte?: number;
}

export function DateRange(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
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
