import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthorNameUpdateEvent } from '@/modules/auth/event';
import { PublicChapterEvent } from '@/modules/chapter/event';
import { BookService } from './book.service';

@Injectable()
export class BookEventConsumer {
  constructor(private readonly bookService: BookService) {}

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
      { _id: String(payload._id) },
      { $inc: { wordCount: payload.wordCount } }
    );
  }
}
