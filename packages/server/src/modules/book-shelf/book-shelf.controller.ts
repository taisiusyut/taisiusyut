import { FastifyRequest } from 'fastify';
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Req
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookService } from '@/modules/book/book.service';
import { ChapterService } from '@/modules/chapter/chapter.service';
import { PublicChapterEvent } from '@/modules/chapter/event';
import { ObjectId } from '@/decorators';
import { routes } from '@/constants';
import { Order } from '@/typings';
import { Access } from '@/utils/access';
import { BookShelfService } from './book-shelf.service';
import { GetBooksFromShelfDto, UpdateBookInShelfDto } from './dto';
import { BookShelf } from './schemas';
@Access('Auth')
@Controller(routes.book_shelf.prefix)
export class BookShelfController {
  constructor(
    private readonly bookService: BookService,
    private readonly bookShelfService: BookShelfService,
    private readonly chapterService: ChapterService
  ) {}

  @Get(routes.get_books_from_shelf)
  get(@Req() { user }: FastifyRequest, { sort }: GetBooksFromShelfDto) {
    if (!user) {
      throw new ForbiddenException(`user is ${user}`);
    }
    return this.bookShelfService.findAll({ user: user.user_id }, null, {
      sort
    });
  }

  @Post(routes.book_shelf.add_book_to_shelf)
  async add(@Req() req: FastifyRequest, @ObjectId('bookID') bookID: string) {
    const bookExists = await this.bookService.exists(
      this.bookService.getRoleBasedQuery(req.user, { _id: bookID })
    );

    if (bookExists) {
      const payload: Partial<BookShelf> = {
        user: req.user?.user_id,
        book: bookID
      };

      const [chapter] = await this.chapterService.findAll(
        { ...this.chapterService.getRoleBasedQuery(req.user), bookID },
        null,
        { limit: 1, sort: { createdAt: Order.DESC } }
      );

      const latestChapter = chapter?._id;
      if (latestChapter) {
        payload.latestChapter = latestChapter;
      }

      return this.bookShelfService.create(payload);
    }

    throw new BadRequestException(`book not found`);
  }

  @Delete(routes.book_shelf.remove_book_from_shelf)
  remove(@Req() req: FastifyRequest, @ObjectId('bookID') bookID: string) {
    return this.bookShelfService.delete({
      user: req.user?.user_id,
      book: bookID
    });
  }

  @Patch(routes.book_shelf.update_book_in_shelf)
  update(
    @Req() req: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    dto: UpdateBookInShelfDto
  ) {
    return this.bookShelfService.update(
      {
        user: req.user?.user_id,
        book: bookID
      },
      dto
    );
  }

  @OnEvent(PublicChapterEvent.name)
  updateLatestChapter(payload: PublicChapterEvent) {
    this.bookShelfService.updateMany(
      { book: payload.bookID },
      { latestChapter: payload.chapterID }
    );
  }
}
