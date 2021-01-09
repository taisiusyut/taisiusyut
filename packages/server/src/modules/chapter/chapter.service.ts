import { ObjectId } from 'mongodb';
import { Document, FilterQuery, PaginateModel } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose';
import { Chapter } from './schemas/chapter.schema';
import {
  ChapterType,
  ChapterStatus,
  JWTSignPayload,
  UserRole
} from '@/typings';

export interface GetPriceResult {
  price: number;
  count: number;
}

const toObjectId = (payload: string) =>
  (new ObjectId(payload) as unknown) as string;

const allChapterStatus = Object.values(ChapterStatus).filter(
  (v): v is ChapterStatus => typeof v === 'number'
);

const allChapterType = Object.values(ChapterType).filter(
  (v): v is ChapterType => typeof v === 'number'
);

@Injectable()
export class ChapterService extends MongooseCRUDService<Chapter> {
  readonly chapterStatus = allChapterStatus.map(status => ({ status }));
  readonly chapterTypes = allChapterType.map(type => ({ type }));

  constructor(
    @InjectModel(Chapter.name)
    readonly chapterModel: PaginateModel<Chapter & Document>
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

  async getWordCount(
    query: FilterQuery<Chapter>
  ): Promise<{ wordCount: number; numOfChapter: number } | null> {
    const [result] = await this.chapterModel
      .aggregate()
      .allowDiskUse(true)
      .match(query)
      .group({
        _id: '$book',
        numOfChapter: { $sum: 1 },
        wordCount: { $sum: '$wordCount' }
      })
      .project({
        _id: 0,
        wordCount: 1,
        numOfChapter: 1
      });
    return result || null;
  }

  getRoleBasedQuery(user?: JWTSignPayload) {
    const query: FilterQuery<Chapter> = {};
    if (!user || user.role === UserRole.Client) {
      query.status = ChapterStatus.Public;
    } else if (user.role === UserRole.Author) {
      query.$or = this.chapterStatus.map(payload =>
        payload.status === ChapterStatus.Public
          ? payload
          : { ...payload, author: user.user_id }
      );
    }
    return query;
  }
}
