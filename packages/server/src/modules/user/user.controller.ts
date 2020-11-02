import {
  Controller,
  Post,
  Patch,
  Body,
  Request,
  ForbiddenException,
  Get,
  Query,
  Delete,
  BadRequestException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { UserService } from './user.service';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dto';
import { ObjectId } from '@/decorators';
import { ExtendedValidationPipe } from '@/pipe/validation.pipe';
import { UserRole } from '@/typings';
import { Condition } from '@/utils/mongoose';

@Access('Root', 'Admin')
@Controller(routes.user.prefix)
export class UserController {
  private roles: Partial<Record<UserRole, { role: UserRole }[]>>;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    const _roles = Object.values(UserRole).filter(
      (v): v is UserRole => typeof v === 'number' && v !== UserRole.Root
    );
    this.roles = {
      [UserRole.Root]: _roles.map(role => ({ role })),
      [UserRole.Admin]: _roles
        .filter(r => ![UserRole.Root, UserRole.Admin].includes(r))
        .map(role => ({ role }))
    };
  }

  @Get(routes.user.get_users)
  getAll(@Query() query: GetUsersDto, @Request() req: FastifyRequest) {
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
  create(
    @Request() req: FastifyRequest,
    @Body(ExtendedValidationPipe) createUserDto: CreateUserDto
  ) {
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
    @Request() req: FastifyRequest,
    @ObjectId('id') id: string,
    @Body(ExtendedValidationPipe) updateUserDto: UpdateUserDto
  ) {
    const self = id === req.user?.user_id;
    let error: string | undefined;

    if (!self) {
      const targetUser = await this.userService.findOne({ _id: id });
      // Root user should have one only.
      // If the request user is the root user,
      // `self` should be true and will not enter this section
      if (targetUser?.role === UserRole.Root) error = '';
      if (
        targetUser?.role === UserRole.Admin &&
        req.user?.role !== UserRole.Root
      )
        error = 'Admin user cannot update by other admin';
    }

    if (typeof error === 'string') {
      throw new ForbiddenException(error);
    }

    return this.userService.update({ _id: id }, updateUserDto);
  }

  @Delete(routes.user.delete_user)
  async delete(@Request() req: FastifyRequest, @ObjectId('id') id: string) {
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
