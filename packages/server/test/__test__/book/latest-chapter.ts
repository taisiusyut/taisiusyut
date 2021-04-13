import { Schema$Book } from '@/typings';
import { mapToLatestChapter } from '../../service/book-shelf';
import { getGlobalUser, setupUsers } from '../../service/auth';
import { createBook, getBook, publishBook } from '../../service/book';
import { createChapter, publishChapter } from '../../service/chapter';

export function testLatestChapter() {
  const books: Schema$Book[] = [];
  const length = 1;

  const users = ['root', 'admin', 'author', 'client'];

  beforeAll(async () => {
    await setupUsers();

    for (let i = 0; i < length; i++) {
      const response = await createBook(author.token);
      const book = response.body;
      await publishBook(author.token, book.id);
      books.push(book);
    }
  });

  test('latest chapter will be update after author publish the chapter', async () => {
    const response = await createChapter(author.token, books[0].id);
    const chapter = response.body;

    await publishChapter(author.token, books[0].id, chapter.id);

    for (const user of users) {
      const response = await getBook(getGlobalUser(user).token, books[0].id);
      expect(response.body.latestChapter).toEqual(mapToLatestChapter(chapter));
      expect(response.body.lastPublishedAt).toEqual(expect.any(Number));
    }
  });
}
