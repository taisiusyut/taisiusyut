import { routes } from '@/constants';
import {
  Param$CreateBook,
  Param$GetBooks,
  Schema$Book,
  PaginateResult
} from '@/typings';
import { api } from './api';

export const createBook = (payload: Param$CreateBook) =>
  api.post<Schema$Book>(routes.create_book, payload);

export const getBooks = (params?: Param$GetBooks) =>
  api.get<PaginateResult<Schema$Book>>(routes.get_books, { params });
