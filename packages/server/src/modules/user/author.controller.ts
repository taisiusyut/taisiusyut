import { plainToClass } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Req,
  BadRequestException
} from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { routes } from '@/constants';
import { BookStatus, UserRole } from '@/typings';
import { Access } from '@/utils/access';
import { ObjectId } from '@/decorators';
import { GetAuthorDto } from './dto/get-author.dto';
import { UserService } from './user.service';

@Controller(routes.author.prefix)
export class AuthorController {
  constructor(
    private readonly userService: UserService,
    private readonly bookService: BookService
  ) {}

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

  @Access('author_word_count')
  @Get(routes.author.author_word_count)
  async updateWordCount(
    @Req() { user }: FastifyRequest,
    @ObjectId({ key: 'id', optional: true })
    id?: string
  ) {
    const authorId = user?.role === UserRole.Admin ? user.user_id : id;

    if (!authorId) {
      throw new BadRequestException(
        `expect "id" to be string but receive ${id}`
      );
    }

    const { wordCount } = await this.bookService.getWordCount({
      author: authorId,
      $or: [{ status: BookStatus.Public }, { status: BookStatus.Finished }]
    });

    this.userService.findOneAndUpdate(
      {
        _id: authorId,
        role: UserRole.Author
      },
      { wordCount }
    );
  }
}
