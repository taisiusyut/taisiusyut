import { Exclude, Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, InsertedUserSchema, InsertedCreateuser } from '@/typings';
import { IsUsername, IsPassword } from '@/decorators';

const AuthorTransform = (
  ...[transform, options]: Partial<Parameters<typeof Transform>>
) => {
  return Transform((...args) => {
    const [val, raw] = args;
    return [UserRole.Author].includes(raw.role)
      ? transform
        ? transform(...args)
        : val
      : undefined;
  }, options);
};

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
  @AuthorTransform()
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
