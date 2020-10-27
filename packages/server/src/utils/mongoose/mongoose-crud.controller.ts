import { Document, FilterQuery, UpdateQuery } from 'mongoose';
import {
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  NotFoundException
} from '@nestjs/common';
import { PaginateResult } from '@/typings';
import { ObjectId } from '@/decorators';
import {
  MongooseCRUDService,
  QueryDto,
  Condition
} from './mongoose-crud.service';

export { PaginateResult, QueryDto, ObjectId, Condition };

export class MongooseCRUDController<T, D extends T & Document = T & Document> {
  constructor(private readonly service: MongooseCRUDService<T, D>) {}

  @Get()
  async getAll(
    @Query() query: FilterQuery<T> & QueryDto,
    ..._args: unknown[]
  ): Promise<PaginateResult<T>> {
    return this.service.paginate(query);
  }

  @Post()
  async create(@Body() createDto: unknown, ..._args: unknown[]): Promise<T> {
    return this.service.create(createDto);
  }

  @Get(':id')
  async get(@ObjectId() id: string): Promise<T> {
    const result = await this.service.findOne({ _id: id } as FilterQuery<D>);
    if (result) {
      return result;
    }
    throw new NotFoundException();
  }

  @Patch(':id')
  async update(
    @ObjectId() id: string,
    @Body() changes: UpdateQuery<D>,
    ..._args: unknown[]
  ): Promise<T> {
    return this.service.update({ _id: id } as any, changes);
  }

  @Delete(':id')
  async delete(@ObjectId() id: string): Promise<void> {
    await this.service.delete({ _id: id } as FilterQuery<D>);
  }
}
