import { ObjectID } from 'mongodb';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import { Pagination, Search, Order, Timestamp } from '@/typings';
import { DateRange } from '@/decorators';

export type Condition = Record<string, unknown>;

type QuerySchema = {
  [K in keyof (Pagination & Search & Timestamp)]?: unknown;
};

interface MongoDateRange {
  $gte: string;
  $lte: string;
}

class Base implements QuerySchema {
  // for typings
  _id?: string | ObjectID;

  @IsNumber()
  @IsOptional()
  @Transform(value => value && Number(value))
  pageNo?: number;

  @IsNumber()
  @IsOptional()
  @Transform(value => value && Number(value))
  pageSize?: number;

  @IsOptional()
  @Transform(value => {
    // try catch for `access.pipe.ts`
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  sort?: Record<string, Order>;

  @Exclude()
  condition?: Condition[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @DateRange()
  createdAt?: number | MongoDateRange;

  @IsOptional()
  @ValidateNested()
  @DateRange()
  updatedAt?: number | MongoDateRange;
}

export class QueryDto
  extends Base
  implements Required<Omit<QuerySchema, keyof Base>> {}
