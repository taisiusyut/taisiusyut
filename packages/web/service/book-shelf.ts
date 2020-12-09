import { routes } from '@/constants';
import { Param$UpdateBookInShelf, Schema$BookShelf } from '@/typings';
import { api } from './api';

export const getBookShelf = () =>
  api.get<Schema$BookShelf[]>(routes.get_books_from_shelf, {});

export const addBookToShelf = (bookID: string) =>
  api.post<Schema$BookShelf>(routes.add_book_to_shelf.generatePath({ bookID }));

export const removeBookToShelf = (bookID: string) =>
  api.delete<Schema$BookShelf>(
    routes.remove_book_from_shelf.generatePath({ bookID })
  );

export const updateBookInShelf = ({
  bookID,
  ...payload
}: Param$UpdateBookInShelf) =>
  api.patch<Schema$BookShelf>(
    routes.update_book_in_shelf.generatePath({ bookID }),
    payload
  );
