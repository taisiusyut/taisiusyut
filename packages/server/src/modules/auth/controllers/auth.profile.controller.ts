import {
  Controller,
  Get,
  Body,
  Req,
  Patch,
  HttpCode,
  HttpStatus,
  InternalServerErrorException
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FastifyRequest } from 'fastify';
import { routes, REFRESH_TOKEN_COOKIES } from '@/constants';
import { UserRole } from '@/typings';
import { UserService } from '@/modules/user/user.service';
import { Access, AccessPipe } from '@/utils/access';
import { RefreshTokenService } from '../refresh-token.service';
import { UpdateProfileDto } from '../dto';
import { AuthorNameUpdateEvent } from '../event';

@Controller(routes.auth.prefix)
export class AuthProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly eventEmitter: EventEmitter2
  ) {}

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
      throw new InternalServerErrorException(`user not found`);
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
      throw new InternalServerErrorException(`user not found`);
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
}
