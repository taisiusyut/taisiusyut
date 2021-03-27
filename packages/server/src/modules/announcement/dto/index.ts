import { IsString, MaxLength } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { DOMPurify } from '@/decorators';
import {
  Max_Announcement_Title,
  Max_Announcement_Description
} from '@/constants';

export function IsTitle(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(Max_Announcement_Title));
}
export function IsDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsString(),
    MaxLength(Max_Announcement_Description),
    DOMPurify()
  );
}

export * from './create-announcement.dto';
export * from './get-announcements.dto';
export * from './update-announcement.dto';
