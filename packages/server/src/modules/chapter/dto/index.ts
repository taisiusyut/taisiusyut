import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Max,
  Min,
  ValidateIf
} from 'class-validator';
import { ChapterType, ChapterStatus } from '@/typings';
import { Max_Chapter_Name } from '@/constants';

export function IsChapterName(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty(), MaxLength(Max_Chapter_Name));
}

export function IsContent(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty());
}

export function IsChapterType(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsEnum(ChapterType),
    Transform(({ value }) => value && Number(value)) as MethodDecorator
  );
}

export function IsChapterStatus(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsEnum(ChapterStatus),
    Transform(({ value }) => value && Number(value)) as MethodDecorator
  );
}

export function IsPrice(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ValidateIf(o => o.type === ChapterType.Pay),
    IsInt(),
    Min(0),
    Max(10),
    Transform(({ value }) => value && Number(value)) as MethodDecorator
  );
}

export * from './create-chapter.dto';
export * from './update-chapter.dto';
export * from './get-chapters.dto';
