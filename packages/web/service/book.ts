import { routes } from '@/constants';
import {
  Param$CreateBook,
  Param$GetBooks,
  Param$UpdateBook,
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

export const getBook = ({ id }: { id: string }) =>
  api.get<Schema$Book>(routes.get_book.generatePath({ id }));

export const getBookByName = ({ bookName }: { bookName: string }) =>
  api.get<Schema$Book>(
    routes.get_book_by_name.generatePath({ name: bookName })
  );

export const updateBook = ({ id, ...payload }: Param$UpdateBook) =>
  api.patch<Schema$Book>(routes.update_book.generatePath({ id }), payload);

export const publishBook = ({ id }: { id: string }) =>
  api.post<Schema$Book>(
    routes.public_finish_book.generatePath({ id, type: 'public' })
  );

export const finishBook = ({ id }: { id: string }) =>
  api.post<Schema$Book>(
    routes.public_finish_book.generatePath({ id, type: 'finish' })
  );
