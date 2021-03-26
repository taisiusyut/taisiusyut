import { classToPlain, Expose } from 'class-transformer';
import { JWTSignPayload, UserRole } from '@/typings';

export class JWTSignDto implements JWTSignPayload {
  @Expose()
  user_id: string;

  @Expose()
  username: string;

  @Expose()
  nickname: string;

  @Expose()
  role: UserRole;

  constructor(payload: Partial<JWTSignDto>) {
    Object.assign(this, payload);
  }
}

export const formatJWTSignPayload = <T extends JWTSignPayload>(payload: T) =>
  classToPlain(new JWTSignDto(payload), {
    strategy: 'excludeAll'
  }) as JWTSignPayload;
