import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole, JWTSignPayload, JWTSignResult } from '@/typings';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from './refresh-token.service';
import { formatJWTSignPayload } from './dto/jwt-sign.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService
  ) {}

  async validateUser(username: string, pass: string): Promise<JWTSignPayload> {
    const user = await this.userService.findOne({ username }, '+password');

    if (user) {
      const valid = await bcrypt.compare(pass, user.password);
      const { id: user_id, ...rest } = user.toJSON();

      if (valid) {
        return formatJWTSignPayload({
          ...rest,
          user_id,
          nickname: rest.username
        });
      }

      throw new BadRequestException('Incorrect Password');
    } else {
      const root = await this.userService.findOne({ role: UserRole.Root });

      if (!root) {
        const [defaultUsername, defaultPassword] = [
          this.configService.get('DEFAULT_USERNAME'),
          this.configService.get('DEFAULT_PASSWORD')
        ];

        if (username === defaultUsername && pass === defaultPassword) {
          return {
            user_id: defaultUsername,
            username: defaultUsername,
            nickname: defaultUsername,
            role: UserRole.Root
          };
        }
      }
    }

    throw new BadRequestException('User Not Found');
  }

  signJwt(payload: JWTSignPayload): JWTSignResult {
    const now = +new Date();
    const signPayload = formatJWTSignPayload(payload);
    return {
      token: this.jwtService.sign(signPayload),
      expiry: new Date(
        now +
          this.configService.get<number>('JWT_TOKEN_EXPIRES_IN_MINUTES') *
            60 *
            1000
      )
    };
  }

  async login(user: JWTSignPayload): Promise<JWTSignResult> {
    return this.signJwt(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.delete({ refreshToken });
  }
}
