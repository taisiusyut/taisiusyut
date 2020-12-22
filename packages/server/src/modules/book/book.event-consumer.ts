import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthorNameUpdateEvent } from '@/modules/auth/event';
import { BookService } from './book.service';

@Injectable()
export class BookEventConsumer {
  constructor(private readonly bookService: BookService) {}

  @OnEvent(AuthorNameUpdateEvent.name, { promisify: true })
  async onPublicChapater(payload: AuthorNameUpdateEvent) {
    await this.bookService.updateMany(
      { author: payload.authorId },
      { authorName: payload.authorName }
    );
  }
}
