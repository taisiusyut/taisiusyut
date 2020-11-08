import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength
} from 'class-validator';
import { ChapterType, ChapterStatus } from '@/typings';

export function IsChapterName(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty(), MaxLength(15));
}

export function IsContent(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty());
}

export function IsChapterType(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsEnum(ChapterType),
    Transform(value => value && Number(value)) as MethodDecorator
  );
}

export function IsChapterStatus(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsEnum(ChapterStatus),
    Transform(value => value && Number(value)) as MethodDecorator
  );
}

export function IsPrice(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsInt(), Transform(value => value && Number(value)) as MethodDecorator);
}

export * from './create-chapter.dto';
export * from './update-chapter.dto';
export * from './get-chapters.dto';
