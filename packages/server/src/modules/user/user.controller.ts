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
  BadRequestException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { routes } from '@/constants';
import { ObjectId } from '@/decorators';
import { UserRole, UserStatus } from '@/typings';
import { Access, AccessPipe } from '@/utils/access';
import { Condition } from '@/utils/mongoose';
import { UserService } from './user.service';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dto';

@Controller(routes.user.prefix)
export class UserController {
  private roles: Partial<Record<UserRole, { role: UserRole }[]>>;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    const _roles = Object.values(UserRole);
    this.roles = {
      [UserRole.Root]: _roles.map(role => ({ role })),
      [UserRole.Admin]: _roles
        .filter(r => ![UserRole.Root, UserRole.Admin].includes(r))
        .map(role => ({ role })),
      [UserRole.Guest]: _roles
        .filter(r => ![UserRole.Root, UserRole.Admin].includes(r))
        .map(role => ({ role }))
    };
  }

  @Access('user_get_all')
  @Get(routes.user.get_users)
  getUsers(@Query(AccessPipe) query: GetUsersDto, @Req() req: FastifyRequest) {
    let condition: Condition[] = [];

    if (req.user) {
      condition = [
        ...condition,
        { $or: this.roles[req.user.role] },
        { $nor: [{ username: req.user.username }] } // Exclude self
      ];
    }

    return this.userService.paginate({
      ...query,
      condition
    });
  }

  @Access('user_get')
  @Get(routes.user.get_user)
  async getUser(@Req() { user }: FastifyRequest, @ObjectId('id') id: string) {
    const result = await this.userService.findOne({ _id: id });

    if (
      !result ||
      (result.role === user?.role && String(result._id) !== user?.user_id)
    ) {
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
      throw new BadRequestException(`user not found`);
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

    const targetUser = await this.userService.findOne({ _id: id });
    let error: string | undefined = undefined;
    if (targetUser?.role === UserRole.Root) error = 'cannot delete root user';
    if (targetUser?.role === UserRole.Admin && req.user?.role !== UserRole.Root)
      error = 'admin user cannot delete by other admin';

    if (error) {
      throw new ForbiddenException(error);
    }

    return this.userService.updateOne(
      { _id: id },
      { status: UserStatus.Deleted }
    );
  }
}
