import { routes } from '@/constants';
import {
  Param$CreateBook,
  Param$GetBooks,
  Schema$Book,
  PaginateResult
} from '@/typings';
import { api } from './api';
import { handleCloudinaryUpload } from './cloudinary';

export const createBook = async (payload: Param$CreateBook) => {
  if (payload.cover && typeof payload.cover !== 'string') {
    payload.cover = await handleCloudinaryUpload(payload.cover).toPromise();
  }
  return api.post<Schema$Book>(routes.create_book, payload);
};

export const getBooks = (params?: Param$GetBooks) =>
  api.get<PaginateResult<Schema$Book>>(routes.get_books, { params });
