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
import { FilterQuery } from 'mongoose';
import { FastifyRequest } from 'fastify';
import { Access } from '@/guard/access.guard';
import { routes } from '@/constants';
import { BookService } from './book.service';
import { ObjectId } from '@/decorators';
import { BookStatus, UserRole } from '@/typings';
import { Condition } from '@/utils/mongoose';
import { AccessPipe } from '@/pipe';
import { CreateBookDto, GetBooksDto, UpdateBookDto } from './dto';
import { Book } from './schemas/book.schema';

const allBookStatus = Object.values(BookStatus).filter(
  (v): v is BookStatus => typeof v === 'number'
);

@Controller('book')
export class BookController {
  private bookStatus = allBookStatus.map(status => ({ status }));
  private publicStatus = [
    { status: BookStatus.Public },
    { status: BookStatus.Finished }
  ];

  constructor(private readonly bookService: BookService) {}

  isPublicStatus(status: BookStatus) {
    return [BookStatus.Public, BookStatus.Finished].includes(status);
  }

  @Access('Author')
  @Post(routes.book.create_book)
  create(@Req() req: FastifyRequest, @Body() createBookDto: CreateBookDto) {
    return this.bookService.create({
      ...createBookDto,
      author: req.user?.user_id
    });
  }

  @Access('Root', 'Admin', 'Author')
  @Patch(routes.book.update_book)
  update(
    @Req() { user }: FastifyRequest,
    @ObjectId('id') id: string,
    @Body(AccessPipe) updateBookDto: UpdateBookDto
  ) {
    const query: FilterQuery<Book> = {
      _id: id
    };

    if (user?.role === UserRole.Author) {
      query.author = user.user_id;
    }

    return this.bookService.update(query, updateBookDto);
  }

  @Access('Root', 'Admin')
  @Delete(routes.book.delete_book)
  delete(@ObjectId('id') id: string) {
    return this.bookService.delete({ _id: id });
  }

  @Access('Optional')
  @Get(routes.book.get_book)
  async getBook(@Req() req: FastifyRequest, @ObjectId('id') id: string) {
    const user = req.user;
    const query: Parameters<BookService['findOne']>[0] = {
      _id: id
    };

    // make sure client/tourist cannot access other books status
    if (!user?.role || user.role === UserRole.Client) {
      query.$or = this.publicStatus;
    }

    const book = await this.bookService.findOne(query);

    if (book) {
      const author = (book.author as unknown) as { _id: ObjectID };
      // make sure author cannot get other authors non-public book

      if (
        user?.role === UserRole.Root ||
        user?.role === UserRole.Admin ||
        this.isPublicStatus(book.status) ||
        (user?.role === UserRole.Author && author._id.equals(user.user_id))
      ) {
        return book;
      }
    }

    throw new NotFoundException('Book not found');
  }

  @Access('Optional')
  @Get(routes.book.get_books)
  getBooks(@Req() req: FastifyRequest, @Query() query: GetBooksDto) {
    const user = req.user;
    const condition: Condition[] = [];

    if (!user?.role || user.role === UserRole.Client) {
      if (!query.status || !this.isPublicStatus(query.status)) {
        delete query.status;
        condition.push({ $or: this.publicStatus });
      }
    } else if (user.role === UserRole.Author) {
      // make sure author cannot get other authors non-public book
      if (query.status) {
        query.author = user.user_id;
      } else {
        condition.push({
          $or: this.bookStatus.map(payload =>
            this.isPublicStatus(payload.status)
              ? payload
              : { ...payload, author: user.user_id }
          )
        });
      }
    }

    return this.bookService.paginate({ ...query, condition });
  }

  @Access('Author')
  @Post(routes.book.public_book)
  public(@Req() { user }: FastifyRequest, @ObjectId('id') id: string) {
    // TODO: check chapter length ?
    return this.bookService.update(
      { _id: id, author: user?.user_id, status: BookStatus.Private },
      { status: BookStatus.Public }
    );
  }

  @Access('Author')
  @Post(routes.book.finish_book)
  finish(@Req() { user }: FastifyRequest, @ObjectId('id') id: string) {
    // TODO: check chapter length ?
    return this.bookService.update(
      { _id: id, author: user?.user_id, status: BookStatus.Public },
      { status: BookStatus.Finished }
    );
  }
}
