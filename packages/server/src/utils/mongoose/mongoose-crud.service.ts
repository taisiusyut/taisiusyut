import { FindAndModifyWriteOpResultObject } from 'mongodb';
import {
  Document,
  PaginateModel,
  PaginateOptions,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryFindOptions,
  QueryFindBaseOptions,
  ModelUpdateOptions
} from 'mongoose';
import { nGrams } from 'mongoose-fuzzy-searching/helpers';
import { PaginateResult, Order } from '@/typings';
import { InternalServerErrorException } from '@nestjs/common';
import { QueryDto } from './mongoose-query.dto';

export const TEXT_SCORE = 'TEXT_SCORE';

export type Model<T> = PaginateModel<T & Document>;

export abstract class MongooseCRUDService<
  T,
  D extends T & Document = T & Document
> {
  constructor(private readonly model: PaginateModel<D>) {}

  async create(createDto: Partial<Omit<T, '_id' | 'toJSON'>>): Promise<D> {
    const created = new this.model(createDto);
    return created.save();
  }

  async delete(query: FilterQuery<D>): Promise<void> {
    await this.model.deleteOne(query);
  }

  async deleteMany(query: FilterQuery<D>): Promise<void> {
    await this.model.deleteMany(query);
  }

  async findOneAndUpdate(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: QueryFindOneAndUpdateOptions & { rawResult: true; new: false }
  ): Promise<FindAndModifyWriteOpResultObject<D> | null>;
  async findOneAndUpdate(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: QueryFindOneAndUpdateOptions & { rawResult: true; upsert: true }
  ): Promise<FindAndModifyWriteOpResultObject<D>>;
  async findOneAndUpdate(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: QueryFindOneAndUpdateOptions & { upsert: true }
  ): Promise<D>;
  async findOneAndUpdate(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: QueryFindOneAndUpdateOptions & { new: false; rawResult?: false }
  ): Promise<D | null>;
  async findOneAndUpdate(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>
  ): Promise<D | null>;
  async findOneAndUpdate(
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

  updateOne(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: ModelUpdateOptions = {}
  ) {
    return this.model.updateOne(query, changes, {
      runValidators: true,
      setDefaultsOnInsert: true,
      omitUndefined: true,
      ...options
    });
  }

  updateMany(
    query: FilterQuery<D>,
    changes: UpdateQuery<D>,
    options: ModelUpdateOptions = {}
  ) {
    return this.model.updateMany(query, changes, options);
  }

  async findOne(
    query: FilterQuery<D>,
    options: QueryFindBaseOptions = {},
    projection: any = ''
  ): Promise<D | null> {
    return this.model.findOne(query, projection, options);
  }

  async findAll(
    query: FilterQuery<D> = {},
    projection: any | null = null,
    options: QueryFindOptions = {}
  ): Promise<D[]> {
    return this.model.find(query, projection, options);
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

    if (fullMatches.id) {
      (fullMatches as FilterQuery<D>)._id = fullMatches.id;
      delete fullMatches.id;
    }

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

    return (result as unknown) as PaginateResult<D>;
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

  async countDocuments(query: FilterQuery<D> = {}): Promise<number> {
    return this.model.countDocuments(query);
  }
}
