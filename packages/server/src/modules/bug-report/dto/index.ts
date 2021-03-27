import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { DOMPurify } from '@/decorators';
import { Max_Bug_Report_Title, Max_Bug_Report_Description } from '@/constants';
import { BugReportStatus } from '@/typings';

export function IsTitle(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(Max_Bug_Report_Title));
}

export function IsDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsString(),
    MaxLength(Max_Bug_Report_Description),
    DOMPurify()
  );
}

export function IsBugReportStatus(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsEnum(BugReportStatus),
    Transform(({ value }) => value && Number(value))
  );
}

export * from './create-bug-report.dto';
export * from './update-bug-report.dto';
export * from './get-bug-reports.dto';
