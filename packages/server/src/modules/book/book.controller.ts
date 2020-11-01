import {
  Controller,
  Post,
  Body,
  Req,
  Patch,
  Delete,
  Get,
  Query,
  NotFoundException
} from '@nestjs/common';
import { ObjectID } from 'mongodb';
import { FastifyRequest } from 'fastify';
import { Access } from '@/guard/access.guard';
import { routes } from '@/constants';
import { BookService } from './book.service';
import { ObjectId } from '@/decorators';
import { BookStatus, JWTSignPayload, UserRole } from '@/typings';
import { Condition } from '@/utils/mongoose';
import { CreateBookDto, GetBooksDto, UpdateBookDto } from './dto';
import { BookStatusPipe } from './book-status.pipe';

@Controller('book')
export class BookController {
  private bookStatus: { status: BookStatus }[];

  constructor(private readonly bookService: BookService) {
    const allBookStatus = Object.values(BookStatus).filter(
      (v): v is BookStatus => typeof v === 'number'
    );

    this.bookStatus = allBookStatus.map(status => ({ status }));
  }

  @Access('Author')
  @Post(routes.book.create_book)
  create(@Req() req: FastifyRequest, @Body() createBookDto: CreateBookDto) {
    return this.bookService.create({
      ...createBookDto,
      author: req.user.user_id
    });
  }

  @Access('Root', 'Admin', 'Author')
  @Patch(routes.book.update_book)
  update(
    @ObjectId('id') id: string,
    @Body(BookStatusPipe([UserRole.Root, UserRole.Admin]))
    updateBookDto: UpdateBookDto
  ) {
    return this.bookService.update({ _id: id }, updateBookDto);
  }

  @Access('Root', 'Admin')
  @Delete(routes.book.delete_book)
  delete(@ObjectId('id') id: string) {
    return this.bookService.delete({ _id: id });
  }

  @Access('Optional')
  @Get(routes.book.get_book)
  async getBook(@Req() req: FastifyRequest, @ObjectId('id') id: string) {
    const user: JWTSignPayload = req.user;
    const query: Parameters<BookService['findOne']>[0] = { _id: id };

    if (!user?.role || user.role === UserRole.Client) {
      query.status = BookStatus.Public;
    }

    const book = await this.bookService.findOne(query);

    if (book) {
      const author = (book.author as unknown) as { _id: ObjectID };
      // make sure author cannot get other authors non-public book

      if (
        book.status === BookStatus.Public ||
        user?.role === UserRole.Root ||
        user?.role === UserRole.Admin ||
        (user?.role === UserRole.Author && author._id.equals(user.user_id))
      ) {
        return book;
      }
    }

    throw new NotFoundException('Book not found');
  }

  @Access('Optional')
  @Get(routes.book.get_books)
  getBooks(
    @Req() req: FastifyRequest,
    @Query(BookStatusPipe([UserRole.Root, UserRole.Admin, UserRole.Author]))
    query: GetBooksDto
  ) {
    const user: JWTSignPayload = req.user;
    const condition: Condition[] = req.user ? [] : undefined;

    if (!user?.role || user.role === UserRole.Client) {
      query.status = BookStatus.Public;
    } else if (user.role === UserRole.Author) {
      // make sure author cannot get other authors non-public book
      if (query.status) {
        query.author = user.user_id;
      } else {
        condition.push({
          $or: this.bookStatus.map(payload =>
            payload.status === BookStatus.Public
              ? payload
              : { ...payload, author: user.user_id }
          )
        });
      }
    }

    return this.bookService.paginate({ ...query, condition });
  }
}
