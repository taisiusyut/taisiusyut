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
  BadRequestException,
  Param
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { FastifyRequest } from 'fastify';
import { ChapterService } from '@/modules/chapter/chapter.service';
import { routes } from '@/constants';
import { ObjectId } from '@/decorators';
import { BookStatus, ChapterStatus, UserRole } from '@/typings';
import { AccessPipe, Access } from '@/utils/access';
import { CreateBookDto, GetBooksDto, UpdateBookDto } from './dto';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { Chapter } from '../chapter/schemas/chapter.schema';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly chapterService: ChapterService
  ) {}

  @Access('book_create')
  @Post(routes.book.create_book)
  create(@Req() req: FastifyRequest, @Body() createBookDto: CreateBookDto) {
    return this.bookService.create({
      ...createBookDto,
      wordCount: 0,
      numOfCollection: 0,
      status: BookStatus.Private,
      authorName: req.user?.nickname,
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

    const book = await this.bookService.findOneAndUpdate(query, updateBookDto);

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

  async handleGetBook(query: FilterQuery<Book>) {
    const book = await this.bookService.findOne(query);
    if (!book) {
      throw new NotFoundException('book not found');
    }
    return book;
  }

  @Access('Optional')
  @Get(routes.book.get_book)
  async get(@Req() { user }: FastifyRequest, @ObjectId('id') id: string) {
    const query = this.bookService.getRoleBasedQuery(user, { _id: id });
    return this.handleGetBook(query);
  }

  @Access('Optional')
  @Get(routes.book.get_book_by_name)
  async getByName(
    @Req() { user }: FastifyRequest,
    @Param('name') name: string
  ) {
    const query = this.bookService.getRoleBasedQuery(user, { name });
    return this.handleGetBook(query);
  }

  @Access('Optional')
  @Get(routes.book.get_books)
  async getAll(
    @Req() { user }: FastifyRequest,
    @Query() { tag, ...dto }: GetBooksDto
  ) {
    const query: FilterQuery<Book> = this.bookService.getRoleBasedQuery(
      user,
      dto
    );

    if (tag) {
      query.tags = { $in: [tag] };
    }

    return this.bookService.paginate(query);
  }

  @Access('book_publish_finish')
  @HttpCode(HttpStatus.OK)
  @Post(routes.book.publish_finish_book)
  async publish(@Req() req: FastifyRequest<any>, @ObjectId('id') id: string) {
    const currStatus =
      req.params.type === 'publish' ? BookStatus.Private : BookStatus.Public;

    const book = await this.bookService.findOneAndUpdate(
      { _id: id, authorName: req.user?.nickname, status: currStatus },
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

  @Access('book_word_count')
  @HttpCode(HttpStatus.OK)
  @Post(routes.book.book_word_count)
  async wordCount(@Req() req: FastifyRequest<any>, @ObjectId('id') id: string) {
    const chapterQuery: FilterQuery<Chapter> = {
      book: id,
      status: ChapterStatus.Public
    };

    if (req.user?.role === UserRole.Author) {
      chapterQuery.author = req.user.user_id;
    }

    const result = await this.chapterService.getWordCount(chapterQuery);

    if (!result) {
      throw new BadRequestException(`invalid book id`);
    }

    return this.update(req, id, { wordCount: result.wordCount });
  }
}
