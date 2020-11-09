import { applyDecorators } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserRole } from '@/typings';

export function IsNickname(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), IsNotEmpty(), MaxLength(15));
}

export function IsDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsString(), MaxLength(100));
}

export function IsUserRole(): ReturnType<typeof applyDecorators> {
  return applyDecorators(IsEnum(UserRole));
}

export * from './create-user.dto';
export * from './update-user.dto';
export * from './get-users.dto';
