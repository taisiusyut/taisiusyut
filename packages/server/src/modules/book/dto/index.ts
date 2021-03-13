import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength
} from 'class-validator';
import { Category } from '@/typings';
import { Max_Tags, Max_Book_Description } from '@/constants';

export function IsBookName(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty(), MaxLength(15));
}

export function IsCategory(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsEnum(Category),
    Transform(({ value }) => value && Number(value)) as MethodDecorator
  );
}

export function IsDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(Max_Book_Description));
}

export function IsTags(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsArray(),
    IsString({ each: true }),
    ArrayMaxSize(Max_Tags),
    Transform(({ value }) =>
      (Array.isArray(value) ? value : [value]).map((s: unknown) =>
        typeof s === 'string' ? s.toLowerCase() : s
      )
    ) as MethodDecorator
  );
}

export * from './create-book.dto';
export * from './update-book.dto';
export * from './get-books.dto';
