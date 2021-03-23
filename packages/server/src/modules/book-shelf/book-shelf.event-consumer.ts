import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PublishChapterEvent } from '@/modules/chapter/event';
import { BookShelfService } from './book-shelf.service';

@Injectable()
export class BookShelfEventConsumer {
  constructor(private readonly bookShelfService: BookShelfService) {}

  @OnEvent(PublishChapterEvent.name, { promisify: true })
  onPublishChapater(payload: PublishChapterEvent) {
    return this.bookShelfService.updateMany(
      { book: String(payload.book) },
      { latestChapter: String(payload._id) }
    );
  }
}
