import { UpdateBookInShelfDto } from '@/modules/book-shelf/dto';
import { routes } from '@/constants';

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
