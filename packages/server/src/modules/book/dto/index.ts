import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export function IsDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(200));
}

export function IsTags(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsArray(),
    IsString({ each: true }),
    Transform(arr =>
      (Array.isArray(arr) ? arr : [arr]).map((s: unknown) =>
        typeof s === 'string' ? s.toLowerCase() : s
      )
    )
  );
}

export function IsTitle(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty(), MaxLength(20));
}

export function IsCategory(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty());
}

export * from './create-book.dto';
export * from './update-book.dto';
export * from './get-books.dto';
