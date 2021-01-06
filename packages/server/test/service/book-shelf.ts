import { UpdateBookInShelfDto } from '@/modules/book-shelf/dto';
import { latestChapterSelect } from '@/modules/book-shelf/schemas/book-shelf.schema';
import { routes } from '@/constants';
import { Schema$Chapter } from '@/typings';

export function addBookToShelf(token: string, bookID: string) {
  return request
    .post(routes.add_book_to_shelf.generatePath({ bookID }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function removeBookFromShelf(token: string, bookID: string) {
  return request
    .delete(routes.remove_book_from_shelf.generatePath({ bookID }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function removeBookFromShelfById(token: string, id: string) {
  return request
    .delete(routes.remove_book_from_shelf_by_id.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function updateBookInShelf(
  token: string,
  bookID: string,
  payload: UpdateBookInShelfDto
) {
  return request
    .patch(routes.update_book_in_shelf.generatePath({ bookID }))
    .set('Authorization', `bearer ${token}`)
    .send(payload);
}

export function getBooksFromShelf(token: string) {
  return request
    .get(routes.get_books_from_shelf)
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function mapToLatestChapter(chapter: Schema$Chapter) {
  return Object.keys(latestChapterSelect).reduce(
    (result, key) => ({
      ...result,
      [key]: chapter[key as keyof Schema$Chapter]
    }),
    {} as Partial<Schema$Chapter>
  );
}
