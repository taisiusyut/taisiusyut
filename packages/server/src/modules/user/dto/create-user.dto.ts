import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';
import {
  InsertedUserSchema,
  InsertedCreateuser,
  UserRole,
  UserStatus
} from '@/typings';
import { IsUsername, IsPassword } from '@/decorators';
import { AuthorOnly } from '@/utils/access';
import { IsNickname, IsDescription, IsUserRole } from './';

class Excluded implements Partial<Record<keyof InsertedUserSchema, unknown>> {
  @Exclude()
  id?: undefined;

  @Exclude()
  status?: UserStatus;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class CreateUser
  extends Excluded
  implements
    Partial<Omit<InsertedCreateuser, keyof Excluded>>,
    Partial<Omit<InsertedUserSchema, keyof Excluded>> {
  @IsOptional()
  @IsNickname()
  nickname?: string;

  @IsOptional()
  @IsDescription()
  @AuthorOnly()
  description?: string;

  @IsOptional()
  @IsUserRole()
  role?: UserRole;
}

export class CreateUserDto
  extends CreateUser
  implements
    Required<Omit<InsertedCreateuser, keyof CreateUser>>,
    Required<Omit<InsertedUserSchema, keyof CreateUser>> {
  @IsEmail()
  email: string;

  @IsUsername()
  username: string;

  @IsPassword()
  password: string;
}
