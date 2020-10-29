import { Controller, Post, Body } from '@nestjs/common';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';

@Controller(routes.user.prefix)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Access('Role')
  @Post(routes.user.create_user)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
