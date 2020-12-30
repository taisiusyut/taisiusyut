import { Exclude, Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsMongoId } from 'class-validator';
import {
  Schema$BugReport,
  Param$GetBugReports,
  BugReportStatus,
  BugReportType
} from '@/typings';
import { QueryDto } from '@/utils/mongoose';

class Excluded
  extends QueryDto
  implements Partial<Record<keyof Schema$BugReport, unknown>> {
  @Exclude()
  description: undefined;
}

class GetBugReports
  extends Excluded
  implements
    Partial<Omit<Param$GetBugReports, keyof Excluded>>,
    Partial<Omit<Record<keyof Schema$BugReport, unknown>, keyof Excluded>> {
  @IsOptional()
  @IsMongoId()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsEnum(BugReportStatus)
  @Transform(value => value && Number(value))
  status?: BugReportStatus;

  @IsOptional()
  @IsEnum(BugReportStatus)
  @Transform(value => value && Number(value))
  type?: BugReportType;
}

export class GetBugReportsDto
  extends GetBugReports
  implements
    Required<Omit<Schema$BugReport, keyof GetBugReports>>,
    Required<Omit<Param$GetBugReports, keyof GetBugReports>> {}
