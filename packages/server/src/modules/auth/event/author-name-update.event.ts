export class AuthorNameUpdateEvent {
  authorId: string;

  authorName: string;

  constructor(payload: AuthorNameUpdateEvent) {
    Object.assign(this, payload);
  }
}
