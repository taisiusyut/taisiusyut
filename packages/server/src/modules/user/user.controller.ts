import { FastifyRequest } from 'fastify';
import {
  Controller,
  Post,
  Patch,
  Body,
  Req,
  Get,
  Query,
  Delete,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from '@/modules/auth/refresh-token.service';
import { routes } from '@/constants';
import { ObjectId } from '@/decorators';
import { Schema$User, UserRole, UserStatus } from '@/typings';
import { Access, AccessPipe } from '@/utils/access';
import { UserService } from './user.service';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dto';
import { User } from './schemas/user.schema';

@Controller(routes.user.prefix)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  @Access('user_get_all')
  @Get(routes.user.get_users)
  getAll(@Req() { user }: FastifyRequest, @Query(AccessPipe) dto: GetUsersDto) {
    const roles = user?.role && this.userService.roles[user?.role];
    return this.userService.paginate({
      ...dto,
      ...(roles ? { $or: roles } : {}),
      username: { $ne: user?.username }
    });
  }

  @Access('user_get')
  @Get(routes.user.get_user)
  async get(@Req() { user }: FastifyRequest, @ObjectId('id') id: string) {
    const query = this.userService.getRoleBasedQuery(user, {
      _id: id
    });

    const result = await this.userService.findOne(query);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Access('user_create')
  @Post(routes.user.create_user)
  create(@Req() req: FastifyRequest, @Body() createUserDto: CreateUserDto) {
    if (
      createUserDto.role === UserRole.Root &&
      req.user?.username !== this.configService.get<string>('DEFAULT_USERNAME')
    ) {
      throw new ForbiddenException('root user can only create by default root');
    }

    if (
      createUserDto.role === UserRole.Admin &&
      req.user?.role !== UserRole.Root
    ) {
      throw new ForbiddenException('admin user cannot create by other admin');
    }

    return this.userService.create(createUserDto);
  }

  @Access('user_update')
  @Patch(routes.user.update_user)
  async update(
    @Req() { user }: FastifyRequest,
    @ObjectId('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const query = this.userService.getRoleBasedQuery(user, {
      _id: id
    });

    const result = await this.userService.findOneAndUpdate(
      query,
      updateUserDto
    );

    if (!result) {
      throw new NotFoundException();
    }

    if (
      !!updateUserDto.status &&
      [UserStatus.Blocked, UserStatus.Deleted].includes(updateUserDto.status)
    ) {
      await this.refreshTokenService.deleteMany({ user_id: id });
    }

    return result;
  }

  @Access('user_delete')
  @Delete(routes.user.delete_user)
  async delete(@Req() req: FastifyRequest, @ObjectId('id') id: string) {
    const self = id === req.user?.user_id;

    if (self) {
      throw new BadRequestException(
        `should not use this endpoint to delete account`
      );
    }

    const query = this.userService.getRoleBasedQuery(req.user, {
      _id: id
    });

    const user = await this.userService.findOne(query);

    if (!user) {
      throw new NotFoundException();
    }

    if (user.status !== UserStatus.Deleted) {
      throw new BadRequestException(
        `user status is ${UserStatus[user.status]} expect ${
          UserStatus[UserStatus.Deleted]
        }`
      );
    }

    const result = this.userService.delete(query);

    await this.refreshTokenService.deleteMany({ user_id: id });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Access(UserRole.Client)
  @Post(routes.user.author_request)
  async authorReuqest(@Req() req: FastifyRequest): Promise<User> {
    const tokenFromCookies = this.refreshTokenService.getCookie(req);

    if (!req.user) {
      throw new InternalServerErrorException(`user is ${req.user}`);
    }

    if (!tokenFromCookies) {
      throw new BadRequestException(`token not found`);
    }

    const update: Partial<Schema$User> = { role: UserRole.Author };
    const payload = await this.update(
      req,
      req.user?.user_id,
      update as UpdateUserDto
    );

    await this.refreshTokenService.findOneAndUpdate(
      { refreshToken: tokenFromCookies },
      { role: UserRole.Author }
    );

    return payload;
  }
}
