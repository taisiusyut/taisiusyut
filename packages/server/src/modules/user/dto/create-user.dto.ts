import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';
import { UserRole, InsertedUserSchema, InsertedCreateuser } from '@/typings';
import { IsUsername, IsPassword, AuthorOnly } from '@/decorators';
import { IsNickname, IsDescription, IsUserRole } from './';

class Excluded implements Partial<Record<keyof InsertedUserSchema, unknown>> {
  @Exclude()
  id?: undefined;

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
