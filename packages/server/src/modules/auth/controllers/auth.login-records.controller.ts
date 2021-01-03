import {
  Controller,
  Get,
  Post,
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { routes, REFRESH_TOKEN_COOKIES } from '@/constants';
import { Schema$LoginRecord } from '@/typings';
import { Access } from '@/utils/access';
import { RefreshTokenService } from '../refresh-token.service';

@Controller(routes.auth.prefix)
export class AuthLoginRecordsController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

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
