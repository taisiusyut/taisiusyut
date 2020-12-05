import { FastifyRequest } from 'fastify';
import {
  BadRequestException,
  Controller,
  Delete,
  Patch,
  Post,
  Req
} from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { ChapterService } from '@/modules/chapter/chapter.service';
import { ObjectId } from '@/decorators';
import { routes } from '@/constants';
import { BookShelfService } from './book-shelf.service';
import { UpdateBookInShelfDto } from './dto';
import { Order } from '@/typings';
import { BookShelf } from './schemas';

@Controller(routes.book_shelf.prefix)
export class BookShelfController {
  constructor(
    private readonly bookService: BookService,
    private readonly bookShelfService: BookShelfService,
    private readonly chapterService: ChapterService
  ) {}

  @Post(routes.book_shelf.add_book_to_shelf)
  async add(@Req() req: FastifyRequest, @ObjectId('bookID') bookID: string) {
    const bookExists = await this.bookService.exists(
      this.bookService.getRoleBasedQuery(req.user, { _id: bookID })
    );

    if (bookExists) {
      const [chapter] = await this.chapterService.findAll(
        { book: bookID },
        null,
        { limit: 1, sort: { createdAt: Order.DESC } }
      );

      const payload: Partial<BookShelf> = {
        user: req.user?.user_id,
        book: bookID,
        latestChapter: chapter._id
      };

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
}
