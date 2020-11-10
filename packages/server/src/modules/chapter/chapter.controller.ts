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
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FilterQuery } from 'mongoose';
import { routes } from '@/constants';
import { Access } from '@/guard/access.guard';
import { ObjectId } from '@/decorators';
import { AccessPipe } from '@/pipe';
import { BookService } from '@/modules/book/book.service';
import { ChapterStatus, ChapterType, UserRole } from '@/typings';
import { Condition } from '@/utils/mongoose';
import { ChapterService } from './chapter.service';
import { Chapter } from './schemas/chapter.schema';
import { CreateChapterDto, GetChaptersDto, UpdateChapterDto } from './dto';

const allChapterStatus = Object.values(ChapterStatus).filter(
  (v): v is ChapterStatus => typeof v === 'number'
);

const allChapterType = Object.values(ChapterType).filter(
  (v): v is ChapterType => typeof v === 'number'
);

@Controller(routes.chapter.prefix)
export class ChapterController {
  readonly chapterStatus = allChapterStatus.map(status => ({ status }));
  readonly chapterTypes = allChapterType.map(type => ({ type }));

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

    const query: FilterQuery<Chapter> = {
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

  @Access('Root', 'Admin')
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
    @Req() req: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @Query(AccessPipe) query: GetChaptersDto
  ) {
    const user = req.user;
    const condition: Condition[] = [];

    if (!user?.role || user.role === UserRole.Client) {
      query.status = ChapterStatus.Public;
    } else if (user.role === UserRole.Author) {
      // make sure author cannot get other authors non-public chapters
      if (query.status) {
        query.author = user.user_id;
      } else {
        condition.push({
          $or: this.chapterStatus.map(payload =>
            payload.status === ChapterStatus.Public
              ? payload
              : { ...payload, author: user.user_id }
          )
        });
      }
    }

    // do not select these properties
    const projection: { [K in keyof Chapter]?: number } = {
      content: 0,
      createdAt: 0,
      updatedAt: 0
    };

    return this.chapterService.paginate(
      {
        ...query,
        book: bookID,
        condition
      },
      { projection }
    );
  }

  @Access('Optional')
  @Get(routes.chapter.get_chapter)
  async getChapter(
    @Req() { user }: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    @ObjectId('chapterID') chapterID: string
  ) {
    const chapter = await this.chapterService.findOne({
      _id: chapterID,
      book: bookID
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter not found`);
    }

    if (
      chapter.type === ChapterType.Pay ||
      chapter.status !== ChapterStatus.Public
    ) {
      const hasPermission =
        user?.role === UserRole.Root ||
        user?.role === UserRole.Admin ||
        (user?.role === UserRole.Author && user.user_id === chapter.author);

      if (!hasPermission) {
        throw new ForbiddenException();
      }
    }

    return chapter;
  }
}
