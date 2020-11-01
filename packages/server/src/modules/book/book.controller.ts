import { Controller, Post, Body, Req, Patch } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Access } from '@/guard/access.guard';
import { routes } from '@/constants';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { ObjectId } from '@/decorators';

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
  update(@ObjectId('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update({ _id: id }, updateBookDto);
  }
}
