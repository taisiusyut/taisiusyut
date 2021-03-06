import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@/config';
import { FastifyRequest, FastifyReply } from 'fastify';
import { CookieSerializeOptions } from 'fastify-cookie';
import { MongooseCRUDService, PaginateModel, Document } from '@/utils/mongoose';
import { RefreshToken } from './schemas/refreshToken.schema';

export const REFRESH_TOKEN_COOKIES = 'taisiusyut_refresh_token';

@Injectable()
export class RefreshTokenService extends MongooseCRUDService<RefreshToken> {
  constructor(
    @InjectModel(RefreshToken.name)
    readonly refreshTokenModel: PaginateModel<RefreshToken & Document>,
    private readonly configService: ConfigService
  ) {
    super(refreshTokenModel);

    const index: keyof RefreshToken = 'updatedAt';
    const num = 1;
    async function init() {
      try {
        await refreshTokenModel.collection.dropIndex(`${index}_${num}`);
      } catch (error) {}

      await refreshTokenModel.collection.createIndex(
        { [index]: num },
        {
          expireAfterSeconds:
            configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_MINUTES', 0) *
            60
        }
      );
    }

    init();
  }

  getCookieOpts(
    options?: Partial<CookieSerializeOptions>
  ): CookieSerializeOptions {
    const minutes = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRES_IN_MINUTES'
    );

    if (!minutes)
      throw new InternalServerErrorException(
        `refresh token expires is not defined`
      );

    return {
      path: '/',
      signed: true,
      sameSite: true,
      httpOnly: true,
      maxAge: minutes * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      ...options
    };
  }

  getCookie(req: FastifyRequest) {
    const value = req.cookies[REFRESH_TOKEN_COOKIES] || '';
    const result = req.unsignCookie(value);
    return result.value || value;
  }

  setCookie(
    reply: FastifyReply,
    token: string,
    options?: Partial<CookieSerializeOptions>
  ) {
    options = this.getCookieOpts(options);

    if (token) {
      return reply.setCookie(REFRESH_TOKEN_COOKIES, token, options);
    }

    return reply.clearCookie(REFRESH_TOKEN_COOKIES, options);
  }

  deleteToken(req: FastifyRequest) {
    return this.delete({ refreshToken: req.cookies[REFRESH_TOKEN_COOKIES] });
  }
}
