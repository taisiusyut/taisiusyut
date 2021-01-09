import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthorNameUpdateEvent } from '@/modules/auth/event';
import { PublicChapterEvent } from '@/modules/chapter/event';
import { UserService } from '@/modules/user/user.service';
import { BookService } from './book.service';
import { UserRole } from '@/typings';

@Injectable()
export class BookEventConsumer {
  constructor(
    private readonly bookService: BookService,
    private readonly userService: UserService
  ) {}

  @OnEvent(AuthorNameUpdateEvent.name, { promisify: true })
  async onAuthorNameUpdate(payload: AuthorNameUpdateEvent) {
    await this.bookService.updateMany(
      { author: payload.authorId },
      { authorName: payload.authorName }
    );
  }

  @OnEvent(PublicChapterEvent.name, { promisify: true })
  async onPublicChapater(payload: PublicChapterEvent) {
    await this.bookService.updateOne(
      { _id: String(payload.book) },
      { $inc: { wordCount: payload.wordCount } }
    );

    await this.userService.updateOne(
      { _id: String(payload.author), role: UserRole.Author },
      { $inc: { wordCount: payload.wordCount } }
    );
  }
}
