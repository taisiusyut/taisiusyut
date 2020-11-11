import { FastifyRequest } from 'fastify';
import {
  Controller,
  Post,
  Patch,
  Body,
  Req,
  ForbiddenException,
  Get,
  Query,
  Delete,
  BadRequestException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { ObjectId } from '@/decorators';
import { UserRole } from '@/typings';
import { Condition } from '@/utils/mongoose';
import { UserService } from './user.service';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dto';

@Access('Root', 'Admin')
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
        .map(role => ({ role }))
    };
  }

  @Get(routes.user.get_users)
  getAll(@Query() query: GetUsersDto, @Req() req: FastifyRequest) {
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

  @Post(routes.user.create_user)
  create(@Req() req: FastifyRequest, @Body() createUserDto: CreateUserDto) {
    if (
      createUserDto.role === UserRole.Root &&
      req.user?.username !== this.configService.get<string>('DEFAULT_USERNAME')
    ) {
      throw new ForbiddenException('Root user can only create by default root');
    }

    if (
      createUserDto.role === UserRole.Admin &&
      req.user?.role !== UserRole.Root
    ) {
      throw new ForbiddenException('Admin user cannot create by other admin');
    }

    return this.userService.create(createUserDto);
  }

  @Access('Root', 'Admin', 'Self')
  @Patch(routes.user.update_user)
  async update(
    @Req() { user }: FastifyRequest,
    @ObjectId('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const self = id === user?.user_id;
    const query = {
      _id: id,
      role: user?.role // for mongoose discriminator
    };

    let error: string | undefined;

    if (!self) {
      const targetUser = await this.userService.findOne({ _id: id });
      // Root user should have one only.
      // If the request user is the root user,
      // `self` should be true and will not enter this section
      if (targetUser?.role === UserRole.Root) error = '';
      if (targetUser?.role === UserRole.Admin && user?.role !== UserRole.Root)
        error = 'Admin user cannot update by other admin';

      delete query.role;
    }

    if (typeof error === 'string') {
      throw new ForbiddenException(error);
    }

    const result = await this.userService.update(query, updateUserDto);

    if (!result) {
      throw new BadRequestException(`user not found`);
    }
    return result;
  }

  @Delete(routes.user.delete_user)
  async delete(@Req() req: FastifyRequest, @ObjectId('id') id: string) {
    const self = id === req.user?.user_id;

    if (self) {
      throw new BadRequestException(
        `Should not delete account using this endpoint`
      );
    }

    const targetUser = await this.userService.findOne({ _id: id });
    let error: string | undefined = undefined;
    if (targetUser?.role === UserRole.Root) error = 'Cannot delete root user';
    if (targetUser?.role === UserRole.Admin && req.user?.role !== UserRole.Root)
      error = 'Admin user cannot delete by other admin';

    if (error) {
      throw new ForbiddenException(error);
    }

    return this.userService.delete({ _id: id });
  }
}
