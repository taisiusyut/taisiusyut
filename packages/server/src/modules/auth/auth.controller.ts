import {
  Controller,
  Get,
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FastifyRequest, FastifyReply } from 'fastify';
import { isMongoId } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { routes } from '@/constants/routes';
import { Schema$Authenticated, Schema$LoginRecord, UserRole } from '@/typings';
import { UserService } from '@/modules/user/user.service';
import { CreateUserDto } from '@/modules/user/dto';
import { User } from '@/modules/user/schemas/user.schema';
import { throwMongoError } from '@/utils/mongoose';
import { Access, AccessPipe } from '@/utils/access';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from './schemas/refreshToken.schema';
import { DeleteAccountDto, ModifyPasswordDto, UpdateProfileDto } from './dto';
import { AuthorNameUpdateEvent } from './event';

export const REFRESH_TOKEN_COOKIES = 'fullstack_refresh_token';

@Access('Everyone')
@Controller(routes.auth.prefix)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly eventEmitter: EventEmitter2
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
    @Req() { user, headers, cookies }: FastifyRequest,
    @Res() reply: FastifyReply
  ): Promise<FastifyReply> {
    if (!user) throw new InternalServerErrorException(`user is ${user}`);

    const signResult = this.authService.signJwt(user);
    const tokenFromCookies = cookies[REFRESH_TOKEN_COOKIES];
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
      ...signResult,
      isDefaultAc: !isMongoId(user.user_id)
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
        .send(new BadRequestException('invalid refresh token'));
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
      throw new ForbiddenException('invalid password');
    }
  }

  @Access('delete-account')
  @HttpCode(HttpStatus.OK)
  @Delete(routes.auth.delete_account)
  async delete(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() { password }: DeleteAccountDto
  ) {
    if (!req.user)
      throw new InternalServerErrorException(`user is ${req.user}`);

    if (req.user.role === UserRole.Guest) throw new ForbiddenException();

    await this.validateUser(req.user.username, password);

    await this.userService.delete({ _id: req.user.user_id });

    await this.logout(req, res);
  }

  @Access('modify-password')
  @HttpCode(HttpStatus.OK)
  @Patch(routes.auth.modify_password)
  async modifyPassword(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() { password, newPassword }: ModifyPasswordDto
  ) {
    if (!req.user)
      throw new InternalServerErrorException(`user is ${req.user}`);

    if (req.user.role === UserRole.Guest) throw new ForbiddenException();

    await this.validateUser(req.user.username, password);

    const result = await this.userService.findOneAndUpdate(
      { _id: req.user.user_id },
      { password: newPassword }
    );

    if (!result) {
      throw new BadRequestException(`user not found`);
    }

    await this.logout(req, res);
  }

  @Access('Auth')
  @HttpCode(HttpStatus.OK)
  @Get(routes.auth.profile)
  getProfile(@Req() req: FastifyRequest) {
    return this.userService.findOne({ _id: req.user?.user_id });
  }

  @Access('Auth')
  @HttpCode(HttpStatus.OK)
  @Patch(routes.auth.profile)
  async updateProfile(
    @Req() req: FastifyRequest,
    @Body(AccessPipe) updateProfileDto: UpdateProfileDto
  ) {
    if (!req.user) {
      throw new BadRequestException(`user not found`);
    }

    if (req.user.role === UserRole.Guest) {
      throw new ForbiddenException();
    }

    const tokenFromCookies = req.cookies[REFRESH_TOKEN_COOKIES];

    const result = await this.userService.findOneAndUpdate(
      {
        _id: req.user.user_id,
        role: req.user.role // required for discrimination
      },
      updateProfileDto
    );

    if (!result) {
      throw new BadRequestException(`user not found`);
    }

    const nicknameHasChanged =
      updateProfileDto.nickname &&
      updateProfileDto.nickname !== req.user.nickname;

    if (nicknameHasChanged) {
      if (req.user.role === UserRole.Author) {
        this.eventEmitter.emit(
          AuthorNameUpdateEvent.name,
          new AuthorNameUpdateEvent({
            authorId: req.user.user_id,
            authorName: result.nickname
          })
        );
      }

      await this.refreshTokenService.findOneAndUpdate(
        { refreshToken: tokenFromCookies },
        { nickname: result.nickname }
      );
    }

    return result;
  }

  @Access('Auth')
  @HttpCode(HttpStatus.OK)
  @Get(routes.auth.get_login_records)
  async loginRecords(@Req() req: FastifyRequest) {
    const tokenFromCookies = req.cookies[REFRESH_TOKEN_COOKIES];

    const tokens = await this.refreshTokenService.findAll({
      user_id: req.user?.user_id
    });

    return tokens.map<Schema$LoginRecord>(data => ({
      id: data.id,
      userAgent: data.userAgent,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      current: data.refreshToken === tokenFromCookies
    }));
  }

  @Access('Auth')
  @HttpCode(HttpStatus.OK)
  @Post(routes.auth.logout_others)
  async logoutOthers(@Req() req: FastifyRequest) {
    const tokenFromCookies = req.cookies[REFRESH_TOKEN_COOKIES];

    await this.refreshTokenService.deleteMany({
      user_id: req.user?.user_id,
      refreshToken: {
        $ne: tokenFromCookies
      }
    });
  }
}
