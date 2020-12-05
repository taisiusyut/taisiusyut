export class PublicChapterEvent {
  bookID: string;

  chapterID: string;

  constructor(payload: PublicChapterEvent) {
    Object.assign(this, payload);
  }
}
