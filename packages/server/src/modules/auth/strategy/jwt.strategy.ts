import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTSignPayload } from '@/typings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  validate(payload: JWTSignPayload): JWTSignPayload {
    return payload;
  }
}
