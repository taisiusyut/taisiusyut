import { plainToClass } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import {
  Controller,
  Get,
  Req,
  Post,
  Param,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { BookShelfService } from '@/modules/book-shelf/book-shelf.service';
import { routes } from '@/constants';
import { UserRole } from '@/typings';
import { Access } from '@/utils/access';
import { ObjectId } from '@/decorators';
import { GetAuthorDto } from './dto/get-author.dto';
import { UserService } from './user.service';

@Controller(routes.author.prefix)
export class AuthorController {
  constructor(
    private readonly userService: UserService,
    private readonly bookService: BookService,
    private readonly bookShelfService: BookShelfService
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
  @HttpCode(HttpStatus.OK)
  @Post(routes.author.author_word_count)
  @Post(routes.author.author_word_count_no_id)
  async updateWordCount(
    @Req() { user }: FastifyRequest,
    @ObjectId({ key: 'id', optional: true })
    id?: string
  ) {
    const authorId = user?.role === UserRole.Author ? user.user_id : id;

    if (!authorId) {
      throw new BadRequestException(
        `expect "id" to be string but receive ${id}`
      );
    }

    const result = await this.bookService.getWordCount({
      author: authorId,
      $or: this.bookService.publicStatus
    });

    if (!result) {
      throw new BadRequestException(
        `please make sure you have at least one public book`
      );
    }

    return this.userService.findOneAndUpdate(
      {
        _id: authorId,
        role: UserRole.Author
      },
      { wordCount: result.wordCount }
    );
  }

  @Access('update_book_collection')
  @HttpCode(HttpStatus.OK)
  @Post(routes.author.update_book_collection)
  async bookCollection(
    @Req() { user }: FastifyRequest,
    @ObjectId({ key: 'id', optional: true })
    id?: string
  ) {
    const authorId = user?.role === UserRole.Author ? user.user_id : id;

    if (!authorId) {
      throw new BadRequestException(
        `expect "id" to be string but receive ${id}`
      );
    }

    const result = await this.bookService.findAll({
      author: authorId
    });

    const data: typeof result = [];
    for (const book of result) {
      const numOfCollection = await this.bookShelfService.countDocuments({
        book: String(book._id)
      });
      book.numOfCollection = numOfCollection;
      await book.updateOne({ numOfCollection }, { runValidators: true });
      data.push(book);
    }
    return data;
  }
}
