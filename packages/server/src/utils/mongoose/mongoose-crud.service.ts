import { BadRequestException } from '@nestjs/common';
import {
  Document,
  PaginateModel,
  PaginateOptions,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  MongooseFilterQuery
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
import { DateRannge } from '@/decorators';

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
  @Transform(Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(Number)
  size?: number;

  @IsOptional()
  sort?: Pagination['sort'];

  @Exclude()
  condition?: Condition[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @DateRannge()
  createdAt?: MongoDateRange;

  @IsOptional()
  @ValidateNested()
  @DateRannge()
  updatedAt?: MongoDateRange;
}

export class QueryDto
  extends Base
  implements Required<Omit<QuerySchema, keyof Base>> {}

export const TEXT_SCORE = 'TEXT_SCORE';

export class MongooseCRUDService<T, D extends T & Document = T & Document> {
  constructor(private model: PaginateModel<D>) {}

  async create(createDto: unknown): Promise<T> {
    const created = new this.model(createDto);
    return created.save();
  }

  async delete(query: FilterQuery<D>): Promise<void> {
    await this.model.deleteOne(query);
  }

  async update(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options?: QueryFindOneAndUpdateOptions
  ): Promise<T> {
    return this.model
      .findOneAndUpdate(query, changes, { ...options, new: true })
      .then(model => {
        if (model) {
          return model.toJSON();
        }
        throw new BadRequestException('Data not found');
      });
  }

  async findOne(
    query: FilterQuery<T>,
    projection: any = ''
  ): Promise<T | null> {
    // remove undefined fields
    const payload = JSON.parse(JSON.stringify(query));
    return this.model.findOne(payload, projection);
  }

  async findAll(query?: FilterQuery<D>): Promise<T[]> {
    return this.model.find(query || {}).exec();
  }

  async paginate(
    query: FilterQuery<T> & QueryDto = {},
    { projection, ...options }: PaginateOptions = {}
  ) {
    const {
      page = 1,
      size = 10,
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
      } as MongooseFilterQuery<unknown>,
      {
        customLabels: { docs: 'data', totalDocs: 'total' },
        page,
        limit: size,
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

  async clear(): Promise<void> {
    await this.model.deleteMany({});
  }
}
