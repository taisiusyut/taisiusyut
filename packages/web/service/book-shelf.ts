import { routes } from '@/constants';
import {
  Param$GetBooksFromShelf,
  Param$UpdateBookInShelf,
  Schema$BookShelf
} from '@/typings';
import { api } from './api';

export const getBookShelf = (params?: Param$GetBooksFromShelf) =>
  api.get<Schema$BookShelf[]>(routes.get_books_from_shelf, { params });

export const addBookToShelf = (bookID: string) =>
  api.post<Schema$BookShelf>(routes.add_book_to_shelf.generatePath({ bookID }));

export const removeBookFromShelf = (bookID: string) =>
  api.delete(routes.remove_book_from_shelf.generatePath({ bookID }));

export const removeBookFromShelfById = (id: string) =>
  api.delete(routes.remove_book_from_shelf_by_id.generatePath({ id }));

export const updateBookInShelf = ({
  bookID,
  ...payload
}: Param$UpdateBookInShelf) =>
  api.patch<Schema$BookShelf>(
    routes.update_book_in_shelf.generatePath({ bookID }),
    payload
  );
