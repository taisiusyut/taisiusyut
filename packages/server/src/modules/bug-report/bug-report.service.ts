import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { MongooseCRUDService, PaginateModel, Document } from '@/utils/mongoose';
import { BugReportStatus, JWTSignPayload, UserRole } from '@/typings';
import { BugReport } from './schemas';

@Injectable()
export class BugReportService extends MongooseCRUDService<BugReport> {
  constructor(
    @InjectModel(BugReport.name)
    readonly bugReportModel: PaginateModel<BugReport & Document>
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

  getBugReportStatus(status: BugReportStatus) {
    if (status === BugReportStatus.Open || status === BugReportStatus.Closed) {
      return [BugReportStatus.Open, BugReportStatus.Closed];
    }
    if (status === BugReportStatus.Fixed) {
      return [
        BugReportStatus.Open,
        BugReportStatus.Fixed,
        BugReportStatus.Closed
      ];
    }
    return [];
  }
}
