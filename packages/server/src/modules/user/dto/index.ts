import { applyDecorators } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole, UserStatus } from '@/typings';
import { DOMPurify } from '@/decorators';
import { Max_Author_Description } from '@/constants';

export function IsNickname(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty(), MaxLength(15));
}

export function IsDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsString(),
    MaxLength(Max_Author_Description),
    DOMPurify()
  );
}

export function IsUserRole(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsEnum(UserRole));
}

export function IsUserStatus(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsEnum(UserStatus),
    Transform(({ value }) => {
      return typeof value !== 'undefined' ? Number(value) : undefined;
    }) as MethodDecorator
  );
}

export * from './create-user.dto';
export * from './update-user.dto';
export * from './get-users.dto';
