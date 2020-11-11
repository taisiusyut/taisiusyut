import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsMongoId,
  IsUUID
} from 'class-validator';
import { Exclude } from 'class-transformer';
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

export class CreateRefreshTokenDto
  implements
    Required<Omit<Param$CreateRefreshToken, keyof Excluded>>,
    Required<Omit<Schema$RefreshToken, keyof Excluded>> {
  @IsMongoId()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsUUID()
  refreshToken: string;
}
