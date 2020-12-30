import { IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$BugReport,
  Param$CreateBugReport,
  BugReportStatus,
  BugReportType
} from '@/typings';
import { IsTitle, IsDescription } from './index';

class Excluded implements Partial<Schema$BugReport> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class CreateBugReport extends Excluded {
  // implements
  //   Partial<Omit<Schema$BugReport, keyof Excluded>>,
  //   Partial<Omit<Param$CreateBugReport, keyof Excluded>>
}

export class CreateBugReportDto
  extends CreateBugReport
  implements
    Required<Omit<Schema$BugReport, keyof CreateBugReport>>,
    Required<Omit<Param$CreateBugReport, keyof CreateBugReport>> {
  @IsTitle()
  title: string;

  @IsDescription()
  description: string;

  @IsEnum(BugReportStatus)
  status: BugReportStatus;

  @IsEnum(BugReportType)
  type: BugReportType;
}
