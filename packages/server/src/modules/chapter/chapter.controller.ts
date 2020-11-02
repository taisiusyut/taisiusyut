import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { ObjectId } from '@/decorators';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { BookService } from '../book/book.service';

@Controller(routes.chapter.prefix)
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly bookService: BookService
  ) {}

  @Access('Author')
  @Post(routes.chapter.create_chapter)
  async create(
    @ObjectId('bookID') bookID: string,
    @Body() createChapterDto: CreateChapterDto
  ) {
    const book = await this.bookService.findOne({ _id: bookID });

    if (book) {
      return this.chapterService.create({ ...createChapterDto, book: bookID });
    }

    throw new BadRequestException('Book not found');
  }
}
