import { plainToClass } from 'class-transformer';
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { routes } from '@/constants';
import { UserRole } from '@/typings';
import { Access } from '@/utils/access';
import { GetAuthorDto } from './dto/get-author.dto';
import { UserService } from './user.service';

@Controller(routes.author.prefix)
export class AuthorController {
  constructor(private readonly userService: UserService) {}

  @Access('Everyone')
  @Get(routes.author.get_author_by_name)
  async getByAuthorName(@Param('authorName') authorName: string) {
    const author = await this.userService.findOne({
      role: UserRole.Author,
      nickname: authorName
    });

    if (author) {
      return plainToClass(GetAuthorDto, author.toJSON());
    }

    throw new NotFoundException();
  }
}
