import { FindAndModifyWriteOpResultObject } from 'mongodb';
import {
  Document,
  PaginateModel,
  PaginateOptions,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions
} from 'mongoose';
import { nGrams } from 'mongoose-fuzzy-searching/helpers';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  PaginateResult,
  Pagination,
  Search,
  Order,
  Timestamp
} from '@/typings';
import { DateRange } from '@/decorators';
import { InternalServerErrorException } from '@nestjs/common';

export type Condition = Record<string, unknown>;

type QuerySchema = {
  [K in keyof (Pagination & Search & Timestamp)]?: unknown;
};

interface MongoDateRange {
  $gte: string;
  $lte: string;
}

class Base implements QuerySchema {
  @IsNumber()
  @IsOptional()
  @Transform(value => value && Number(value))
  pageNo?: number;

  @IsNumber()
  @IsOptional()
  @Transform(value => value && Number(value))
  pageSize?: number;

  @IsOptional()
  @Transform(value => value && JSON.parse(value))
  sort?: Order;

  @Exclude()
  condition?: Condition[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @DateRange()
  createdAt?: MongoDateRange;

  @IsOptional()
  @ValidateNested()
  @DateRange()
  updatedAt?: MongoDateRange;
}

export class QueryDto
  extends Base
  implements Required<Omit<QuerySchema, keyof Base>> {}

export const TEXT_SCORE = 'TEXT_SCORE';

export class MongooseCRUDService<T, D extends T & Document = T & Document> {
  constructor(private model: PaginateModel<D>) {}

  async create(createDto: unknown): Promise<D> {
    const created = new this.model(createDto);
    return created.save();
  }

  async delete(query: FilterQuery<D>): Promise<void> {
    await this.model.deleteOne(query);
  }

  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: QueryFindOneAndUpdateOptions & { rawResult: true; new: false }
  ): Promise<FindAndModifyWriteOpResultObject<D> | null>;
  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: QueryFindOneAndUpdateOptions & { rawResult: true; upsert: true }
  ): Promise<FindAndModifyWriteOpResultObject<D>>;
  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: QueryFindOneAndUpdateOptions & { upsert: true }
  ): Promise<D>;
  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: QueryFindOneAndUpdateOptions & { new: false; rawResult?: false }
  ): Promise<D | null>;
  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>
  ): Promise<D | null>;
  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options?: QueryFindOneAndUpdateOptions
  ): Promise<FindAndModifyWriteOpResultObject<D> | D | null> {
    return this.model.findOneAndUpdate(query, changes, {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      omitUndefined: true,
      ...options
    });
  }

  async findOne(
    query: FilterQuery<D>,
    projection: any = ''
  ): Promise<T | null> {
    return this.model.findOne(query, projection);
  }

  async findAll(query?: FilterQuery<D>): Promise<T[]> {
    return this.model.find(query || {});
  }

  async paginate(
    query: FilterQuery<D> & QueryDto = {},
    { projection, ...options }: PaginateOptions = {}
  ) {
    const {
      pageNo = 1,
      pageSize = 10,
      search,
      condition = [],
      sort = { createdAt: Order.DESC },
      ...fullMatches
    } = query;

    const [$text, $meta] = search
      ? [
          //https://github.com/VassilisPallas/mongoose-fuzzy-searching/blob/fb98625735a431e00bfd192a13be86d6ed0d2eaa/index.js#L180-L182
          { $text: { $search: nGrams(search, false, 2, false).join(' ') } },
          { [TEXT_SCORE]: { $meta: 'textScore' } }
        ]
      : [{}, {}];

    const result = await this.model.paginate(
      {
        $and: [...condition, fullMatches, $text]
      } as FilterQuery<D>,
      {
        customLabels: {
          docs: 'data',
          page: 'pageNo',
          limit: 'pageSize',
          totalDocs: 'total'
        },
        page: pageNo,
        limit: pageSize,
        sort: {
          ...$meta,
          ...(typeof sort === 'object' ? sort : {})
        },
        projection: {
          ...projection,
          ...$meta
        },
        ...options
      }
    );

    return (result as unknown) as PaginateResult<T>;
  }

  exists(query: FilterQuery<D>): Promise<boolean> {
    return this.model.exists(query);
  }

  async clear(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new InternalServerErrorException(
        `You are trying to clear production database`
      );
    }
    await this.model.deleteMany({});
  }
}
