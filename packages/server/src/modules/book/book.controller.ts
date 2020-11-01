import { Controller, Post, Body, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Access } from '@/guard/access.guard';
import { routes } from '@/constants';
import { BookService } from './book.service';
import { CreateBookDto } from './dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Access('Author')
  @Post(routes.book.create_book)
  create(@Body() createBookDto: CreateBookDto, @Req() req: FastifyRequest) {
    return this.bookService.create({
      ...createBookDto,
      author: req.user.user_id
    });
  }
}
