import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Delete,
  Patch,
  HttpCode,
  UseGuards,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest, FastifyReply } from 'fastify';
import { isMongoId } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { routes } from '@/constants';
import { Schema$Authenticated, UserRole, UserStatus } from '@/typings';
import { UserService } from '@/modules/user/user.service';
import { CreateUserDto } from '@/modules/user/dto';
import { User } from '@/modules/user/schemas/user.schema';
import { throwMongoError } from '@/utils/mongoose';
import { Access } from '@/utils/access';
import { AuthService } from '../auth.service';
import { RefreshTokenService } from '../refresh-token.service';
import { RefreshToken } from '../schemas/refreshToken.schema';
import { DeleteAccountDto, ModifyPasswordDto } from '../dto';

@Controller(routes.auth.prefix)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  @Access('Everyone')
  @Post(routes.auth.registration)
  registration(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create({ ...createUserDto, role: UserRole.Client });
  }

  @Access('Everyone')
  @Post(routes.auth.login)
  @UseGuards(AuthGuard('local'))
  async login(
    @Req() { user, headers, cookies }: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    if (!user) throw new InternalServerErrorException(`user is ${user}`);

    const signResult = this.authService.signJwt(user);
    const tokenFromCookies = this.refreshTokenService.getCookie({ cookies });
    const refreshToken = tokenFromCookies || uuidv4();

    try {
      await this.refreshTokenService.findOneAndUpdate(
        { refreshToken },
        {
          ...signResult.user,
          refreshToken,
          userAgent: headers['user-agent'],
          user_id: user.user_id
        },
        { upsert: true }
      );
    } catch (error) {
      throwMongoError(error);
    }

    const response: Schema$Authenticated = {
      ...signResult
    };

    if (!isMongoId(user.user_id)) {
      response.isDefaultAc = true;
    }

    return this.refreshTokenService
      .setCookie(reply, refreshToken)
      .status(HttpStatus.OK)
      .send(response);
  }

  @Access('Everyone')
  @Post(routes.auth.refresh_token)
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    const tokenFromCookies = this.refreshTokenService.getCookie(req);

    if (tokenFromCookies) {
      const newRefreshToken = uuidv4();
      let refreshToken: RefreshToken | null = null;

      try {
        refreshToken = await this.refreshTokenService.findOneAndUpdate(
          { refreshToken: tokenFromCookies },
          { refreshToken: newRefreshToken }
        );
      } catch (error) {
        throwMongoError(error);
      }

      if (refreshToken) {
        const refreshTokenJson = refreshToken.toJSON();
        const signResult = this.authService.signJwt(refreshTokenJson);
        const response: Schema$Authenticated = {
          ...signResult,
          isDefaultAc: !isMongoId(signResult.user.user_id)
        };

        return this.refreshTokenService
          .setCookie(reply, newRefreshToken)
          .status(HttpStatus.OK)
          .send(response);
      }

      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send(new BadRequestException('invalid refresh token'));
    }

    return reply
      .status(HttpStatus.UNAUTHORIZED)
      .send(new UnauthorizedException());
  }

  @Access('Everyone')
  @Post(routes.auth.logout)
  async logout(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    await this.refreshTokenService.deleteToken(req);

    return this.refreshTokenService
      .setCookie(reply, '', {
        httpOnly: true,
        expires: new Date(0)
      })
      .status(HttpStatus.OK)
      .send('OK');
  }

  async validateUser(username: string, password: string) {
    const payload = await this.authService.validateUser(username, password);
    if (!payload) {
      throw new ForbiddenException('invalid password');
    }
  }

  @Access('delete-account')
  @HttpCode(HttpStatus.OK)
  @Delete(routes.auth.delete_account)
  async deleteAccount(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
    @Body() { password }: DeleteAccountDto
  ) {
    if (!req.user)
      throw new InternalServerErrorException(`user is ${req.user}`);

    await this.validateUser(req.user.username, password);

    await this.userService.updateOne(
      { _id: req.user.user_id },
      { status: UserStatus.Deleted }
    );

    await this.logout(req, reply);
  }

  @Access('modify-password')
  @HttpCode(HttpStatus.OK)
  @Patch(routes.auth.modify_password)
  async modifyPassword(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
    @Body() { password, newPassword }: ModifyPasswordDto
  ) {
    if (!req.user)
      throw new InternalServerErrorException(`user is ${req.user}`);

    await this.validateUser(req.user.username, password);

    await this.userService.findOneAndUpdate(
      { _id: req.user.user_id },
      { password: newPassword }
    );

    await this.logout(req, reply);
  }
}
