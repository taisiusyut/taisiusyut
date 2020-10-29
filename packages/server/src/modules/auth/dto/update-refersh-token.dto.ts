import { IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Schema$RefreshToken, Param$UpdateRefreshToken } from '@/typings';

class Excluded implements Partial<Schema$RefreshToken> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user_id?: undefined;

  @Exclude()
  username?: undefined;

  @Exclude()
  nickname?: undefined;

  @Exclude()
  role?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

export class UpdateRefreshTokenDto
  extends Excluded
  implements
    Required<Omit<Schema$RefreshToken, keyof Excluded>>,
    Required<Omit<Param$UpdateRefreshToken, keyof Excluded>> {
  @IsString()
  refreshToken: string;
}
