import {
  Controller,
  Post,
  Body,
  Req,
  Patch,
  Delete,
  Get,
  Query,
  NotFoundException,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { FastifyRequest } from 'fastify';
import { routes } from '@/constants';
import { BookService } from './book.service';
import { ObjectId } from '@/decorators';
import { BookStatus } from '@/typings';
import { Condition } from '@/utils/mongoose';
import { AccessPipe, Access } from '@/utils/access';
import { CreateBookDto, GetBooksDto, UpdateBookDto } from './dto';
import { Book } from './schemas/book.schema';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  isPublicStatus(status: BookStatus) {
    return [BookStatus.Public, BookStatus.Finished].includes(status);
  }

  @Access('book_create')
  @Post(routes.book.create_book)
  create(@Req() req: FastifyRequest, @Body() createBookDto: CreateBookDto) {
    return this.bookService.create({
      ...createBookDto,
      author: req.user?.user_id
    });
  }

  @Access('book_update')
  @Patch(routes.book.update_book)
  async update(
    @Req() { user }: FastifyRequest,
    @ObjectId('id') id: string,
    @Body(AccessPipe) updateBookDto: UpdateBookDto
  ) {
    const query: FilterQuery<Book> = this.bookService.getRoleBasedQuery(user, {
      _id: id
    });

    const book = await this.bookService.update(query, updateBookDto);

    if (!book) {
      throw new NotFoundException(`book not found`);
    }

    return book;
  }

  @Access('book_delete')
  @Delete(routes.book.delete_book)
  delete(@ObjectId('id') id: string) {
    return this.bookService.delete({ _id: id });
  }

  @Access('Optional')
  @Get(routes.book.get_book)
  async getBook(@Req() { user }: FastifyRequest, @ObjectId('id') id: string) {
    const query = this.bookService.getRoleBasedQuery(user, { _id: id });

    const book = await this.bookService.findOne(query);

    if (!book) {
      throw new NotFoundException('book not found');
    }

    return book;
  }

  @Access('Optional')
  @Get(routes.book.get_books)
  getBooks(
    @Req() req: FastifyRequest,
    @Query() { tag, ...query }: GetBooksDto
  ) {
    const user = req.user;
    const condition: Condition[] = [];

    if (tag) {
      condition.push({ tags: { $in: [tag] } });
    }

    return this.bookService.paginate({
      ...(this.bookService.getRoleBasedQuery(user, query) as GetBooksDto),
      condition
    });
  }

  @Access('book_public', 'book_finish')
  @HttpCode(HttpStatus.OK)
  @Post(routes.book.public_finish_book)
  async public(@Req() req: FastifyRequest<any>, @ObjectId('id') id: string) {
    // TODO: check chapter length ?

    const currStatus =
      req.params.type === 'public' ? BookStatus.Private : BookStatus.Public;

    const book = await this.bookService.update(
      { _id: id, author: req.user?.user_id, status: currStatus },
      {
        status:
          currStatus === BookStatus.Private
            ? BookStatus.Public
            : BookStatus.Finished
      }
    );

    if (!book) {
      throw new BadRequestException(
        `book not found or  or current status is not allow`
      );
    }

    return book;
  }
}
