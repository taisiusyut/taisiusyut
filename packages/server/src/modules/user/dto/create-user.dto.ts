import { Exclude, Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, InsertedUserSchema, InsertedCreateuser } from '@/typings';
import { IsUsername, IsPassword } from '@/decorators';

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
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(Number)
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
