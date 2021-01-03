import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsMongoId } from 'class-validator';
import {
  UserRole,
  InsertedUserSchema,
  Param$GetUsers,
  UserStatus
} from '@/typings';
import { QueryDto } from '@/utils/mongoose';
import { IsNickname, IsUserRole, IsUserStatus } from './';
import { Group } from '@/utils/access';

class Excluded
  extends QueryDto
  implements Partial<Record<keyof InsertedUserSchema, unknown>> {
  @Exclude()
  password?: string;

  @Exclude()
  description?: string;
}

class GetUsers
  extends Excluded
  implements
    Partial<Omit<Param$GetUsers, keyof Excluded>>,
    Partial<Omit<InsertedUserSchema, keyof Excluded>> {
  @IsOptional()
  @IsMongoId()
  id?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNickname()
  nickname?: string;

  @IsOptional()
  @IsUserRole()
  role?: UserRole;

  @IsOptional()
  @IsUserStatus()
  @Group(['Root', 'Admin'])
  status?: UserStatus;
}

export class GetUsersDto
  extends GetUsers
  implements
    Required<Omit<Param$GetUsers, keyof GetUsers>>,
    Required<Omit<InsertedUserSchema, keyof GetUsers>> {}
