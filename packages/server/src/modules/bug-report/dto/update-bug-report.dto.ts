import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  Schema$BugReport,
  Param$UpdateBugReport,
  BugReportStatus,
  BugReportType
} from '@/typings';
import { IsTitle, IsDescription } from './index';
import { Group } from '@/utils/access';

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

class UpdateBugReport
  extends Excluded
  implements
    Partial<Omit<Schema$BugReport, keyof Excluded>>,
    Partial<Omit<Param$UpdateBugReport, keyof Excluded>> {
  @IsTitle()
  @IsOptional()
  title?: string;

  @IsDescription()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  @Group(['Root', 'Admin'])
  version?: string;

  @IsEnum(BugReportStatus)
  @IsOptional()
  @Group(['Root', 'Admin'])
  status?: BugReportStatus;

  @IsEnum(BugReportType)
  @IsOptional()
  type?: BugReportType;
}

export class UpdateBugReportDto
  extends UpdateBugReport
  implements
    Required<Omit<Schema$BugReport, keyof UpdateBugReport>>,
    Required<Omit<Param$UpdateBugReport, keyof UpdateBugReport>> {}
