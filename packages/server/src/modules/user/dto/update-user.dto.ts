import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';
import { InsertedUserSchema, InsertedUpdateuser } from '@/typings';
import { AuthorOnly } from '@/utils/access';
import { IsDescription, IsNickname } from './';

class Excluded implements Partial<Record<keyof InsertedUserSchema, unknown>> {
  @Exclude()
  id?: undefined;

  @Exclude()
  username: undefined;

  @Exclude()
  password: undefined;

  @Exclude()
  role?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateUser
  extends Excluded
  implements
    Partial<Omit<InsertedUpdateuser, keyof Excluded>>,
    Partial<Omit<InsertedUserSchema, keyof Excluded>> {
  @IsOptional()
  @IsNickname()
  nickname?: string;

  @IsOptional()
  @IsDescription()
  @AuthorOnly()
  description?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateUserDto
  extends UpdateUser
  implements
    Required<Omit<InsertedUpdateuser, keyof UpdateUser>>,
    Required<Omit<InsertedUserSchema, keyof UpdateUser>> {}
