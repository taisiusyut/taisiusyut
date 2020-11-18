import {
  Injectable,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { UserRole, JWTSignPayload, JWTSignResult } from '@/typings';
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

  async validateUser(
    username: string,
    password: string
  ): Promise<JWTSignPayload> {
    const user = await this.userService.findOne({ username }, '+password');

    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      const { id: user_id, ...rest } = user.toJSON();

      if (!user_id) {
        throw new Error(
          `user_id is not defined, please check mongoose "virtual" config`
        );
      }

      if (valid) {
        return formatJWTSignPayload({
          ...rest,
          user_id,
          nickname: rest.nickname || rest.username
        });
      }

      throw new BadRequestException('incorrect Password');
    } else {
      const root = await this.userService.findOne({ role: UserRole.Root });

      if (!root) {
        const [defaultUsername, defaultPassword] = [
          this.configService.get('DEFAULT_USERNAME'),
          this.configService.get('DEFAULT_PASSWORD')
        ];

        if (username === defaultUsername && password === defaultPassword) {
          return {
            user_id: defaultUsername,
            username: defaultUsername,
            nickname: defaultUsername,
            role: UserRole.Root
          };
        }
      }
    }

    throw new BadRequestException('user not found');
  }

  signJwt(payload: JWTSignPayload): JWTSignResult {
    const now = +new Date();
    const user = formatJWTSignPayload(payload);
    const minutes = this.configService.get<number>(
      'JWT_TOKEN_EXPIRES_IN_MINUTES'
    );

    if (!minutes)
      throw new InternalServerErrorException('jwt expires not configured');

    return {
      user,
      token: this.jwtService.sign(user),
      expiry: new Date(now + minutes * 60 * 1000)
    };
  }

  async login(user: JWTSignPayload): Promise<JWTSignResult> {
    return this.signJwt(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.delete({ refreshToken });
  }
}
