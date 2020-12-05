import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  Query,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FastifyRequest } from 'fastify';
import { FilterQuery } from 'mongoose';
import { routes } from '@/constants';
import { ObjectId } from '@/decorators';
import { Book } from '@/modules/book/schemas/book.schema';
import { BookService } from '@/modules/book/book.service';
import { BookStatus, ChapterStatus, ChapterType, UserRole } from '@/typings';
import { Access, AccessPipe } from '@/utils/access';
import { ChapterService } from './chapter.service';
import { Chapter } from './schemas/chapter.schema';
import { PublicChapterEvent } from './event';
import { CreateChapterDto, GetChaptersDto, UpdateChapterDto } from './dto';

@Controller(routes.chapter.prefix)
export class ChapterController {
  constructor(
    private readonly bookService: BookService,
    private readonly chapterService: ChapterService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Access('chapter_create')
  @Post(routes.chapter.create_chapter)
  async create(
    @Req() { user }: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @Body() createChapterDto: CreateChapterDto
  ) {
    const author = user?.user_id;

    const bookQuery: FilterQuery<Book> = {
      _id: bookID,
      author
    };

    // finished book cannot create pay chapter
    if (createChapterDto.type === ChapterType.Pay) {
      bookQuery.status = { $ne: BookStatus.Finished };
    }

    const bookExists = await this.bookService.exists(bookQuery);

    if (bookExists) {
      const query = {
        book: bookID,
        author
      };
      const count = await this.chapterService.countDocuments(query);

      createChapterDto.content = createChapterDto.content.trimEnd();

      return this.chapterService.create({
        number: count + 1,
        ...createChapterDto,
        ...query
      });
    }

    throw new BadRequestException('book not found or status is not allow');
  }

  @Access('chapter_update')
  @Patch(routes.chapter.update_chapter)
  async update(
    @Req() { user }: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @ObjectId('chapterID') chapterID: string,
    @Body(AccessPipe) updateChapterDto: UpdateChapterDto
  ) {
    const query: FilterQuery<Chapter> = {
      _id: chapterID,
      book: bookID
    };

    if (user?.role === UserRole.Author) {
      query.author = user.user_id;
    }

    if (updateChapterDto.type === ChapterType.Pay) {
      const finished = await this.bookService.exists({
        _id: bookID,
        status: { $ne: BookStatus.Finished }
      });
      if (finished)
        new BadRequestException(
          `cannot set chapter type to pay as book is finished`
        );
    }

    const chapter = await this.chapterService.update(query, updateChapterDto);

    if (!chapter) {
      throw new BadRequestException(`book or chapter not found`);
    }

    return chapter;
  }

  @Access('chapter_delete')
  @Delete(routes.chapter.delete_chapter)
  delete(
    @ObjectId('bookID') bookID: string,
    @ObjectId('chapterID') chapterID: string
  ) {
    return this.chapterService.delete({ _id: chapterID, book: bookID });
  }

  @Access('Optional')
  @Get(routes.chapter.get_chapters)
  getChapters(
    @Req() { user }: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @Query(AccessPipe) { timestamp, ...query }: GetChaptersDto
  ) {
    const chapterQuery = {
      ...query,
      ...(this.chapterService.getRoleBasedQuery(user) as GetChaptersDto)
    };

    // do not select these properties
    let projection: { [K in keyof Chapter]?: number } = {
      content: 0
    };

    if (!timestamp) {
      projection = {
        ...projection,
        createdAt: 0,
        updatedAt: 0
      };
    }

    return this.chapterService.paginate(
      {
        ...chapterQuery,
        book: bookID
      },
      { projection }
    );
  }

  async handleGetChapter(
    { user }: FastifyRequest,
    bookID: string,
    query: FilterQuery<Chapter>
  ) {
    const chapterQuery: FilterQuery<Chapter> = {
      ...this.chapterService.getRoleBasedQuery(user),
      ...query,
      book: bookID
    };

    const chapter = await this.chapterService.findOne(chapterQuery);

    if (!chapter) {
      throw new BadRequestException(`chapter not found`);
    }

    return chapter;
  }

  @Access('Optional')
  @Get(routes.chapter.get_chapter)
  async getChapter(
    @Req() req: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @ObjectId('chapterID') chapterID: string
  ) {
    return this.handleGetChapter(req, bookID, { _id: chapterID });
  }

  @Access('Optional')
  @Get(routes.chapter.get_chapter_by_no)
  async getChapterbyNo(
    @Req() req: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @Param('chapterNo', ParseIntPipe) chapterNo: number
  ) {
    return this.handleGetChapter(req, bookID, { number: chapterNo });
  }

  @Access('chapter_public')
  @HttpCode(HttpStatus.OK)
  @Post(routes.chapter.public_chapter)
  async public(
    @Req() req: FastifyRequest<any>,
    @ObjectId('bookID') bookID: string,
    @ObjectId('chapterID') chapterID: string
  ) {
    // TODO: chapter cannot public if book is not public ?

    const result = await this.chapterService.update(
      {
        _id: chapterID,
        book: bookID,
        author: req.user?.user_id,
        status: ChapterStatus.Private
      },
      {
        status: ChapterStatus.Public
      }
    );

    if (!result) {
      throw new BadRequestException(
        `book or chapter not found or current status is not allow`
      );
    }

    this.eventEmitter.emitAsync(
      PublicChapterEvent.name,
      new PublicChapterEvent({ bookID, chapterID })
    );

    return result;
  }
}
