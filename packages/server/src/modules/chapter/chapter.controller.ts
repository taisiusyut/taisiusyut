import {
  Controller,
  Post,
  Body,
  Patch,
  Req,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { MongooseFilterQuery } from 'mongoose';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { ObjectId } from '@/decorators';
import { AccessPipe } from '@/pipe';
import { BookService } from '@/modules/book/book.service';
import { ChapterService } from './chapter.service';
import { CreateChapterDto, UpdateChapterDto } from './dto';
import { UserRole } from '@/typings';
import { Chapter } from './schemas/chapter.schema';

@Controller(routes.chapter.prefix)
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly bookService: BookService
  ) {}

  @Access('Author')
  @Post(routes.chapter.create_chapter)
  async create(
    @Req() req: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @Body() createChapterDto: CreateChapterDto
  ) {
    const author = req.user?.user_id;
    const book = await this.bookService.findOne({ _id: bookID, author });

    if (!author) {
      throw new InternalServerErrorException(
        `create book failure, "author" should be defined but receive ${author}`
      );
    }

    if (book) {
      return this.chapterService.create({
        ...createChapterDto,
        book: bookID,
        author
      });
    }

    throw new BadRequestException('Book not found');
  }

  @Access('Root', 'Admin', 'Author')
  @Patch(routes.chapter.update_chapter)
  async update(
    @Req() req: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @ObjectId('chapterID') chapterID: string,
    @Body(AccessPipe) updateChapterDto: UpdateChapterDto
  ) {
    const { user_id, role } = req.user || {};

    if (!user_id) {
      throw new InternalServerErrorException(
        `update book failure, "user_id" should be defined but receive ${user_id}`
      );
    }

    const query: MongooseFilterQuery<Chapter> = {
      _id: chapterID,
      book: bookID
    };

    if (role === UserRole.Author) {
      query.author = user_id;
    }

    return this.chapterService.update(query, updateChapterDto, {
      upsert: false
    });
  }
}
