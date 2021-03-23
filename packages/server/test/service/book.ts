import { CreateBookDto, GetBooksDto, UpdateBookDto } from '@/modules/book/dto';
import { routes } from '@/constants';
import { Param$CreateBook } from '@/typings';
import { rid } from '@/utils/rid';
import qs from 'querystring';

export function createBookDto(
  payload?: Partial<CreateBookDto>
): Param$CreateBook {
  return { name: rid(10), ...payload };
}

export function createBook(token: string, payload?: Partial<CreateBookDto>) {
  return request
    .post(routes.create_book)
    .set('Authorization', `bearer ${token}`)
    .send(createBookDto(payload));
}

export function updateBook(
  token: string,
  id: string,
  payload?: Partial<UpdateBookDto>
) {
  return request
    .patch(routes.update_book.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send(payload);
}

export function publishBook(token: string, id: string) {
  return request
    .post(routes.publish_finish_book.generatePath({ id, type: 'publish' }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function finishBook(token: string, id: string) {
  return request
    .post(routes.publish_finish_book.generatePath({ id, type: 'finish' }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function deleteBook(token: string, id: string) {
  return request
    .delete(routes.delete_book.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function getBooks(token: string, query: GetBooksDto = {}) {
  return request
    .get(routes.get_books)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query as qs.ParsedUrlQueryInput));
}

export function getBook(token: string, id: string) {
  return request
    .get(routes.get_book.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function getBookByName(token: string, name: string) {
  return request
    .get(routes.get_book_by_name.generatePath({ name }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function calcBookWordCount(token: string, id: string) {
  return request
    .post(routes.book_word_count.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}
