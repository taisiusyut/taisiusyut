import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Patch
} from '@nestjs/common';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { ObjectId } from '@/decorators';
import { AccessPipe } from '@/pipe';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { BookService } from '../book/book.service';
import { UpdateChapterDto } from './dto';

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

  @Access('Root', 'Admin', 'Author')
  @Patch(routes.chapter.update_chapter)
  async update(
    @ObjectId('bookID') bookID: string,
    @ObjectId('chapterID') chapterID: string,
    @Body(AccessPipe) updateChapterDto: UpdateChapterDto
  ) {
    return this.chapterService.update(
      { _id: chapterID, book: bookID },
      updateChapterDto,
      { upsert: false }
    );
  }
}
