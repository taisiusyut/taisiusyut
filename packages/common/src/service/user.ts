import type {
  Param$CreateUser,
  Param$UpdateUser,
  Param$GetUsers,
  Schema$User,
  Schema$Author,
  PaginateResult
} from '@/typings';
import { routes } from './routes';
import { api } from './api';

export const createUser = (payload: Param$CreateUser) =>
  api.post<Schema$User>(routes.create_user, payload);

export const updateUser = ({ id, ...payload }: Param$UpdateUser) =>
  api.patch<Schema$User>(routes.update_user.generatePath({ id }), payload);

export const deleteUser = ({ id }: { id: string }) =>
  api.delete<void>(routes.delete_user.generatePath({ id }));

export const getUsers = (params?: Param$GetUsers) =>
  api.get<PaginateResult<Schema$User>>(routes.create_user, { params });

export const getUser = ({ id }: { id: string }) =>
  api.get<Schema$User>(routes.get_user.generatePath({ id }));

export const getAuthorByName = (authorName: string) =>
  api.get<Schema$Author>(
    routes.get_author_by_name.generatePath({ authorName })
  );

export const authorRequest = () =>
  api.post<Schema$Author>(routes.author_request);
