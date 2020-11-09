import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  HttpCode,
  Patch,
  InternalServerErrorException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { routes } from '@/constants/routes';
import { Schema$Authenticated, UserRole } from '@/typings';
import { throwMongoError } from '@/utils/mongoose';
import { IsObjectId } from '@/decorators';
import { UserService } from '@/modules/user/user.service';
import { CreateUserDto } from '@/modules/user/dto';
import { User } from '@/modules/user/schemas/user.schema';
import { Access } from '@/guard/access.guard';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from './schemas/refreshToken.schema';
import {
  DeleteAccountDto,
  formatJWTSignPayload,
  ModifyPasswordDto
} from './dto';

export const REFRESH_TOKEN_COOKIES = 'fullstack_refresh_token';

@Access('Everyone')
@Controller(routes.auth.prefix)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  @Post(routes.auth.registration)
  registration(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.role || createUserDto.role === UserRole.Client) {
      return this.userService.create(createUserDto);
    }
    throw new BadRequestException(`"role" is not valid`);
  }

  @Post(routes.auth.login)
  @UseGuards(AuthGuard('local'))
  async login(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    const user = req.user;
    if (!user) throw new InternalServerErrorException(`User is not defined`);

    const signPayload = this.authService.signJwt(user);
    const refreshToken = uuidv4();

    try {
      await this.refreshTokenService.update(
        { user_id: user.user_id },
        { ...user, refreshToken },
        { upsert: true }
      );
    } catch (error) {
      throwMongoError(error);
    }

    const response: Schema$Authenticated = {
      ...signPayload,
      user,
      isDefaultAc: !IsObjectId(user.user_id)
    };

    return reply
      .setCookie(
        REFRESH_TOKEN_COOKIES,
        refreshToken,
        this.refreshTokenService.getCookieOpts()
      )
      .status(HttpStatus.OK)
      .send(response);
  }

  @Post(routes.auth.refresh_token)
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    const tokenFromCookies = req.cookies[REFRESH_TOKEN_COOKIES];

    if (tokenFromCookies) {
      const newRefreshToken = uuidv4();
      let refreshToken: RefreshToken | null = null;

      try {
        refreshToken = await this.refreshTokenService.update(
          { refreshToken: tokenFromCookies },
          { refreshToken: newRefreshToken }
        );
      } catch (error) {
        throwMongoError(error);
      }

      if (refreshToken) {
        const refreshTokenJson = refreshToken.toJSON();
        const signResult = this.authService.signJwt(refreshTokenJson);
        const user = formatJWTSignPayload(refreshTokenJson);
        const response: Schema$Authenticated = {
          ...signResult,
          user,
          isDefaultAc: !IsObjectId(user.user_id)
        };

        return reply
          .setCookie(
            REFRESH_TOKEN_COOKIES,
            newRefreshToken,
            this.refreshTokenService.getCookieOpts()
          )
          .status(HttpStatus.OK)
          .send(response);
      }

      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(new BadRequestException('Invalid refresh token'));
    }

    return reply
      .status(HttpStatus.UNAUTHORIZED)
      .send(new UnauthorizedException());
  }

  @Post(routes.auth.logout)
  async logout(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply
  ): Promise<FastifyReply> {
    await this.authService.logout(req.cookies[REFRESH_TOKEN_COOKIES]);

    return res
      .setCookie(REFRESH_TOKEN_COOKIES, '', {
        httpOnly: true,
        expires: new Date(0)
      })
      .status(HttpStatus.OK)
      .send('OK');
  }

  async validateUser(username: string, password: string) {
    const payload = await this.authService.validateUser(username, password);
    if (!payload) {
      throw new ForbiddenException('Invalid password');
    }
  }

  @Access('Jwt')
  @HttpCode(HttpStatus.OK)
  @Post(routes.auth.delete_account)
  async delete(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() { password }: DeleteAccountDto
  ) {
    if (!req.user)
      throw new InternalServerErrorException(`User is not defined`);

    await this.validateUser(req.user.username, password);

    await this.userService.delete({ _id: req.user.user_id });

    await this.logout(req, res);
  }

  @Access('Jwt')
  @HttpCode(HttpStatus.OK)
  @Patch(routes.auth.modify_password)
  async modifyPassword(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() { password, newPassword }: ModifyPasswordDto
  ) {
    if (!req.user)
      throw new InternalServerErrorException(`User is not defined`);

    await this.validateUser(req.user.username, password);

    await this.userService.update(
      { _id: req.user.user_id },
      { password: newPassword }
    );

    await this.logout(req, res);
  }
}
