import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
import { Max_Bug_Report_Title, Max_Bug_Report_Description } from '@/constants';

export function IsTitle(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(Max_Bug_Report_Title));
}

export function IsDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(Max_Bug_Report_Description));
}

export * from './create-bug-report.dto';
export * from './update-bug-report.dto';
export * from './get-bug-reports.dto';
