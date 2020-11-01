import {
  Controller,
  Post,
  Body,
  Req,
  Patch,
  Delete,
  Get,
  Query
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Access } from '@/guard/access.guard';
import { routes } from '@/constants';
import { BookService } from './book.service';
import { ObjectId } from '@/decorators';
import { UserRole } from '@/typings';
import { CreateBookDto, UpdateBookDto } from './dto';
import { BookStatusPipe } from './book-status.pipe';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

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
}
