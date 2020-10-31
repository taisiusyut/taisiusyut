import {
  Controller,
  Post,
  Body,
  Request,
  ForbiddenException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { ExtendedValidationPipe } from '@/pipe/validation.pipe';
import { UserRole } from '@/typings';

@Controller(routes.user.prefix)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @Access('Root', 'Admin')
  @Post(routes.user.create_user)
  create(
    @Request() req: FastifyRequest,
    @Body(ExtendedValidationPipe) createUserDto: CreateUserDto
  ) {
    if (
      createUserDto.role === UserRole.Root &&
      req.user.username !== this.configService.get<string>('DEFAULT_USERNAME')
    ) {
      throw new ForbiddenException('Root user can only create by default root');
    }

    if (
      createUserDto.role === UserRole.Admin &&
      req.user.role !== UserRole.Root
    ) {
      throw new ForbiddenException('Admin user cannot create by other admin');
    }

    return this.userService.create(createUserDto);
  }
}
