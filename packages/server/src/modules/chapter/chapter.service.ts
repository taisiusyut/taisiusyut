import { ObjectId } from 'mongodb';
import { Document, FilterQuery, PaginateModel } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { Chapter } from './schemas/chapter.schema';

export interface GetPriceResult {
  price: number;
  count: number;
}

const toObjectId = (payload: string) =>
  (new ObjectId(payload) as unknown) as string;

@Injectable()
export class ChapterService extends MongooseCRUDService<Chapter> {
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: PaginateModel<Chapter & Document>
  ) {
    super(chapterModel);
  }

  async getPrice(query: FilterQuery<Chapter>) {
    let result: GetPriceResult | undefined = undefined;

    if (typeof query._id === 'string') {
      query._id = toObjectId(query._id);
    }

    if (typeof query._id === 'object' && '$nin' in query._id) {
      query._id.$nin = query._id.$nin?.map(s =>
        typeof s === 'string' ? toObjectId(s) : s
      );
    }

    const aggregate = await this.chapterModel
      .aggregate()
      .allowDiskUse(true)
      .match(query)
      .group({ _id: null, price: { $sum: '$price' }, count: { $sum: 1 } })
      .project({
        _id: 0,
        price: 1,
        count: 1
      });

    result = aggregate[0];

    if (!result) {
      throw new BadRequestException(`get price failure`);
    }

    return result;
  }
}
