import { IsString, IsEnum } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';
import {
  UserRole,
  Schema$RefreshToken,
  Param$CreateRefreshToken
} from '@/typings';

class Excluded implements Partial<Schema$RefreshToken> {
  @Exclude()
  id?: string;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;
}

// class CreateRefreshToken
//   extends Excluded
//   implements
//     Partial<Omit<Param$CreateRefreshToken, keyof Excluded>>,
//     Partial<Omit<Schema$RefreshToken, keyof Excluded>> {}

export class CreateRefreshTokenDto
  // extends CreateRefreshToken
  implements
    Required<Omit<Param$CreateRefreshToken, keyof Excluded>>,
    Required<Omit<Schema$RefreshToken, keyof Excluded>> {
  @IsString()
  user_id: string;

  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsEnum(UserRole)
  @Transform(Number)
  role: UserRole;

  @IsString()
  refreshToken: string;
}
