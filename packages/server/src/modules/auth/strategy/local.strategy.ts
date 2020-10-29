import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTSignPayload } from '@/typings';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<JWTSignPayload> {
    const payload = await this.authService.validateUser(username, password);
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
