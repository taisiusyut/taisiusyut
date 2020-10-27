import { Exclude, Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, InsertedUserSchema, Param$GetUsers } from '@/typings';
import { QueryDto } from '@/utils/mongoose';

class Excluded
  extends QueryDto
  implements Partial<Record<keyof InsertedUserSchema, unknown>> {
  @Exclude()
  id?: undefined;

  @Exclude()
  username: string;

  @Exclude()
  password: string;

  @Exclude()
  description?: string;
}

class GetUsers
  extends Excluded
  implements
    Partial<Omit<Param$GetUsers, keyof Excluded>>,
    Partial<Omit<InsertedUserSchema, keyof Excluded>> {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(Number)
  role?: UserRole;
}

export class GetUsersDto
  extends GetUsers
  implements
    Required<Omit<Param$GetUsers, keyof GetUsers>>,
    Required<Omit<InsertedUserSchema, keyof GetUsers>> {}
