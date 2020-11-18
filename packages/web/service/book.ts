import { routes } from '@/constants';
import { Param$CreateBook, Schema$Book } from '@/typings';
import { api } from './api';

export const createBook = (payload: Param$CreateBook) =>
  api.post<Schema$Book>(routes.create_book, payload);
