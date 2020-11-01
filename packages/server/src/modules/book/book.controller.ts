import { Controller, Post, Body, Req, Patch, Get, Query } from '@nestjs/common';
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
