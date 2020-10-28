import { Controller, Post, Body } from '@nestjs/common';
import { routes } from '@/constants';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';

@Controller(routes.user.prefix)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(routes.user.create_user)
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
