import { MongooseCRUDService } from '@/utils/mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Document, FilterQuery } from 'mongoose';
import { JWTSignPayload, UserRole } from '@/typings';
import { BugReport } from './schemas';

@Injectable()
export class BugReportService extends MongooseCRUDService<BugReport> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    @InjectModel(BugReport.name)
    bugReportModel: PaginateModel<BugReport & Document>
  ) {
    super(bugReportModel);
  }

  getRoleBasedQuery(
    user?: JWTSignPayload,
    defaultQuery?: FilterQuery<BugReport>
  ) {
    const query: FilterQuery<BugReport> = { ...defaultQuery };

    if (!user) {
      delete query.user;
    } else if (user.role === UserRole.Author || user.role === UserRole.Client) {
      query.user = user?.user_id;
    }
    return query;
  }
}
