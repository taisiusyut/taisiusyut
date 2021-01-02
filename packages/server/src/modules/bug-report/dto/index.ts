import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
import {
  MAXIMUM_BUG_REPORT_TITLE,
  MAXIMUM_BUG_REPORT_DESCRIPTION
} from '@/constants';

export function IsTitle(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(MAXIMUM_BUG_REPORT_TITLE));
}

export function IsDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(MAXIMUM_BUG_REPORT_DESCRIPTION));
}

export * from './create-bug-report.dto';
export * from './update-bug-report.dto';
export * from './get-bug-reports.dto';
